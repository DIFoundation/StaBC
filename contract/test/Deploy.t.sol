// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../script/Deploy.s.sol";

contract DeployTest is Test {
    DeployScript public deployer;
    
    function setUp() public {
        deployer = new DeployScript();
    }
    
    function testDeploy() public {
        deployer.run();
    }
    
    function testFullStakingFlow() public {
        // Run deployment
        deployer.run();
        
        // Parse logs to get addresses (in a real test, you'd capture the logged addresses)
        // For this test, we'll deploy new instances
        StakingToken token = new StakingToken();
        StakingContract staking = new StakingContract(
            address(token),
            20,
            7 days,
            1,
            10
        );
        
        // Create test users
        address user1 = makeAddr("user1");
        
        // Test minting
        vm.startPrank(user1);
        token.mint();
        assertEq(token.balanceOf(user1), 1000 * 1e18);
        
        // Test staking
        token.approve(address(staking), 500 * 1e18);
        staking.stake(500 * 1e18);
        assertEq(staking.totalStaked(), 500 * 1e18);
        
        // Test adding to stake
        token.approve(address(staking), 200 * 1e18);
        assertEq(staking.totalStaked(), 700 * 1e18);
        
        // Move forward in time
        vm.warp(block.timestamp + 30 days);
        
        // Test rewards accrual
        uint256 pendingRewards = staking.getPendingRewards(user1);
        assertTrue(pendingRewards > 0, "Should have accrued rewards");
        
        vm.stopPrank();
    }
}