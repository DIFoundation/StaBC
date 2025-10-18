// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/StakingToken.sol";

contract TestTokenTest is Test {
    StakingToken public token;
    address public user1;
    address public user2;
    
    function setUp() public {
        token = new StakingToken();
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
    }
    
    function testMint() public {
        vm.startPrank(user1);
        token.mint();
        assertEq(token.balanceOf(user1), 1000 * 10**18);
        vm.stopPrank();
    }
    
    function testCooldown() public {
        vm.startPrank(user1);
        token.mint();
        
        vm.expectRevert("Must wait 24 hours between mints");
        token.mint();
        
        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);
        token.mint(); // Should work now
        assertEq(token.balanceOf(user1), 2000 * 10**18);
        vm.stopPrank();
    }
    
    function testMultipleUsers() public {
        vm.prank(user1);
        token.mint();
        
        vm.prank(user2);
        token.mint();
        
        assertEq(token.balanceOf(user1), 1000 * 10**18);
        assertEq(token.balanceOf(user2), 1000 * 10**18);
    }
}