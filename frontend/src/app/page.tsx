import Header from '@/components/Header'
import React from 'react'

export default function page() {
  return (
    <div>
        <Header />
    </div>
  )
}

import React, { useState } from 'react';
import { Wallet, TrendingUp, Vote, ArrowLeftRight, Coins, History, Settings, ChevronDown, Copy, ExternalLink, Lock, Unlock, Clock, Award, Info, Plus, Check, X, Search, Filter, Download, Moon, Sun, Globe } from 'lucide-react';

const StaBCApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('staking');
  const [walletConnected, setWalletConnected] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [bridgeAmount, setBridgeAmount] = useState('');
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destChain, setDestChain] = useState('base');
  const [theme, setTheme] = useState('dark');

  // Mock data
  const userAddress = '0x742d...4a9c';
  const walletBalance = 1250.5;
  const stakedAmount = 5000;
  const pendingRewards = 125.75;
  const currentAPY = 12.5;
  const tvl = 25000000;
  const totalStakers = 15420;
  const activeValidators = 127;

  const stakingPositions = [
    { id: 1, amount: 3000, rewards: 85.5, duration: '30 days', unlockDate: '2025-11-25', apy: 12.5 },
    { id: 2, amount: 2000, rewards: 40.25, duration: '90 days', unlockDate: '2026-01-23', apy: 15.2 }
  ];

  const proposals = [
    { id: 1, title: 'Increase Staking Rewards by 2%', status: 'active', votes: { for: 45000, against: 12000 }, deadline: '3 days', description: 'Proposal to increase the base staking APY from 12.5% to 14.5% to attract more stakers.' },
    { id: 2, title: 'Reduce Bridge Fees to 0.1%', status: 'active', votes: { for: 38000, against: 8500 }, deadline: '5 days', description: 'Lower bridge fees to increase cross-chain liquidity and user adoption.' },
    { id: 3, title: 'Add Polygon Network Support', status: 'passed', votes: { for: 52000, against: 5000 }, deadline: 'Ended', description: 'Integrate Polygon network for faster and cheaper transactions.' }
  ];

  const bridgeHistory = [
    { id: 1, from: 'Ethereum', to: 'Base', amount: 500, token: 'STABC', status: 'completed', date: '2025-10-25' },
    { id: 2, from: 'Base', to: 'Arbitrum', amount: 250, token: 'STABC', status: 'pending', date: '2025-10-26' }
  ];

  const transactions = [
    { id: 1, type: 'Stake', amount: 1000, hash: '0xabc...123', date: '2025-10-24', status: 'confirmed' },
    { id: 2, type: 'Claim', amount: 25.5, hash: '0xdef...456', date: '2025-10-23', status: 'confirmed' },
    { id: 3, type: 'Bridge', amount: 500, hash: '0xghi...789', date: '2025-10-22', status: 'confirmed' },
    { id: 4, type: 'Unstake', amount: 500, hash: '0xjkl...012', date: '2025-10-21', status: 'confirmed' }
  ];

  const chains = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
    { id: 'base', name: 'Base', icon: '🔵' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
    { id: 'optimism', name: 'Optimism', icon: '🔴' }
  ];

 
  // Stats Overview
  const StatsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Total Value Locked', value: `$${(tvl / 1000000).toFixed(1)}M`, icon: TrendingUp, color: 'blue' },
        { label: 'Current APY', value: `${currentAPY}%`, icon: Award, color: 'green' },
        { label: 'Active Validators', value: activeValidators, icon: Check, color: 'purple' },
        { label: 'Total Stakers', value: totalStakers.toLocaleString(), icon: Coins, color: 'orange' }
      ].map((stat, idx) => (
        <div key={idx} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">{stat.label}</span>
            <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
          </div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );

  // Staking Tab
  const StakingTab = () => (
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
  );

  // Governance Tab
  const GovernanceTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Governance</h3>
          <p className="text-gray-400 mt-1">Vote on proposals to shape the future of StaBC</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Proposal
        </button>
      </div>

      {selectedProposal ? (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <button
            onClick={() => setSelectedProposal(null)}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to proposals
          </button>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedProposal.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {selectedProposal.status}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedProposal.deadline}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{selectedProposal.title}</h2>
              <p className="text-gray-300 leading-relaxed">{selectedProposal.description}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">Voting Results</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-green-500 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      For
                    </span>
                    <span className="text-white font-medium">{selectedProposal.votes.for.toLocaleString()} votes</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(selectedProposal.votes.for / (selectedProposal.votes.for + selectedProposal.votes.against)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-red-500 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Against
                    </span>
                    <span className="text-white font-medium">{selectedProposal.votes.against.toLocaleString()} votes</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(selectedProposal.votes.against / (selectedProposal.votes.for + selectedProposal.votes.against)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {selectedProposal.status === 'active' && (
              <div className="grid grid-cols-2 gap-4">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Vote For
                </button>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <X className="w-5 h-5" />
                  Vote Against
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <button
              key={proposal.id}
              onClick={() => setSelectedProposal(proposal)}
              className="w-full bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      proposal.status === 'active' ? 'bg-green-500/20 text-green-500' :
                      proposal.status === 'passed' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {proposal.status}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {proposal.deadline}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{proposal.title}</h4>
                  <p className="text-gray-400 text-sm">{proposal.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-400">
                    {((proposal.votes.for / (proposal.votes.for + proposal.votes.against)) * 100).toFixed(1)}% For
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-400">
                    {((proposal.votes.against / (proposal.votes.for + proposal.votes.against)) * 100).toFixed(1)}% Against
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Bridge Tab
  const BridgeTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bridge Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-blue-500" />
            Bridge Assets
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">From</label>
              <div className="relative">
                <select
                  value={sourceChain}
                  onChange={(e) => setSourceChain(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  {chains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex justify-center">
              <button className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <ArrowLeftRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">To</label>
              <div className="relative">
                <select
                  value={destChain}
                  onChange={(e) => setDestChain(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  {chains.filter(c => c.id !== sourceChain).map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Amount</label>
              <div className="relative">
                <input
                  type="text"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
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
                <span className="text-gray-400">Bridge Fee</span>
                <span className="text-white font-medium">0.1%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Time</span>
                <span className="text-white font-medium">~5 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">You'll Receive</span>
                <span className="text-white font-medium">
                  {bridgeAmount ? (parseFloat(bridgeAmount) * 0.999).toFixed(2) : '0.00'} STABC
                </span>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Bridge Tokens
            </button>
          </div>
        </div>

        {/* Bridge History */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Bridge History
          </h3>
          <div className="space-y-3">
            {bridgeHistory.map((tx) => (
              <div key={tx.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{tx.amount} {tx.token}</span>
                    <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{tx.from} → {tx.to}</span>
                  <span className="text-gray-400">{tx.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Page
  const DashboardPage = () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <StatsOverview />
      
      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-700">
          {[
            { id: 'staking', label: 'Staking', icon: Lock },
            { id: 'governance', label: 'Governance', icon: Vote },
            { id: 'bridge', label: 'Bridge', icon: ArrowLeftRight }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'staking' && <StakingTab />}
          {activeTab === 'governance' && <GovernanceTab />}
          {activeTab === 'bridge' && <BridgeTab />}
        </div>
      </div>
    </div>
  );

  // Portfolio Page
  const PortfolioPage = () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio</h2>
        <p className="text-gray-400">Track your assets and transaction history</p>
      </div>

      {/* Asset Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Asset Balances</h3>
          <div className="space-y-4">
            {[
              { token: 'STABC', balance: walletBalance, value: walletBalance * 2.5, change: 5.2, icon: '🪙' },
              { token: 'Staked STABC', balance: stakedAmount, value: stakedAmount * 2.5, change: 12.5, icon: '🔒' },
              { token: 'ETH', balance: 0.5, value: 1850, change: -2.1, icon: '⟠' }
            ].map((asset, idx) => (
              <div key={idx} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                    {asset.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold">{asset.token}</div>
                    <div className="text-gray-400 text-sm">{asset.balance.toLocaleString()} tokens</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${asset.value.toLocaleString()}</div>
                  <div className={`text-sm font-medium ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Portfolio Value</span>
              <span className="text-2xl font-bold text-white">
                ${((walletBalance + stakedAmount) * 2.5 + 1850).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Earned</div>
                <div className="text-xl font-bold text-white">{pendingRewards} STABC</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Lifetime rewards from staking
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Active Positions</div>
                <div className="text-xl font-bold text-white">{stakingPositions.length}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Currently earning rewards
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Voting Power</div>
                <div className="text-xl font-bold text-white">{stakedAmount.toLocaleString()}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Based on staked tokens
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Transaction History
          </h3>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-gray-900 text-gray-400 rounded-lg hover:text-white transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 bg-gray-900 text-gray-400 rounded-lg hover:text-white transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'Stake' ? 'bg-blue-500/20' :
                  tx.type === 'Unstake' ? 'bg-orange-500/20' :
                  tx.type === 'Claim' ? 'bg-green-500/20' :
                  'bg-purple-500/20'
                }`}>
                  {tx.type === 'Stake' && <Lock className="w-5 h-5 text-blue-500" />}
                  {tx.type === 'Unstake' && <Unlock className="w-5 h-5 text-orange-500" />}
                  {tx.type === 'Claim' && <Award className="w-5 h-5 text-green-500" />}
                  {tx.type === 'Bridge' && <ArrowLeftRight className="w-5 h-5 text-purple-500" />}
                </div>
                <div>
                  <div className="text-white font-medium">{tx.type}</div>
                  <div className="text-sm text-gray-400">{tx.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-white font-medium">
                    {tx.type === 'Claim' ? '+' : ''}{tx.amount} STABC
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    {tx.hash}
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tx.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Settings Page
  const SettingsPage = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Manage your wallet and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Wallet Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-500" />
            Wallet Settings
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Connected Wallet</span>
                <button className="text-red-500 text-sm font-medium hover:text-red-400 flex items-center gap-1">
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
              <div className="flex items-center gap-3">
                <code className="text-white font-mono">{userAddress}</code>
                <button className="text-gray-400 hover:text-white">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium mb-1">Network</div>
                  <div className="text-sm text-gray-400">Currently connected to Ethereum</div>
                </div>
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Switch Network
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Display Preferences
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <div>
                  <div className="text-white font-medium">Theme</div>
                  <div className="text-sm text-gray-400">Choose your preferred theme</div>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-white font-medium">Language</div>
                  <div className="text-sm text-gray-400">Select display language</div>
                </div>
              </div>
              <select className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>Chinese</option>
              </select>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-white font-medium">Currency</div>
                  <div className="text-sm text-gray-400">Display prices in</div>
                </div>
              </div>
              <select className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Transaction Settings
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-medium">Slippage Tolerance</div>
                  <div className="text-sm text-gray-400">Set maximum slippage for transactions</div>
                </div>
              </div>
              <div className="flex gap-2">
                {['0.5%', '1%', '3%'].map((val) => (
                  <button key={val} className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    {val}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="Custom"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Transaction Deadline</div>
                  <div className="text-sm text-gray-400">Minutes until transaction expires</div>
                </div>
                <input
                  type="text"
                  defaultValue="20"
                  className="w-24 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">About StaBC</h3>
          <div className="space-y-3 text-gray-400">
            <p>Version 1.0.0</p>
            <div className="flex gap-4">
              <a href="#" className="text-blue-500 hover:text-blue-400 flex items-center gap-1">
                Documentation <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-400 flex items-center gap-1">
                Terms of Service <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-400 flex items-center gap-1">
                Privacy Policy <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'portfolio' && <PortfolioPage />}
      {currentPage === 'settings' && <SettingsPage />}
    </div>
  );
};

export default StaBCApp;