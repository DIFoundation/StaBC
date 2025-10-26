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