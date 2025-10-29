'use client'
import { useState } from 'react';
import { Lock, Unlock, Coins, Info, Award } from 'lucide-react';
import React from 'react'
import { useToken } from '@/hooks/useStakingToken';
import { useStaking } from '@/hooks/useStakingContracts';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { Progress } from '@/components/ui/progress'

export default function StakingTab() {

  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const { balanceFormatted } = useToken({
    chainId: chainId?.valueOf() as number
  });

  const { 
    stakedAmountFormatted,
    pendingRewardsFormatted,
    currentRewardRateFormatted,
    timeUntilUnlockSeconds,
    canWithdraw,
    totalStakedFormatted,
    isLoading,
    stake,
    claimRewards,
    withdraw,
    refetchAll
  } = useStaking({
    chainId: chainId?.valueOf() as number,
    watchEvents: true
  });

  // Mock data
  const walletBalance = balanceFormatted || '0';
  const stakedAmount = stakedAmountFormatted || '0';
  const pendingRewards = Number(pendingRewardsFormatted).toFixed(5) || '0';
  const currentAPY = currentRewardRateFormatted ? Number(currentRewardRateFormatted) * 100 : 0;

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

  const handleClaimRewards = async () => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }
    if (Number(pendingRewards) <= 0) {
      alert('No rewards to claim');
      return;
    }
    
    try {
      await claimRewards();
      refetchAll();
    } catch (error) {
      console.error('Claiming rewards failed:', error);
    }
  };

  const setMaxUnstake = () => {
    setUnstakeAmount(stakedAmount);
  };

  const setMaxStake = () => {
    setStakeAmount(walletBalance);
  };

  const handleUnstake = async () => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }
    if (!unstakeAmount || Number(unstakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (Number(unstakeAmount) > Number(stakedAmount)) {
      alert('Insufficient staked amount');
      return;
    }
    if (!canWithdraw) {
      alert('Tokens are still locked. Please wait until unlock time.');
      return;
    }
    
    try {
      await withdraw(unstakeAmount);
      setUnstakeAmount('');
      refetchAll();
    } catch (error) {
      console.error('Unstaking failed:', error);
    }
  };

  const handleStake = async () => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }
    if (!stakeAmount || Number(stakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (Number(stakeAmount) > Number(walletBalance)) {
      alert('Insufficient balance');
      return;
    }
    
    try {
      await stake(stakeAmount);
      setStakeAmount('');
      refetchAll();
    } catch (error) {
      console.error('Staking failed:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Staked (Global)</div>
          <div className="text-2xl font-bold text-white">{totalStakedFormatted || '0'} STABC</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Your Staked Amount</div>
          <div className="text-2xl font-bold text-blue-500">{stakedAmount} STABC</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Current APY</div>
          <div className="text-2xl font-bold text-green-500">{currentAPY.toFixed(2)}%</div>
        </div>
      </div>
  
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
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.0"
                  disabled={isLoading}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <button 
                  onClick={setMaxStake}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm font-medium hover:text-blue-400 disabled:opacity-50">
                  MAX
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current APY</span>
                <span className="text-green-500 font-medium">{currentAPY.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Rewards (30d)</span>
                <span className="text-white font-medium">
                  {stakeAmount ? ((parseFloat(stakeAmount) * currentAPY) / 100 / 12).toFixed(2) : '0.00'} STABC
                </span>
              </div>
            </div>
            <button 
              onClick={handleStake}
              disabled={isLoading || !address}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Processing...' : 'Stake Tokens'}
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
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="0.0"
                  disabled={isLoading || !canWithdraw}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
                />
                <button 
                  onClick={setMaxUnstake}
                  disabled={isLoading || !canWithdraw}
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
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-400">
                    Your tokens are locked. You can unstake in {getUnlockDisplay()}.
                  </p>
                </div>
              )}
            </div>
            <button 
              onClick={handleUnstake}
              disabled={isLoading || !canWithdraw || !address}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Processing...' : canWithdraw ? 'Unstake Tokens' : 'Tokens Locked'}
            </button>
          </div>
        </div>
      </div>
  
      {/* Your Position */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-500" />
            Your Position
          </h3>
          <button 
            onClick={handleClaimRewards}
            disabled={isLoading || Number(pendingRewards) <= 0 || !address}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Award className="w-4 h-4" />
            {isLoading ? 'Processing...' : `Claim ${pendingRewards} STABC`}
          </button>
        </div>
        
        {Number(stakedAmount) > 0 ? (
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Staked Amount</div>
                <div className="text-lg font-bold text-white">{stakedAmount} STABC</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Pending Rewards</div>
                <div className="text-lg font-bold text-green-500">{pendingRewards} STABC</div>
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
                <div className="text-sm text-gray-400 mb-1">Progress</div>
                <div className="flex items-center gap-2">
                  <Progress value={timeUntilUnlockSeconds && stakedAmount ? (100 - (timeUntilUnlockSeconds / (30 * 24 * 60 * 60) * 100)) : 0} className="bg-gray-300 border border-gray-300 rounded-lg  "/>
                  <span>{timeUntilUnlockSeconds && stakedAmount ? (100 - (timeUntilUnlockSeconds / (30 * 24 * 60 * 60) * 100)).toFixed(0) : 0}%</span>
                </div>  
              </div>
            </div>
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