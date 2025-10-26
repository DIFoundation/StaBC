'use client'
import { useState } from 'react';
import { Lock, Unlock, Coins, Info, Award } from 'lucide-react';
import React from 'react'

export default function StakingTab() {

  // Mock data
  const walletBalance = 1250.5;
  const stakedAmount = 5000;
  const pendingRewards = 125.75;
  const currentAPY = 12.5;

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const stakingPositions = [
    { id: 1, amount: 3000, rewards: 85.5, duration: '30 days', unlockDate: '2025-11-25', apy: 12.5 },
    { id: 2, amount: 2000, rewards: 40.25, duration: '90 days', unlockDate: '2026-01-23', apy: 15.2 }
];

  return (
    <div className="space-y-6">
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
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm font-medium hover:text-blue-400">
                  MAX
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current APY</span>
                <span className="text-green-500 font-medium">{currentAPY}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Rewards (30d)</span>
                <span className="text-white font-medium">
                  {stakeAmount ? ((parseFloat(stakeAmount) * currentAPY) / 100 / 12).toFixed(2) : '0.00'} STABC
                </span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Stake Tokens
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
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 text-sm font-medium hover:text-orange-400">
                  MAX
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  Unstaking requires a 7-day unbonding period. You will not earn rewards during this time.
                </p>
              </div>
            </div>
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Unstake Tokens
            </button>
          </div>
        </div>
      </div>

      {/* Staking Positions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-500" />
            Your Positions
          </h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
            <Award className="w-4 h-4" />
            Claim {pendingRewards} STABC
          </button>
        </div>
        <div className="space-y-3">
          {stakingPositions.map((position) => (
            <div key={position.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Staked Amount</div>
                  <div className="text-lg font-bold text-white">{position.amount} STABC</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Pending Rewards</div>
                  <div className="text-lg font-bold text-green-500">{position.rewards} STABC</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Lock Duration</div>
                  <div className="text-lg font-bold text-white">{position.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">APY</div>
                  <div className="text-lg font-bold text-blue-500">{position.apy}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Unlock Date</div>
                  <div className="text-lg font-bold text-white">{position.unlockDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
