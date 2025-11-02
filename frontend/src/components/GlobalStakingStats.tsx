import React from 'react';
import { useGlobalStakingData } from '../hooks/useGlobalStakingData';
import { ChainId } from '@/lib/addresses';
import { Skeleton } from '@/components/ui/skeleton';

const CHAIN_NAMES: Record<number, string> = {
  [ChainId.baseSepolia]: 'Base Sepolia',
  [ChainId.celoSepolia]: 'Celo Sepolia',
};

export function GlobalStakingStats() {
  const { 
    totalStakedFormatted, 
    totalRewardsFormatted, 
    averageAPR, 
    chains, 
    isLoading, 
    isError 
  } = useGlobalStakingData();

  if (isError) {
    return (
      <div className="bg-red-900/20 p-4 rounded-lg text-red-400 border border-red-900/50">
        Failed to load staking data. Please try again later.
      </div>
    );
  }

  const renderStat = (label: string, value: string | number, suffix: string = '') => (
    <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-xl border border-gray-800 shadow-lg">
      <span className="text-sm text-gray-400">{label}</span>
      {isLoading ? (
        <Skeleton className="h-8 w-24 my-1 bg-gray-800" />
      ) : (
        <span className="text-2xl font-bold text-white">
          {value} {suffix && <span className="text-blue-400">{suffix}</span>}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Global Staking Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {renderStat('Total Value Staked', totalStakedFormatted, 'STBC')}
          {renderStat('Total Rewards', totalRewardsFormatted, 'STBC')}
          {renderStat('Average APR', `${averageAPR.toFixed(2)}%`)}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">
          Per-Chain Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(chains).map(([chainId, chainData]) => (
            <div 
              key={chainId} 
              className="bg-gray-900/50 rounded-xl border border-gray-800 p-5 shadow-lg"
            >
              <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                {CHAIN_NAMES[Number(chainId)] || `Chain ${chainId}`}
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Staked:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20 bg-gray-800" />
                  ) : (
                    <span className="text-white">{chainData.totalStakedFormatted} <span className="text-blue-400">STBC</span></span>
                  )}
                </div>
                
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Rewards:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20 bg-gray-800" />
                  ) : (
                    <span className="text-white">{chainData.totalRewardsFormatted} <span className="text-blue-400">STBC</span></span>
                  )}
                </div>
                
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">APR:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-12 bg-gray-800" />
                  ) : (
                    <span className="text-green-400 font-medium">{chainData.apr.toFixed(2)}%</span>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Stakers:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-12 bg-gray-800" />
                  ) : (
                    <span className="text-white">{chainData.totalStakers}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
