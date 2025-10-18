import { Address } from 'viem';

export type Position = {
  id: string;
  status: 'Active' | 'Inactive' | 'Pending';
  amount: string;
  reward: string;
  startTime: number;
  endTime: number;
  canWithdraw: boolean;
  timeUntilUnlock: number;
};

export type StakingEvents = {
  onStaked?: (position: Position) => void;
  onWithdrawn?: (positionId: string) => void;
  onRewardsClaimed?: (amount: string) => void;
  onError?: (error: Error) => void;
};

export type UserDetails = {
  stakedAmount: bigint;
  lastStakeTimestamp: bigint;
  pendingRewards: bigint;
  timeUntilUnlock: bigint;
  canWithdraw: boolean;
};

export type ContractInfo = {
  totalStaked: bigint;
  currentRewardRate: bigint;
  minLockDuration: bigint;
  emergencyWithdrawPenalty: bigint;
  initialApr: bigint;
  aprReductionPerThousand: bigint;
  isPaused: boolean;
};

export type TokenInfo = {
  balance: bigint;
  allowance: bigint;
};

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as Address;
export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as Address;

export type TransactionEvent = {
  txHash: string;
  user: string;
  timestamp: number;
  blockNumber: bigint;
  type: 'Staked' | 'Withdrawn' | 'EmergencyWithdrawn' | 'RewardsClaimed';
  amount?: bigint;
  newTotalStaked?: bigint;
  currentRewardRate?: bigint;
  rewardsAccrued?: bigint;
  penalty?: bigint;
  newPendingRewards?: bigint;
  totalStaked?: bigint;
};

export type TransactionHistory = TransactionEvent[];