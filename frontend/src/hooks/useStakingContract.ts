import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ABI } from '@/lib/abi';
import { ContractInfo, CONTRACT_ADDRESS } from './types';

export function useStakingContract() {
  const publicClient = usePublicClient();
  
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContractInfo = useCallback(async () => {
    if (!publicClient) return;

    try {
      setIsLoading(true);
      
      const [
        totalStaked,
        currentRewardRate,
        minLockDuration,
        emergencyWithdrawPenalty,
        initialApr,
        aprReductionPerThousand,
        isPaused
      ] = await Promise.all([
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'totalStaked',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'currentRewardRate',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'minLockDuration',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'emergencyWithdrawPenalty',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'initialApr',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'aprReductionPerThousand',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'paused',
        }) as Promise<boolean>
      ]);

      setContractInfo({
        totalStaked,
        currentRewardRate,
        minLockDuration,
        emergencyWithdrawPenalty,
        initialApr,
        aprReductionPerThousand,
        isPaused
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch contract info:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch contract info'));
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  // Initial fetch
  useEffect(() => {
    fetchContractInfo();
  }, [fetchContractInfo]);

  return {
    contractInfo,
    isLoading,
    error,
    refresh: fetchContractInfo
  };
}
