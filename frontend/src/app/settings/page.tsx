'use client'
import { useState } from 'react'
import { Wallet, Settings, Moon, Sun, Copy, LogOut, ExternalLink, Globe, Coins, TrendingUp } from 'lucide-react';

export default function SettingsPage() {

    const userAddress = '0x742d...4a9c';
    const [theme, setTheme] = useState('dark');

  return (
    <div className="mx-auto  px-10 md:px-20 lg:px-40 py-8 min-h-screen bg-gray-950 text-white">
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
  )
}
