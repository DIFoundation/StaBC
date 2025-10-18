import { useEffect, useCallback, useMemo } from 'react';
import { useWalletClient } from 'wagmi';
import { Position, StakingEvents } from './types';
import { useToken } from './useToken';
import { useStakingContract } from './useStakingContract';
import { useUserPositions } from './useUserPositions';
import { useStakingActions } from './useStakingActions';

export function useStaking({
  onStaked,
  onWithdrawn,
  onRewardsClaimed,
  onError,
}: StakingEvents = {}) {
  const { data: walletClient } = useWalletClient();
  const account = walletClient?.account?.address;
  const isConnected = !!account;

  // Use the token hook
  const {
    balance: tokenBalance,
    allowance,
    isLoading: isTokenLoading,
    error: tokenError,
    approve,
    needsApproval,
    formatBalance: formatTokenAmount,
    parseAmount: parseTokenAmount,
    refresh: refreshTokenInfo,
  } = useToken(account);

  // Use the staking contract hook
  const {
    contractInfo,
    isLoading: isContractInfoLoading,
    error: contractError,
    refresh: refreshContractInfo,
  } = useStakingContract();

  // Use the user positions hook
  const {
    positions: userPositions,
    isLoading: isPositionsLoading,
    error: positionsError,
    refresh: refreshPositions,
  } = useUserPositions(account);

  // Use the staking actions hook
  const {
    isLoading: isActionLoading,
    error: actionError,
    stake: stakeTokens,
    withdraw: withdrawTokens,
    emergencyWithdraw: emergencyWithdrawTokens,
    claimRewards: claimStakingRewards,
    getPendingRewards,
    getTimeUntilUnlock,
  } = useStakingActions();

  // Combined loading state
  const isLoading = isTokenLoading || isContractInfoLoading || isPositionsLoading || isActionLoading;
  
  // Combined error state
  const error = tokenError || contractError || positionsError || actionError;

  // Effect to handle errors
  useEffect(() => {
    const currentError = tokenError || contractError || positionsError || actionError;
    if (currentError) {
      onError?.(currentError);
    }
  }, [tokenError, contractError, positionsError, actionError, onError]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      await Promise.all([
        refreshTokenInfo(),
        refreshContractInfo(),
        refreshPositions(),
      ]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh data');
      onError?.(error);
    }
  }, [isConnected, refreshTokenInfo, refreshContractInfo, refreshPositions, onError]);

  // Stake tokens
  const stake = useCallback(async (amount: string) => {
    if (!account) throw new Error('No wallet connected');
    
    try {
      // Check if approval is needed
      if (needsApproval(amount)) {
        throw new Error('Insufficient allowance. Please approve tokens first.');
      }

      await stakeTokens(amount);
      
      // Refresh all data after staking
      await refreshData();
      
      // Create a new position object for the callback
      const newPosition: Position = {
        id: account,
        status: 'Pending',
        amount,
        reward: '0',
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + Number(contractInfo?.minLockDuration || 0n),
        canWithdraw: false,
        timeUntilUnlock: Number(contractInfo?.minLockDuration || 0n)
      };
      
      onStaked?.(newPosition);
      return newPosition;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stake');
      onError?.(error);
      throw error;
    }
  }, [account, needsApproval, stakeTokens, refreshData, contractInfo, onStaked, onError]);

  // Withdraw tokens
  const withdraw = useCallback(async (amount?: string) => {
    try {
      await withdrawTokens(amount);
      await refreshData();
      onWithdrawn?.(account || '');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to withdraw');
      onError?.(error);
      throw error;
    }
  }, [withdrawTokens, refreshData, account, onWithdrawn, onError]);

  // Emergency withdraw
  const emergencyWithdraw = useCallback(async () => {
    try {
      await emergencyWithdrawTokens();
      await refreshData();
      onWithdrawn?.(account || '');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to emergency withdraw');
      onError?.(error);
      throw error;
    }
  }, [emergencyWithdrawTokens, refreshData, account, onWithdrawn, onError]);

  // Claim rewards
  const claimRewards = useCallback(async () => {
    try {
      // Get the current rewards amount before claiming
      const currentPosition = userPositions[0];
      const rewardAmount = currentPosition?.reward || '0';
      
      await claimStakingRewards();
      await refreshData();
      
      onRewardsClaimed?.(rewardAmount);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to claim rewards');
      onError?.(error);
      throw error;
    }
  }, [claimStakingRewards, refreshData, userPositions, onRewardsClaimed, onError]);

  // Format token balance and allowance for display
  const formattedTokenBalance = useMemo(() => {
    return tokenBalance !== undefined ? formatTokenAmount(tokenBalance) : '0';
  }, [tokenBalance, formatTokenAmount]);

  const formattedAllowance = useMemo(() => {
    return allowance !== undefined ? formatTokenAmount(allowance) : '0';
  }, [allowance, formatTokenAmount]);

  return {
    // State
    positions: userPositions,
    contractInfo,
    isLoading,
    error,
    tokenBalance: formattedTokenBalance,
    allowance: formattedAllowance,
    
    // Actions
    stake,
    withdraw,
    emergencyWithdraw,
    approve,
    claimRewards,
    
    // Utilities
    needsApproval,
    getPendingRewards,
    getTimeUntilUnlock,
    formatTokenAmount,
    parseTokenAmount,
    refreshData,
    refreshPositions,
  };
}
