"use client";

import React from 'react';
import { useAccount } from 'wagmi';
import { shortenAddress } from '@/lib/utils';
import { Button } from './button';
import { useAppKit } from '@reown/appkit/react';

export function ConnectWalletButton({
  className = '',
  showBalance = false,
  ...props
}: {
  className?: string;
  showBalance?: boolean;
  [key: string]: any;
}) {
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
      className={`relative overflow-hidden ${className}`}
      {...props}
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
