'use client'
import React from 'react'
import { Wallet, Coins } from 'lucide-react';
import { useState } from 'react';
import { AppKitNetworkButton } from '@reown/appkit/react';

export default function Header() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              StaBC
            </h1>
            <nav className="flex gap-1">
              {['dashboard', 'portfolio', 'settings'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    currentPage === page
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <appkit-account-button />
            <AppKitNetworkButton />
            <appkit-network-button />
          </div>
        </div>
      </div>
    </div>
  )
}
