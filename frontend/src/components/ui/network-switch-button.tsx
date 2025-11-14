"use client";

import React, { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { Button } from './button';
import { Check, ChevronDown } from 'lucide-react';

export function NetworkSwitchButton({
  className = '',
  ...props
}: {
  className?: string;
  [key: string]: any;
}) {
//   const { chain } = useNetwork();
const [isOpen, setIsOpen] = useState(false);

const { chain } = useAccount();
const { chains, isPending, switchChain  } = useSwitchChain();

  // Supported networks - you can customize this list as needed
  const supportedChains = chains.filter((c) => 
    [1, 5, 10, 56, 137, 42161, 43114, 8453, 42220].includes(c.id)
  );

  if (!chain) return null;

  const currentChain = supportedChains.find((c) => c.id === chain.id);
  const isSwitching = isPending !== undefined;

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        disabled={isSwitching}
      >
        {isSwitching ? (
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse mr-2"></span>
            Switching...
          </span>
        ) : (
          <>
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
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              Select Network
            </div>
            {supportedChains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                    switchChain?.({chainId: chain.id});
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  chain.id === currentChain?.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center">
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: getChainColor(chain.id) }}
                  ></span>
                  {getChainName(chain.id)}
                </div>
                {chain.id === currentChain?.id && <Check className="w-4 h-4 text-blue-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get chain name
function getChainName(chainId: number): string {
  const chainNames: { [key: number]: string } = {
    1: 'Ethereum',
    5: 'Goerli',
    10: 'Optimism',
    56: 'BNB Chain',
    137: 'Polygon',
    42220: 'Celo',
    43114: 'Avalanche',
    42161: 'Arbitrum',
    8453: 'Base',
  };
  return chainNames[chainId] || `Chain ${chainId}`;
}

// Helper function to get chain color
function getChainColor(chainId: number): string {
  const colors: { [key: number]: string } = {
    1: '#627EEA', // Ethereum blue
    5: '#f6c343', // Goerli yellow
    10: '#FF0420', // Optimism red
    56: '#F0B90B', // BSC yellow
    137: '#8247E5', // Polygon purple
    42220: '#FCFF52', // Celo yellow
    43114: '#E84142', // Avalanche red
    42161: '#28A0F0', // Arbitrum blue
    8453: '#0052FF', // Base blue
  };
  return colors[chainId] || '#9CA3AF'; // Default gray
}
