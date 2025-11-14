'use client'
import { useState, useEffect } from 'react';
import { Lock, Unlock, Coins, Info, Award, AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react'
import { useToken } from '@/hooks/useStakingToken';
import { useStaking } from '@/hooks/useStakingContracts';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { Progress } from '@/components/ui/progress'
import { showToast } from '@/lib/toast';
import { getContractAddresses } from '@/lib/addresses';

export default function StakingTab() {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const chainIdNumber = chainId?.valueOf() as number;

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);

  const { 
    balanceFormatted, 
    allowanceFormatted,
    approve,
    isLoading: tokenLoading
  } = useToken({
    chainId: chainIdNumber,
    spenderAddress: chainIdNumber ? getContractAddresses(chainIdNumber)?.stakingContract as `0x${string}` : undefined,
    watchEvents: true
  });

  const { 
    stakedAmountFormatted,
    pendingRewardsFormatted,
    currentRewardRateFormatted,
    timeUntilUnlockSeconds,
    canWithdraw,
    // totalStakedFormatted,
    minLockDuration,
    isLoading,
    stake,
    claimRewards,
    claimAndRestake,
    withdraw,
    emergencyWithdraw,
    refetchAll
  } = useStaking({
    chainId: chainIdNumber,
    watchEvents: true
  });

  // Check if approval is needed
  useEffect(() => {
    if (isConnected && stakeAmount && balanceFormatted && allowanceFormatted) {
      const amount = parseFloat(stakeAmount);
      const allowance = parseFloat(allowanceFormatted);
      const balance = parseFloat(balanceFormatted);
      
      if (amount > 0 && amount <= balance && amount > allowance) {
        setNeedsApproval(true);
      } else {
        setNeedsApproval(false);
      }
    } else {
      setNeedsApproval(false);
    }
  }, [stakeAmount, balanceFormatted, allowanceFormatted, isConnected]);

  // Format values
  const walletBalance = balanceFormatted || '0';
  const stakedAmount = stakedAmountFormatted || '0';
  const pendingRewards = Number(pendingRewardsFormatted || '0');
  // currentRewardRateFormatted is now just the percentage number (e.g., "20" for 20%)
  const currentAPY = currentRewardRateFormatted ? Number(currentRewardRateFormatted) : 0;

  // Calculate time until unlock in readable format
  const getUnlockDisplay = () => {
    if (!timeUntilUnlockSeconds || timeUntilUnlockSeconds <= 0) {
      return canWithdraw ? 'Unlocked' : 'Not staked';
    }
    
    const days = Math.floor(timeUntilUnlockSeconds / (24 * 60 * 60));
    const hours = Math.floor((timeUntilUnlockSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeUntilUnlockSeconds % (60 * 60)) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Calculate lock progress (assuming minLockDuration is in seconds)
  const getLockProgress = () => {
    if (!timeUntilUnlockSeconds || !minLockDuration || timeUntilUnlockSeconds <= 0) {
      return 100;
    }
    const progress = ((minLockDuration - timeUntilUnlockSeconds) / minLockDuration) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const handleApprove = async () => {
    if (!address || !chainIdNumber) {
      showToast.error('Please connect your wallet');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      showToast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsApproving(true);
      const stakingAddress = getContractAddresses(chainIdNumber).stakingContract as `0x${string}`;
      
      // Approve a large amount for convenience (or you could approve exactly the stake amount)
      const maxApproval = '1000000000'; // Large number, effectively unlimited
      
      await approve(stakingAddress, maxApproval);
      
      showToast.success('Approval successful', 'You can now stake your tokens');
      setNeedsApproval(false);
      // Refetch will happen automatically via watchEvents
    } catch (error: unknown) {
      console.error('Approval failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      showToast.error('Approval failed', errorMessage);
    } finally {
      setIsApproving(false);
    }
  };

  const handleStake = async () => {
    if (!address) {
      showToast.error('Please connect your wallet');
      return;
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      showToast.error('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(stakeAmount) > parseFloat(walletBalance)) {
      showToast.error('Insufficient balance', `You have ${walletBalance} tokens available`);
      return;
    }

    if (needsApproval) {
      showToast.error('Approval required', 'Please approve token spending first');
      return;
    }
    
    try {
      showToast.loading('Staking tokens...');
      
      await stake(stakeAmount);
      
      showToast.success('Staking successful!', `${stakeAmount} tokens staked`);
      setStakeAmount('');
      await refetchAll();
    } catch (error: unknown) {
      console.error('Staking failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      showToast.error('Staking failed', errorMessage);
    }
  };

  const handleUnstake = async () => {
    if (!address) {
      showToast.error('Please connect your wallet');
      return;
    }
    
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      showToast.error('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(unstakeAmount) > parseFloat(stakedAmount)) {
      showToast.error('Insufficient staked amount', `You have ${stakedAmount} tokens staked`);
      return;
    }
    
    if (!canWithdraw) {
      showToast.error('Tokens are locked', `You can unstake in ${getUnlockDisplay()}`);
      return;
    }
    
    try {
      showToast.loading('Unstaking tokens...');
      
      await withdraw(unstakeAmount);
      
      showToast.success('Unstaking successful!', `${unstakeAmount} tokens unstaked`);
      setUnstakeAmount('');
      await refetchAll();
    } catch (error: unknown) {
      console.error('Unstaking failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      showToast.error('Unstaking failed', errorMessage);
    }
  };

  const handleClaimRewards = async () => {
    if (!address) {
      showToast.error('Please connect your wallet');
      return;
    }
    
    if (pendingRewards <= 0) {
      showToast.error('No rewards to claim');
      return;
    }
    
    try {
      showToast.loading('Claiming rewards...');
      
      await claimRewards();
      
      showToast.success('Rewards claimed!', `${pendingRewards.toFixed(4)} tokens claimed`);
      await refetchAll();
    } catch (error: unknown) {
      console.error('Claiming rewards failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      showToast.error('Failed to claim rewards', errorMessage);
    }
  };

  const handleClaimAndRestake = async () => {
    if (!address) {
      showToast.error('Please connect your wallet');
      return;
    }
    
    if (pendingRewards <= 0) {
      showToast.error('No rewards to compound');
      return;
    }
    
    try {
      showToast.loading('Compounding rewards...');
      
      await claimAndRestake();
      
      showToast.success('Rewards compounded!', `${pendingRewards.toFixed(4)} tokens restaked`);
      await refetchAll();
    } catch (error: unknown) {
      console.error('Compounding failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      showToast.error('Failed to compound rewards', errorMessage);
    }
  };

  const handleEmergencyWithdraw = async () => {
    if (!address) {
      showToast.error('Please connect your wallet');
      return;
    }

    if (parseFloat(stakedAmount) <= 0) {
      showToast.error('No tokens to withdraw');
      return;
    }

    if (!confirm('Are you sure you want to emergency withdraw? This will incur a penalty and you will lose your rewards.')) {
      return;
    }

    try {
      showToast.loading('Processing emergency withdrawal...');
      
      await emergencyWithdraw();
      
      showToast.success('Emergency withdrawal successful', 'Note: A penalty was applied');
      await refetchAll();
    } catch (error: unknown) {
      console.error('Emergency withdrawal failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      showToast.error('Emergency withdrawal failed', errorMessage);
    }
  };

  const setMaxStake = () => {
    setStakeAmount(walletBalance);
  };

  const setMaxUnstake = () => {
    setUnstakeAmount(stakedAmount);
  };

  const isLoadingState = isLoading || tokenLoading;

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400">Please connect your wallet to start staking and earning rewards</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Staked (Global)</div>
          <div className="text-2xl font-bold text-white">{totalStakedFormatted || '0'} STABC</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Your Staked Amount</div>
          <div className="text-2xl font-bold text-blue-500">{stakedAmount} STABC</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
          <div className="text-sm text-gray-400 mb-1">Current APY</div>
          <div className="text-2xl font-bold text-green-500">{currentAPY.toFixed(2)}%</div>
            </div>
            <div className="group relative">
              <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                APY (Annual Percentage Yield) represents the annual return on your staked tokens. This rate may decrease as more tokens are staked.
              </div>
            </div>
          </div>
        </div>
      </div> */}
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stake Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            Stake Tokens
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Amount</label>
                <span className="text-sm text-gray-400">Balance: {walletBalance} STABC</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={stakeAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setStakeAmount(value);
                    }
                  }}
                  placeholder="0.0"
                  disabled={isLoadingState}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <button 
                  onClick={setMaxStake}
                  disabled={isLoadingState}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm font-medium hover:text-blue-400 disabled:opacity-50">
                  MAX
                </button>
              </div>
            </div>

            {needsApproval && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-500 font-medium text-sm mb-1">Approval Required</p>
                  <p className="text-gray-400 text-xs mb-3">You need to approve token spending before staking</p>
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || isLoadingState}
                    className="w-full bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isApproving ? 'Approving...' : 'Approve Tokens'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-900 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current APY</span>
                <span className="text-green-500 font-medium">{currentAPY.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Rewards (30d)</span>
                <span className="text-white font-medium">
                  {stakeAmount ? ((parseFloat(stakeAmount) * currentAPY) / 100 / 12).toFixed(4) : '0.00'} STABC
                </span>
              </div>
            </div>

            <button 
              onClick={handleStake}
              disabled={isLoadingState || !address || needsApproval || !stakeAmount || parseFloat(stakeAmount) <= 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoadingState ? 'Processing...' : 'Stake Tokens'}
            </button>
          </div>
        </div>
  
        {/* Unstake Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Unlock className="w-5 h-5 text-orange-500" />
            Unstake Tokens
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Amount</label>
                <span className="text-sm text-gray-400">Staked: {stakedAmount} STABC</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={unstakeAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setUnstakeAmount(value);
                    }
                  }}
                  placeholder="0.0"
                  disabled={isLoadingState || !canWithdraw}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
                />
                <button 
                  onClick={setMaxUnstake}
                  disabled={isLoadingState || !canWithdraw}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 text-sm font-medium hover:text-orange-400 disabled:opacity-50">
                  MAX
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Unlock Status</span>
                <span className={`font-medium ${canWithdraw ? 'text-green-500' : 'text-orange-500'}`}>
                  {getUnlockDisplay()}
                </span>
              </div>
              {!canWithdraw && timeUntilUnlockSeconds && timeUntilUnlockSeconds > 0 && (
                <div className="flex items-start gap-2 mt-2">
                  <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-400">
                    Your tokens are locked. You can unstake in {getUnlockDisplay()}.
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={handleUnstake}
              disabled={isLoadingState || !canWithdraw || !address || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoadingState ? 'Processing...' : canWithdraw ? 'Unstake Tokens' : 'Tokens Locked'}
            </button>
          </div>
        </div>
      </div>
  
      {/* Your Position */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-500" />
            Your Position
          </h3>
          <div className="flex items-center gap-2">
            {pendingRewards > 0 && (
              <>
          <button 
            onClick={handleClaimRewards}
                  disabled={isLoadingState || !address}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
            <Award className="w-4 h-4" />
                  Claim {pendingRewards.toFixed(4)} STABC
                </button>
                <button 
                  onClick={handleClaimAndRestake}
                  disabled={isLoadingState || !address}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  title="Compound your rewards by automatically restaking them"
                >
                  <RefreshCw className="w-4 h-4" />
                  Compound
          </button>
              </>
            )}
          </div>
        </div>
        
        {Number(stakedAmount) > 0 ? (
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Staked Amount</div>
                <div className="text-lg font-bold text-white">{stakedAmount} STABC</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Pending Rewards</div>
                <div className="text-lg font-bold text-green-500">{pendingRewards.toFixed(4)} STABC</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Current APY</div>
                <div className="text-lg font-bold text-blue-500">{currentAPY.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Unlock Status</div>
                <div className={`text-lg font-bold ${canWithdraw ? 'text-green-500' : 'text-orange-500'}`}>
                  {getUnlockDisplay()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Lock Progress</div>
                <div className="flex items-center gap-2">
                  <Progress value={getLockProgress()} className="flex-1" />
                  <span className="text-white font-medium text-sm">{getLockProgress().toFixed(0)}%</span>
                </div>  
              </div>
            </div>

            {!canWithdraw && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <button
                  onClick={handleEmergencyWithdraw}
                  disabled={isLoadingState || !address}
                  className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Emergency Withdraw (Penalty Applies)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
            <p className="text-gray-400">You don&apos;t have any active staking positions yet.</p>
            <p className="text-sm text-gray-500 mt-2">Stake your tokens above to start earning rewards!</p>
          </div>
        )}
      </div>
    </div>
  );
}

