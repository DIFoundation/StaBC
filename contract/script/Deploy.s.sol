// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/StakingToken.sol";
import "../src/StakingContract.sol";

contract DeployScript is Script {
    function run() external {
        // Begin recording transactions for deployment
        vm.startBroadcast();

        // Deploy StakingToken first
        StakingToken token = new StakingToken();
        console.log("StakingToken deployed at:", address(token));

        // Set up staking parameters
        uint256 initialApr = 20; // 20% APR
        uint256 minLockDuration = 7 days; // 7 days lock period
        uint256 aprReductionPerThousand = 1; // Reduce APR by 1% per 1000 tokens staked
        uint256 emergencyWithdrawPenalty = 10; // 10% penalty for emergency withdrawals

        // Deploy StakingContract
        StakingContract staking = new StakingContract(
            address(token),
            initialApr,
            minLockDuration,
            aprReductionPerThousand,
            emergencyWithdrawPenalty
        );
        console.log("StakingContract deployed at:", address(staking));

        // Fund the staking contract with initial rewards (1,000,000 tokens)
        // First mint tokens to the deployer
        token.mint();
        
        // Approve staking contract to transfer tokens
        token.approve(address(staking), 1000 * 1e18);
        
        // Fund the contract with initial rewards
        // staking.fund(1000 * 1e18);

        vm.stopBroadcast();

        // Log deployment parameters for verification
        console.log("Deployment Parameters:");
        console.log("Initial APR:", initialApr);
        console.log("Minimum Lock Duration:", minLockDuration);
        console.log("APR Reduction Per Thousand:", aprReductionPerThousand);
        console.log("Emergency Withdraw Penalty:", emergencyWithdrawPenalty);

        // write to file
        vm.writeFile("deployment.txt", "StakingToken deployed at: " + address(token));
        vm.writeFile("deployment.txt", "StakingContract deployed at: " + address(staking));
        vm.writeFile("deployment.txt", "Initial APR: " + initialApr);
        vm.writeFile("deployment.txt", "Minimum Lock Duration: " + minLockDuration);
        vm.writeFile("deployment.txt", "APR Reduction Per Thousand: " + aprReductionPerThousand);
        vm.writeFile("deployment.txt", "Emergency Withdraw Penalty: " + emergencyWithdrawPenalty);
        vm.writeFile("deployment.txt", "Deployment Parameters:");

        // read file
        string memory deployment = vm.readFile("deployment.txt");
        console.log("Deployment Parameters:", deployment);  

        console.log("Operation successful");
    }
}