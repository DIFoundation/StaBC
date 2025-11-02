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
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
        Failed to load staking data. Please try again later.
      </div>
    );
  }

  const renderStat = (label: string, value: string | number, suffix: string = '') => (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      {isLoading ? (
        <Skeleton className="h-8 w-24 my-1" />
      ) : (
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value} {suffix}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Global Staking Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {renderStat('Total Value Staked', totalStakedFormatted, 'STBC')}
          {renderStat('Total Rewards', totalRewardsFormatted, 'STBC')}
          {renderStat('Average APR', `${averageAPR.toFixed(2)}%`)}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Per-Chain Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(chains).map(([chainId, chainData]) => (
            <div 
              key={chainId} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {CHAIN_NAMES[Number(chainId)] || `Chain ${chainId}`}
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Staked:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20" />
                  ) : (
                    <span>{chainData.totalStakedFormatted} STBC</span>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Rewards:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20" />
                  ) : (
                    <span>{chainData.totalRewardsFormatted} STBC</span>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">APR:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-12" />
                  ) : (
                    <span>{chainData.apr.toFixed(2)}%</span>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Stakers:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-12" />
                  ) : (
                    <span>{chainData.totalStakers}</span>
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
