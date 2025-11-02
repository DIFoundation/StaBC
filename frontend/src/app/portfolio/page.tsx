'use client'
import { TrendingUp, Coins, History, Filter, Download, ExternalLink, ArrowLeftRight, Lock, Unlock, Award, Vote } from "lucide-react"
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useToken } from '@/hooks/useStakingToken'
import { useStaking } from '@/hooks/useStakingContracts'
import { useState } from 'react'

export default function PortfolioPage() {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  // Token hook for wallet balance
  const { 
    balanceFormatted,
    symbol 
  } = useToken({
    chainId: chainId?.valueOf() as number,
    watchEvents: true
  });

  // Staking hook
  const { 
    stakedAmountFormatted,
    pendingRewardsFormatted,
    totalStakedFormatted,
    currentRewardRateFormatted,
    timeUntilUnlockSeconds,
    isLoading
  } = useStaking({
    chainId: chainId?.valueOf() as number,
    watchEvents: true
  });

  const walletBalance = Number(balanceFormatted || '0');
  const stakedAmount = Number(stakedAmountFormatted || '0');
  const pendingRewards = Number(pendingRewardsFormatted || '0');
  const totalStaked = Number(totalStakedFormatted || '0');
  // currentRewardRateFormatted is now just the percentage number (e.g., "20" for 20%)
  const currentAPY = currentRewardRateFormatted ? Number(currentRewardRateFormatted) : 0;
  const tokenSymbol = symbol || 'STABC';

  // Mock data for features not yet implemented
  const [activeTab, setActiveTab] = useState<'all' | 'stake' | 'unstake' | 'claim' | 'bridge'>('all');
  
  // Calculate lifetime earnings (using pending rewards as placeholder)
  // const lifetimeEarnings = pendingRewards;

  // Calculate time until unlock display
  const getUnlockDisplay = () => {
    if (!timeUntilUnlockSeconds || timeUntilUnlockSeconds <= 0) {
      return 'Unlocked';
    }
    const days = Math.floor(timeUntilUnlockSeconds / (24 * 60 * 60));
    const hours = Math.floor((timeUntilUnlockSeconds % (24 * 60 * 60)) / (60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  // Mock transaction data (to be replaced with real blockchain data)
  const transactions = [
    { id: 1, type: 'Stake', amount: stakedAmount > 0 ? stakedAmount : 0, hash: '0xabc...123', date: new Date().toLocaleDateString(), status: 'confirmed' },
    { id: 2, type: 'Claim', amount: pendingRewards, hash: '0xdef...456', date: new Date().toLocaleDateString(), status: 'confirmed' }
  ].filter(tx => tx.amount > 0);

  const filteredTransactions = transactions.filter(tx => 
    activeTab === 'all' || tx.type.toLowerCase() === activeTab
  );

  // Mock price for portfolio value calculation (replace with real price feed)
  const tokenPrice = 2.5;
  const totalPortfolioValue = (walletBalance + stakedAmount) * tokenPrice;

  if (isLoading) {
    return (
      <div className="mx-auto py-8 px-10 md:px-20 lg:px-40 min-h-screen bg-gray-950 text-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">Loading portfolio data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 px-10 md:px-20 lg:px-40 min-h-screen bg-gray-950 text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio</h2>
        <p className="text-gray-400">Track your assets and transaction history</p>
      </div>

      {/* Asset Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Asset Balances</h3>
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                  🪙
                </div>
                <div>
                  <div className="text-white font-bold">{tokenSymbol}</div>
                  <div className="text-gray-400 text-sm">{walletBalance.toFixed(4)} tokens</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">${(walletBalance * tokenPrice).toFixed(2)}</div>
                <div className="text-sm text-gray-400">Wallet Balance</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                  🔒
                </div>
                <div>
                  <div className="text-white font-bold">Staked {tokenSymbol}</div>
                  <div className="text-gray-400 text-sm">{stakedAmount.toFixed(4)} tokens</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">${(stakedAmount * tokenPrice).toFixed(2)}</div>
                <div className="text-sm font-medium text-green-500">
                  APY: {currentAPY.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                  ⟠
                </div>
                <div>
                  <div className="text-white font-bold">ETH</div>
                  <div className="text-gray-400 text-sm">Coming Soon</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">$0.00</div>
                <div className="text-sm text-gray-400">Bridge Feature</div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Portfolio Value</span>
              <span className="text-2xl font-bold text-white">
                ${totalPortfolioValue.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Total Staked (Global): {totalStaked.toFixed(2)} {tokenSymbol}
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
                <div className="text-sm text-gray-400">Pending Rewards</div>
                <div className="text-xl font-bold text-white">{pendingRewards.toFixed(4)} {tokenSymbol}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Claimable rewards from staking
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Staking Position</div>
                <div className="text-xl font-bold text-white">{stakedAmount > 0 ? '1' : '0'}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {stakedAmount > 0 ? `Unlocks in ${getUnlockDisplay()}` : 'No active position'}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 opacity-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Voting Power</div>
                <div className="text-xl font-bold text-white">{stakedAmount.toFixed(0)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Governance - Coming Soon
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
            <button 
              className="px-4 py-2 bg-gray-900 text-gray-400 rounded-lg hover:text-white transition-colors flex items-center gap-2"
              onClick={() => {/* Filter functionality coming soon */}}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button 
              className="px-4 py-2 bg-gray-900 text-gray-400 rounded-lg hover:text-white transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed"
              disabled
            >
              <Download className="w-4 h-4" />
              Export (Soon)
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', 'stake', 'unstake', 'claim', 'bridge'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={tab === 'bridge'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : tab === 'bridge'
                  ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'bridge' && ' (Soon)'}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {!address ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <p className="text-gray-400">Connect your wallet to view transaction history</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <p className="text-gray-400">No transactions yet</p>
              <p className="text-sm text-gray-500 mt-2">Start staking to see your transaction history!</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
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
                      {tx.type === 'Claim' ? '+' : ''}{tx.amount.toFixed(4)} {tokenSymbol}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center gap-1 hover:text-blue-400 cursor-pointer">
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
            ))
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Load more transactions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}