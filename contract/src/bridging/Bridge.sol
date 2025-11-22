// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Celo-Base Sepolia Bridge
 * @dev This contract facilitates cross-chain token transfers between Celo and Base Sepolia networks.
 * On Celo: Locks tokens for bridging to Base Sepolia
 * On Base Sepolia: Mints/burns tokens when bridging to/from Celo
 */
contract Bridge is Ownable, ReentrancyGuard {
    // Chain IDs
    uint256 public constant CELO_CHAIN_ID = 42220;
    uint256 public constant BASE_SEPOLIA_CHAIN_ID = 84532;
    
    // Token contract address (will be different on each chain)
    address public tokenAddress;
    
    // Trusted relayer address for cross-chain message verification
    address public relayer;
    
    // Mapping to track processed transactions to prevent replay attacks
    mapping(bytes32 => bool) public processedTransactions;
    
    // Events
    event TokensLocked(
        address indexed from,
        uint256 amount,
        uint256 targetChainId,
        address targetRecipient,
        uint256 nonce
    );
    
    event TokensUnlocked(
        address indexed recipient,
        uint256 amount,
        uint256 sourceChainId,
        bytes32 sourceTxHash
    );
    
    // Modifier to check if the caller is the relayer
    modifier onlyRelayer() {
        require(msg.sender == relayer, "Caller is not the relayer");
        _;
    }
    
    /**
     * @dev Constructor sets the token address and initial relayer
     * @param _tokenAddress Address of the ERC20 token contract
     * @param _relayer Address of the trusted relayer
     */
    constructor(address _tokenAddress, address _relayer) {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_relayer != address(0), "Invalid relayer address");
        
        tokenAddress = _tokenAddress;
        relayer = _relayer;
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
        require(_amount > 0, "Amount must be greater than 0");
        require(_targetChainId != block.chainid, "Cannot bridge to the same chain");
        require(
            _targetChainId == CELO_CHAIN_ID || _targetChainId == BASE_SEPOLIA_CHAIN_ID,
            "Unsupported target chain"
        );
        require(_targetRecipient != address(0), "Invalid recipient address");
        
        // Transfer tokens from user to this contract
        bool success = IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        require(success, "Token transfer failed");
        
        // Generate a unique nonce for this transaction
        uint256 nonce = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            _amount,
            _targetChainId,
            _targetRecipient
        )));
        
        emit TokensLocked(
            msg.sender,
            _amount,
            _targetChainId,
            _targetRecipient,
            nonce
        );
    }
    
    /**
     * @dev Unlocks tokens on the target chain (called by relayer)
     * @param _recipient Address to receive the unlocked tokens
     * @param _amount Amount of tokens to unlock
     * @param _sourceChainId Chain ID where the tokens were locked
     * @param _sourceTxHash Transaction hash of the lock event on the source chain
     * @param _signature Signature from the relayer for verification
     */
    function unlockTokens(
        address _recipient,
        uint256 _amount,
        uint256 _sourceChainId,
        bytes32 _sourceTxHash,
        bytes calldata _signature
    ) external onlyRelayer nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(_recipient != address(0), "Invalid recipient address");
        require(_sourceChainId != block.chainid, "Cannot unlock on the same chain");
        require(
            _sourceChainId == CELO_CHAIN_ID || _sourceChainId == BASE_SEPOLIA_CHAIN_ID,
            "Unsupported source chain"
        );
        
        // Create a unique transaction ID to prevent replay attacks
        bytes32 txId = keccak256(abi.encodePacked(
            _recipient,
            _amount,
            _sourceChainId,
            _sourceTxHash
        ));
        
        require(!processedTransactions[txId], "Transaction already processed");
        processedTransactions[txId] = true;
        
        // Verify the signature (in a production environment, this would include more robust verification)
        // For now, we're trusting the relayer (onlyRelayer modifier)
        
        // Mint tokens on Base Sepolia or release locked tokens on Celo
        if (block.chainid == BASE_SEPOLIA_CHAIN_ID) {
            // On Base Sepolia, we'll mint new tokens
            // Note: The token contract should have a mint function with onlyOwner modifier
            // and this bridge contract should be set as the owner
            (bool success, ) = tokenAddress.call(
                abi.encodeWithSignature("mint(address,uint256)", _recipient, _amount)
            );
            require(success, "Token minting failed");
        } else {
            // On Celo, release locked tokens
            bool success = IERC20(tokenAddress).transfer(_recipient, _amount);
            require(success, "Token transfer failed");
        }
        
        emit TokensUnlocked(_recipient, _amount, _sourceChainId, _sourceTxHash);
    }
    
    /**
     * @dev Updates the relayer address (only callable by owner)
     * @param _newRelayer Address of the new relayer
     */
    function updateRelayer(address _newRelayer) external onlyOwner {
        require(_newRelayer != address(0), "Invalid relayer address");
        relayer = _newRelayer;
    }
    
    /**
     * @dev Emergency function to recover ERC20 tokens sent to the contract by mistake
     * @param _token Address of the token to recover
     * @param _to Address to send the tokens to
     * @param _amount Amount of tokens to recover
     */
    function recoverERC20(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyOwner {
        require(_token != tokenAddress, "Cannot recover bridge token");
        require(_to != address(0), "Invalid recipient address");
        
        bool success = IERC20(_token).transfer(_to, _amount);
        require(success, "Token recovery failed");
    }
}