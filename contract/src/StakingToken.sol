// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingToken is ERC20 {
    uint256 public constant MINT_AMOUNT = 1000 * 10**18; // 1000 tokens
    uint256 public constant MINT_COOLDOWN = 1 days;
    
    mapping(address => uint256) public lastMintTimestamp;
    
    constructor() ERC20("Base Staking", "BTS") {}
    
    function mint() external {
        require(
            block.timestamp >= lastMintTimestamp[msg.sender] + MINT_COOLDOWN,
            "Must wait 24 hours between mints"
        );
        
        lastMintTimestamp[msg.sender] = block.timestamp;
        _mint(msg.sender, MINT_AMOUNT);
    }
}