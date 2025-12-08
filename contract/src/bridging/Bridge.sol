// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title Celo-Base Sepolia Bridge (improved)
 *
 * Notes:
 *  - Uses SafeERC20 for ERC20 transfers (handles tokens that don't return bool).
 *  - Uses ECDSA for signature verification using OpenZeppelin helpers.
 *  - Uses an internal monotonically-increasing nonce (lockNonce) for lock events (instead of block.prevrandao).
 *  - Allows anyone to call unlockTokens as long as the relayer signed the payload (more decentralized).
 *  - Keeps an onlyOwner function to update relayer and token parameters.
 */
contract Bridge is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    // Chain IDs
    uint256 public constant CELO_SEPOLIA_CHAIN_ID = 11142220;
    uint256 public constant BASE_SEPOLIA_CHAIN_ID = 84532;

    // Token contract address (will be different on each chain)
    address public tokenAddress;

    // Trusted relayer address for cross-chain message signing
    address public relayer;

    // Nonce used for TokenLocked events to make unique event identifiers
    uint256 public lockNonce;

    // Mapping to track processed transactions to prevent replay attacks
    mapping(bytes32 => bool) public processedTransactions;

    // Optional flag: does the local token support mint(address,uint256)?
    // If true, unlock on this chain will call token.mint(recipient, amount)
    bool public tokenIsMintable;

    // Events
    event TokensLocked(
        address indexed from,
        uint256 amount,
        uint256 targetChainId,
        address indexed targetRecipient,
        uint256 nonce
    );

    event TokensUnlocked(
        address indexed recipient,
        uint256 amount,
        uint256 sourceChainId,
        bytes32 sourceTxHash,
        bytes32 txId
    );

    event RelayerUpdated(address indexed oldRelayer, address indexed newRelayer);
    event TokenAddressUpdated(address indexed oldToken, address indexed newToken);
    event TokenMintableUpdated(bool oldFlag, bool newFlag);

    /**
     * @dev Constructor sets the token address and initial relayer
     * @param _tokenAddress Address of the ERC20 token contract for this chain
     * @param _relayer Address of the trusted relayer (signer)
     * @param _tokenIsMintable Whether this chain's token supports mint(address,uint256)
     * @param _initialOwner The initial owner of the contract
     */
    constructor(address _tokenAddress, address _relayer, bool _tokenIsMintable, address _initialOwner) Ownable(_initialOwner) {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_relayer != address(0), "Invalid relayer address");
        require(_initialOwner != address(0), "Invalid initial owner");

        tokenAddress = _tokenAddress;
        relayer = _relayer;
        tokenIsMintable = _tokenIsMintable;
        lockNonce = 0;
    }

    /**
     * @dev Locks tokens to be bridged to the target chain
     * @param _amount Amount of tokens to lock
     * @param _targetChainId Chain ID of the target chain
     * @param _targetRecipient Recipient address on the target chain
     */
    function lockTokens(
        uint256 _amount,
        uint256 _targetChainId,
        address _targetRecipient
    ) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(_targetChainId != block.chainid, "Cannot bridge to same chain");
        require(
            _targetChainId == CELO_SEPOLIA_CHAIN_ID || _targetChainId == BASE_SEPOLIA_CHAIN_ID,
            "Unsupported target chain"
        );
        require(_targetRecipient != address(0), "Invalid recipient");

        // Transfer tokens from user to this contract (uses SafeERC20)
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), _amount);

        // Use a simple incrementing nonce for uniqueness and to avoid using block globals
        lockNonce += 1;
        uint256 nonce = lockNonce;

        emit TokensLocked(msg.sender, _amount, _targetChainId, _targetRecipient, nonce);
    }

    /**
     * @dev Unlocks (or mints) tokens on this chain.
     * Anybody may call this function, but the relayer must have signed the payload.
     * @param _recipient Address to receive unlocked tokens
     * @param _amount Amount to unlock
     * @param _sourceChainId Chain ID where tokens were locked
     * @param _sourceTxHash Transaction hash or event identifier from source chain
     * @param _nonce Nonce from the source lock event (recommended)
     * @param _signature Signature produced by the relayer signing the message
     */
    function unlockTokens(
        address _recipient,
        uint256 _amount,
        uint256 _sourceChainId,
        bytes32 _sourceTxHash,
        uint256 _nonce,
        bytes calldata _signature
    ) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(_recipient != address(0), "Invalid recipient");
        require(_sourceChainId != block.chainid, "Source chain cannot equal current chain");
        require(
            _sourceChainId == CELO_SEPOLIA_CHAIN_ID || _sourceChainId == BASE_SEPOLIA_CHAIN_ID,
            "Unsupported source chain"
        );

        // Build txId to prevent replays (includes sourceTxHash and nonce for extra safety)
        bytes32 txId = keccak256(abi.encodePacked(_recipient, _amount, _sourceChainId, _sourceTxHash, _nonce));
        require(!processedTransactions[txId], "Already processed");
        processedTransactions[txId] = true;

        // Recreate message hash and verify signature
        bytes32 messageHash = keccak256(abi.encodePacked(block.chainid, _recipient, _amount, _sourceChainId, _sourceTxHash, _nonce));
        
        // Recover signer and check it equals the relayer
        address signer = ECDSA.recover(messageHash, _signature);
        require(signer == relayer, "Invalid signature");

        // If token is mintable on this chain, call mint function; otherwise transfer from locked balance
        if (tokenIsMintable) {
            // Try the common mint signature: mint(address,uint256)
            bytes memory payload = abi.encodeWithSignature("mint(address,uint256)", _recipient, _amount);

            // Use Address.functionCall to bubble revert reasons
            Address.functionCall(tokenAddress, payload);
        } else {
            // Transfer retained tokens to recipient
            IERC20(tokenAddress).safeTransfer(_recipient, _amount);
        }

        emit TokensUnlocked(_recipient, _amount, _sourceChainId, _sourceTxHash, txId);
    }

    // -----------------------
    // Admin / owner actions
    // -----------------------

    function updateRelayer(address _newRelayer) external onlyOwner {
        require(_newRelayer != address(0), "Invalid relayer");
        address old = relayer;
        relayer = _newRelayer;
        emit RelayerUpdated(old, _newRelayer);
    }

    function updateTokenAddress(address _newToken) external onlyOwner {
        require(_newToken != address(0), "Invalid token");
        address old = tokenAddress;
        tokenAddress = _newToken;
        emit TokenAddressUpdated(old, _newToken);
    }

    function setTokenIsMintable(bool _isMintable) external onlyOwner {
        bool old = tokenIsMintable;
        tokenIsMintable = _isMintable;
        emit TokenMintableUpdated(old, _isMintable);
    }

    /**
     * @dev Emergency function to recover non-bridge tokens sent to contract by mistake.
     * Owner cannot withdraw the configured bridge token via this function.
     */
    function recoverERC20(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyOwner {
        require(_token != tokenAddress, "Cannot recover bridge token");
        require(_to != address(0), "Invalid recipient");
        IERC20(_token).safeTransfer(_to, _amount);
    }
}
