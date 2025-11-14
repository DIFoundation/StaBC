"use client";

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from './button';
import { Check, ChevronDown } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';

export function NetworkSwitchButton({
  className = '',
  ...props
}: {
  className?: string;
  [key: string]: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useAccount();
  const { switchNetwork, chains: availableChains } = useAppKit();

  // Supported networks
  const supportedChains = availableChains?.filter((c) => 
    [1, 5, 10, 56, 137, 42161, 43114, 8453, 42220].includes(c.id)
  ) || [];

  if (!chain) return null;

  const currentChain = supportedChains.find((c) => c.id === chain.id);

  const handleNetworkSwitch = async (chainId: number) => {
    if (switchNetwork) {
      await switchNetwork(chainId);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
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
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {supportedChains.map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: getChainColor(network.id) }}
                  ></span>
                  {getChainName(network.id)}
                </div>
                {chain.id === network.id && <Check className="h-4 w-4 text-green-500" />}
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
    default: return 'Unknown';
  }
}

// Helper function to get chain color
function getChainColor(chainId: number): string {
  switch (chainId) {
    case 1: return '#627EEA'; // Ethereum
    case 5: return '#f7c8c9'; // Goerli
    case 10: return '#FF0420'; // Optimism
    case 56: return '#F0B90B'; // BNB Chain
    case 137: return '#8247E5'; // Polygon
    case 8453: return '#0052FF'; // Base
    case 42161: return '#28A0F0'; // Arbitrum
    case 43114: return '#E84142'; // Avalanche
    case 42220: return '#FCFF52'; // Celo
    default: return '#9CA3AF'; // Default gray
  }
}
