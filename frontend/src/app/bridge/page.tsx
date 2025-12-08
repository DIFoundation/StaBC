'use client'
import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Info, Loader2, ExternalLink } from 'lucide-react';
import { useBridgeContract } from '@/hooks/useBridgeAbi';
import { parseEther } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { base, celo } from 'wagmi/chains';

type ChainInfo = {
  id: number;
  name: string;
  logo: string;
  isSource: boolean;
};

export default function BridgePage() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [targetChain, setTargetChain] = useState<number>(base.id);
  const [isLocking, setIsLocking] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  // Chain configurations
  const SUPPORTED_CHAINS: ChainInfo[] = useMemo(() => [
    { id: base.id, name: 'Base', logo: '', isSource: true },
    { id: celo.id, name: 'Celo', logo: '', isSource: true },
  ], []);

  // Get contract instance - replace with your actual contract address
  const BRIDGE_CONTRACT = '0xYOUR_BRIDGE_CONTRACT_ADDRESS';
  
  const {
    // READ values
    owner,
    relayer,
    tokenAddress,
    tokenIsMintable,
    lockNonce,
    chainId,

    // WRITE actions
    lockTokens,
    unlockTokens,
    isPending,
  } = useBridgeContract(BRIDGE_CONTRACT as `0x${string}`);

  // Filter out current chain from target chains
  const targetChains = useMemo(() => 
    SUPPORTED_CHAINS.filter(c => c.id !== chain?.id),
    [chain?.id, SUPPORTED_CHAINS]
  );

  const handleBridge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !amount || !targetChain) return;
    
    try {
      setIsLocking(true);
      setTxHash(null);
      
      // Convert amount to wei
      const amountWei = parseEther(amount);
      
      // Call lockTokens function
      const tx = await lockTokens(
        amountWei,
        BigInt(targetChain),
        address // Using sender as recipient for demo, replace with actual recipient
      );
      
      setTxHash(tx);
      // Wait for transaction to be mined
      await tx;
      
      // Reset form
      setAmount('');
      setRecipient('');
    } catch (error) {
      console.error('Bridge transaction failed:', error);
      // Handle error (show toast/notification)
    } finally {
      setIsLocking(false);
    }
  };

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return 'Loading...';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 xl:px-20 2xl:px-40 py-8 min-h-screen bg-gray-950 text-white">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Bridge</h1>
            <p className="text-gray-400 mt-1">Bridge your tokens between Base and Celo networks</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bridge Form */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-6">Bridge Tokens</h2>
          
          <form onSubmit={handleBridge} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Bridge
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0.0"
                  step="0.000000000000000001"
                  min="0"
                  required
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <span className="text-gray-400">TOKEN</span>
                </div>
              </div>
            </div>

            {/* Target Chain Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destination Network
              </label>
              <div className="grid grid-cols-2 gap-3">
                {targetChains.map((chain) => (
                  <button
                    key={chain.id}
                    type="button"
                    onClick={() => setTargetChain(chain.id)}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                      targetChain === chain.id
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    } transition-colors`}
                  >
                    <span className="text-xl">{chain.logo}</span>
                    <span>{chain.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bridge Button */}
            <button
              type="submit"
              disabled={isPending || isLocking || !address}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLocking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Bridging...
                </>
              ) : !address ? (
                'Connect Wallet to Bridge'
              ) : (
                'Bridge Tokens'
              )}
            </button>
          </form>

          {/* Transaction Status */}
          {txHash && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Transaction submitted:</span>
                <a 
                  href={`https://basescan.org/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  View on Explorer <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bridge Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contract Info */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-medium text-lg mb-4">Bridge Contract</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Owner:</span>
                <span className="font-mono">
                  {owner.data ? formatAddress(owner.data as string) : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Relayer:</span>
                <span className="font-mono">
                  {relayer.data ? formatAddress(relayer.data as string) : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Token:</span>
                <span className="font-mono">
                  {tokenAddress.data ? formatAddress(tokenAddress.data as string) : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mintable:</span>
                <span>{tokenIsMintable.data ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transactions:</span>
                <span>{lockNonce.data?.toString() || '0'}</span>
              </div>
            </div>
          </div>

          {/* Bridge Info */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-medium text-lg mb-4">About Bridge</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <p>
                Bridge your tokens between Base and Celo networks with our secure cross-chain bridge.
              </p>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400">
                  <Info className="inline w-4 h-4 mr-1" />
                  Bridge fees may apply. Transactions typically complete in 5-15 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
