'use client'
import { useState } from 'react'
import { Wallet, Settings, Moon, Sun, Copy, LogOut, ExternalLink, Globe, Coins, TrendingUp, Check } from 'lucide-react';
import { useAppKitAccount, useAppKitNetwork, useDisconnect, useAppKit } from '@reown/appkit/react'
import { useToken } from '@/hooks/useStakingToken';
import { useStaking } from '@/hooks/useStakingContracts';
import { baseSepolia, celoAlfajores } from 'viem/chains';
import Link from 'next/link';

export default function SettingsPage() {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [slippage, setSlippage] = useState('1');
  const [deadline, setDeadline] = useState('20');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');

  // Token hook
  const { 
    symbol,
    balanceFormatted 
  } = useToken({
    chainId: chainId?.valueOf() as number
  });

  // Staking hook
  const { 
    stakedAmountFormatted,
    totalStakedFormatted 
  } = useStaking({
    chainId: chainId?.valueOf() as number
  });

  // Get network name
  const getNetworkName = () => {
    if (!chainId) return 'Unknown Network';
    if (chainId === 84532) return 'Base Sepolia';
    if (chainId === 44787) return 'Celo Alfajores';
    return `Chain ID: ${chainId}`;
  };

  // Format address for display
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return 'Not connected';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
  };

  // Handle network switch
  const handleNetworkSwitch = () => {
    open({ view: 'Networks' });
  };

  // Handle slippage selection
  const handleSlippageSelect = (value: string) => {
    setSlippage(value);
  };

  const tokenSymbol = symbol || 'STABC';
  const walletBalance = balanceFormatted || '0';
  const stakedAmount = stakedAmountFormatted || '0';

  return (
    <div className="mx-auto px-10 md:px-20 lg:px-40 py-8 min-h-screen bg-gray-950 text-white">
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
            {isConnected ? (
              <>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Connected Wallet</span>
                    <button 
                      onClick={handleDisconnect}
                      className="text-red-500 text-sm font-medium hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-white font-mono">{formatAddress(address)}</code>
                    <button 
                      onClick={copyAddress}
                      className="text-gray-400 hover:text-white transition-colors relative"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`https://${chainId === 84532 ? 'sepolia.basescan.org' : 'alfajores.celoscan.io'}/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Wallet Balance</div>
                      <div className="text-sm text-white font-medium">{Number(walletBalance).toFixed(4)} {tokenSymbol}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Staked Amount</div>
                      <div className="text-sm text-white font-medium">{Number(stakedAmount).toFixed(4)} {tokenSymbol}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium mb-1">Network</div>
                      <div className="text-sm text-gray-400">Currently connected to {getNetworkName()}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total Staked: {Number(totalStakedFormatted || '0').toFixed(2)} {tokenSymbol}
                      </div>
                    </div>
                    <button 
                      onClick={handleNetworkSwitch}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Switch Network
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <p className="text-gray-400 mb-4">No wallet connected</p>
                <button
                  onClick={() => open()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Connect Wallet
                </button>
              </div>
            )}
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
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              >
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
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              >
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
                {['0.5', '1', '3'].map((val) => (
                  <button 
                    key={val} 
                    onClick={() => handleSlippageSelect(val)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      slippage === val 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Custom"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                  step="0.1"
                  min="0"
                  max="100"
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
                  type="number"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-24 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Network Info */}
        {isConnected && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Network Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Chain ID</span>
                <span className="text-white font-mono">{chainId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network Name</span>
                <span className="text-white">{getNetworkName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Token Symbol</span>
                <span className="text-white">{tokenSymbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Explorer</span>
                <Link
                  href={`https://${chainId === 84532 ? 'sepolia.basescan.org' : 'alfajores.celoscan.io'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 flex items-center gap-1"
                >
                  View Explorer <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">About StaBC</h3>
          <div className="space-y-3 text-gray-400">
            <p>Version 1.0.0</p>
            <div className="flex flex-wrap gap-4">
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
  )
}