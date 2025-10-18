import { useState, useCallback } from 'react';
import { Address, parseUnits } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';
import { CONTRACT_ABI } from '@/lib/abi';
import { Position, CONTRACT_ADDRESS } from './types';

export function useStakingActions() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const stake = useCallback(async (amount: string) => {
    if (!walletClient?.account) {
      throw new Error('No wallet connected');
    }

    try {
      setIsLoading(true);
      const amountBigInt = parseUnits(amount, 18);
      
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'stake',
        args: [amountBigInt],
      });
      
      await publicClient?.waitForTransactionReceipt({ hash });
      
      // Create a new position object for the callback
      const newPosition: Position = {
        id: walletClient.account.address,
        status: 'Pending',
        amount,
        reward: '0',
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000), // Will be updated after fetching contract info
        canWithdraw: false,
        timeUntilUnlock: 0 // Will be updated after fetching contract info
      };
      
      return newPosition;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stake');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, publicClient]);

  const withdraw = useCallback(async (amount?: string) => {
    if (!walletClient?.account) {
      throw new Error('No wallet connected');
    }

    try {
      setIsLoading(true);
      const args = amount ? [parseUnits(amount, 18)] : [];
      
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'withdraw',
        args,
      });
      
      await publicClient?.waitForTransactionReceipt({ hash });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to withdraw');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, publicClient]);

  const emergencyWithdraw = useCallback(async () => {
    if (!walletClient?.account) {
      throw new Error('No wallet connected');
    }
    
    try {
      setIsLoading(true);
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'emergencyWithdraw',
        args: [],
      });
      
      await publicClient?.waitForTransactionReceipt({ hash });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to emergency withdraw');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, publicClient]);

  const claimRewards = useCallback(async () => {
    if (!walletClient?.account) {
      throw new Error('No wallet connected');
    }

    try {
      setIsLoading(true);
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'claimRewards',
        args: [],
      });
      
      await publicClient?.waitForTransactionReceipt({ hash });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to claim rewards');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, publicClient]);

  const getPendingRewards = useCallback(async (userAddress: Address) => {
    if (!publicClient) return 0n;
    
    try {
      return await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getPendingRewards',
        args: [userAddress],
      }) as bigint;
    } catch (err) {
      console.error('Failed to get pending rewards:', err);
      return 0n;
    }
  }, [publicClient]);

  const getTimeUntilUnlock = useCallback(async (userAddress: Address) => {
    if (!publicClient) return 0n;
    
    try {
      return await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTimeUntilUnlock',
        args: [userAddress],
      }) as bigint;
    } catch (err) {
      console.error('Failed to get time until unlock:', err);
      return 0n;
    }
  }, [publicClient]);

  return {
    isLoading,
    error,
    stake,
    withdraw,
    emergencyWithdraw,
    claimRewards,
    getPendingRewards,
    getTimeUntilUnlock,
  };
}
