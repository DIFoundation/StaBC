"use client";

import React from 'react';
import { useAccount } from 'wagmi';
import { shortenAddress } from '@/lib/utils';
import { Button } from './button';
import { useAppKit } from '@reown/appkit/react';

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  // Handle wallet connection
  const handleConnect = () => {
    if (isConnected) {
      open({view: "Account"});
      return;
    }
    
    if (open) {
      open({view: "Connect"});
    }
  };

  // Format address for display
  const displayAddress = address ? shortenAddress(address) : '';

  return (
    <Button
      onClick={handleConnect}
      className={`relative overflow-hidden bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium`}
    >
      {isConnected ? (
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          {displayAddress}
        </span>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
}
