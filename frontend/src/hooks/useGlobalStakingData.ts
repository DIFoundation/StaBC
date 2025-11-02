import { useMemo } from 'react';
// import { formatUnits } from 'viem';
import { useStaking } from './useStakingContracts';
import { ChainId } from '@/lib/addresses';

interface GlobalStakingData {
  // Aggregated data
  totalStaked: string;
  totalStakedFormatted: string;
  totalStakers: number;
  totalRewards: string;
  totalRewardsFormatted: string;
  averageAPR: number;
  
  // Per-chain data
  chains: {
    [chainId: number]: {
      totalStaked: string;
      totalStakedFormatted: string;
      totalStakers: number;
      totalRewards: string;
      totalRewardsFormatted: string;
      apr: number;
      isLoading: boolean;
      isError: boolean;
    };
  };
  
  // Loading and error states
  isLoading: boolean;
  isError: boolean;
}

export function useGlobalStakingData(): GlobalStakingData {
  // Initialize staking hooks for each chain
  const baseStaking = useStaking({ 
    chainId: ChainId.baseSepolia,
    tokenDecimals: 18 
  });
  
  const celoStaking = useStaking({ 
    chainId: ChainId.celoSepolia,
    tokenDecimals: 18 
  });

  // Calculate aggregated data
  const aggregatedData = useMemo(() => {
    // Convert string values to numbers for calculations
    const baseStaked = parseFloat(baseStaking.totalStakedFormatted || '0');
    const celoStaked = parseFloat(celoStaking.totalStakedFormatted || '0');
    const baseRewards = parseFloat(baseStaking.totalRewardsFormatted || '0');
    const celoRewards = parseFloat(celoStaking.totalRewardsFormatted || '0');

    // Calculate totals
    const totalStaked = baseStaked + celoStaked;
    const totalRewards = baseRewards + celoRewards;
    
    // Calculate weighted average APR (simplified example)
    const baseAPR = parseFloat(baseStaking.currentRewardRateFormatted || '0');
    const celoAPR = parseFloat(celoStaking.currentRewardRateFormatted || '0');
    const totalStakedValue = totalStaked || 1; // Avoid division by zero
    const averageAPR = (
      (baseStaked * baseAPR + celoStaked * celoAPR) / totalStakedValue
    ) || 0;

    return {
      totalStaked: totalStaked.toString(),
      totalStakedFormatted: totalStaked.toFixed(4),
      totalRewards: totalRewards.toString(),
      totalRewardsFormatted: totalRewards.toFixed(4),
      averageAPR,
      totalStakers: 0, // This would need to be fetched from each chain
    };
  }, [baseStaking, celoStaking]);

  // Combine all data
  return {
    ...aggregatedData,
    chains: {
      [ChainId.baseSepolia]: {
        totalStaked: baseStaking.totalStakedFormatted?.toString() || '0',
        totalStakedFormatted: baseStaking.totalStakedFormatted || '0',
        totalRewards: baseStaking.totalRewardsFormatted?.toString() || '0',
        totalRewardsFormatted: baseStaking.totalRewardsFormatted || '0',
        totalStakers: 0, // This would need to be fetched
        apr: parseFloat(baseStaking.currentRewardRateFormatted || '0'),
        isLoading: baseStaking.isLoading,
        isError: baseStaking.isError,
      },
      [ChainId.celoSepolia]: {
        totalStaked: celoStaking.totalStakedFormatted?.toString() || '0',
        totalStakedFormatted: celoStaking.totalStakedFormatted || '0',
        totalRewards: celoStaking.totalRewardsFormatted?.toString() || '0',
        totalRewardsFormatted: celoStaking.totalRewardsFormatted || '0',
        totalStakers: 0, // This would need to be fetched
        apr: parseFloat(celoStaking.currentRewardRateFormatted || '0'),
        isLoading: celoStaking.isLoading,
        isError: celoStaking.isError,
      },
    },
    isLoading: baseStaking.isLoading || celoStaking.isLoading,
    isError: baseStaking.isError || celoStaking.isError,
  };
}
