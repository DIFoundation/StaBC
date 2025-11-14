"use client";

import React from 'react';
import { useAccount, useConnect, useDisconnect, type UseConnectReturnType } from 'wagmi';
import { shortenAddress } from '@/lib/utils';
import { Button } from './button';

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
  const { connect, connectors, isPending, ...rest } = useConnect();
  const pendingConnector = (rest as any).pendingConnector;
  const { disconnect } = useDisconnect();

  // Handle wallet connection
  const handleConnect = () => {
    if (isConnected) {
      disconnect();
      return;
    }
    
    // Default to the first connector (usually MetaMask)
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  // Format address for display
  const displayAddress = address ? shortenAddress(address) : '';
  const isLoadingConnector = isPending && pendingConnector?.id === connectors[0]?.id;

  return (
    <Button
      onClick={handleConnect}
      className={`relative overflow-hidden ${className}`}
      disabled={isLoadingConnector}
      {...props}
    >
      {isLoadingConnector ? (
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse mr-2"></span>
          Connecting...
        </span>
      ) : isConnected ? (
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
          {showBalance ? (
            <span className="flex items-center">
              {/* You can add balance display here if needed */}
              {displayAddress}
            </span>
          ) : (
            displayAddress
          )}
        </span>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
}
