"use client";

import React, { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

import { Button } from './button';
import { Check, ChevronDown } from 'lucide-react';

export function NetworkSwitchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useAccount();
  const { chains, switchChain, isPending } = useSwitchChain();

  // Supported networks
  const supportedChains = chains.filter((c) => 
    [1, 5, 10, 56, 137, 42161, 43114, 8453, 42220, 84532, 11142220].includes(c.id)
  );

  if (!chain) return null;

  const currentChain = supportedChains.find((c) => c.id === chain.id);

  const handleNetworkSwitch = async (chainId: number) => {
    if (switchChain) {
      switchChain({chainId});
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block`} >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium"
        disabled={isPending}
      >
        {currentChain ? (
          <span className="flex items-center">
            <span 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: getChainColor(currentChain.id) }}
            ></span>
            {getChainName(currentChain.id)}
          </span>
        ) : (
          'Unsupported Network'
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {supportedChains.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  disabled={isPending}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <span 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: getChainColor(network.id) }}
                    ></span>
                    {getChainName(network.id)}
                  </div>
                  {chain.id === network.id && <Check className="h-4 w-4 text-green-500" />}
                  {isPending && (
                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper functions remain the same
function getChainName(chainId: number): string {
  switch (chainId) {
    case 1: return 'Ethereum';
    case 5: return 'Goerli';
    case 10: return 'Optimism';
    case 56: return 'BNB Chain';
    case 137: return 'Polygon';
    case 8453: return 'Base';
    case 42161: return 'Arbitrum';
    case 43114: return 'Avalanche';
    case 42220: return 'Celo';
    case 84532: return 'Base Sepolia';
    case 11142220: return 'Celo Sepolia';
    default: return 'Unknown';
  }
}

function getChainColor(chainId: number): string {
  switch (chainId) {
    case 1: return '#627EEA';
    case 5: return '#f7c8c9';
    case 10: return '#FF0420';
    case 56: return '#F0B90B';
    case 137: return '#8247E5';
    case 8453: return '#0052FF';
    case 42161: return '#28A0F0';
    case 43114: return '#E84142';
    case 42220: return '#FCFF52';
    case 84532: return '#0052FF';
    case 11142220: return '#FCFF52';
    default: return '#9CA3AF';
  }
}