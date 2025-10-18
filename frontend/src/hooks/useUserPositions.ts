import { useState, useEffect, useCallback } from 'react';
import { Address, formatUnits } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';
import { CONTRACT_ABI } from '@/lib/abi';
import { Position, UserDetails, CONTRACT_ADDRESS } from './types';

export function useUserPositions(account?: Address) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPositions = useCallback(async () => {
    if (!publicClient || !walletClient?.account) {
      setIsLoading(false);
      return [];
    }

    try {
      setIsLoading(true);
      const userAddress = account || walletClient.account.address;

      const userDetails = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getUserDetails',
        args: [userAddress],
      }) as UserDetails;

      let userPositions: Position[] = [];
      
      if (userDetails && userDetails.stakedAmount > 0n) {
        const position: Position = {
          id: userAddress,
          status: userDetails.canWithdraw ? 'Active' : 'Pending',
          amount: formatUnits(userDetails.stakedAmount, 18),
          reward: formatUnits(userDetails.pendingRewards, 18),
          startTime: Number(userDetails.lastStakeTimestamp),
          endTime: Number(userDetails.lastStakeTimestamp) + Number(userDetails.timeUntilUnlock),
          canWithdraw: userDetails.canWithdraw,
          timeUntilUnlock: Number(userDetails.timeUntilUnlock)
        };
        userPositions = [position];
      }

      setPositions(userPositions);
      setError(null);
      return userPositions;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch positions');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, walletClient, account]);

  // Initial fetch
  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return {
    positions,
    isLoading,
    error,
    refresh: fetchPositions
  };
}
