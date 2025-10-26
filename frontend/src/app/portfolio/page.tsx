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