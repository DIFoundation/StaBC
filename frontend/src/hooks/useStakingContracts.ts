import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useCallback } from "react";
import { CONTRACT_ABI } from "../lib/abi";
import { getContractAddresses } from "../lib/addresses";

// ============================================================================
// TYPES
// ============================================================================
// interface UserDetails {
//   stakedAmount: bigint;
//   lastStakeTimestamp: bigint;
//   pendingRewards: bigint;
//   timeUntilUnlock: bigint;
//   canWithdraw: boolean;
// }

// interface UserInfo {
//   stakedAmount: bigint;
//   lastStakeTimestamp: bigint;
//   rewardDebt: bigint;
//   pendingRewards: bigint;
// }

interface UseStakingParams {
  chainId: number;
  watchEvents?: boolean;
  tokenDecimals?: number; // default 18
}

interface UseStakingReturn {
  totalStakedFormatted?: string;
  stakedAmountFormatted?: string;
  pendingRewardsFormatted?: string;
  currentRewardRateFormatted?: string;
  totalRewardsFormatted?: string;
  timeUntilUnlockSeconds?: number;
  canWithdraw?: boolean;
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;

  // Write actions
  stake: (amount: string) => Promise<void>;
  withdraw: (amount: string) => Promise<void>;
  claimRewards: () => Promise<void>;
  emergencyWithdraw: () => Promise<void>;

  pause: () => Promise<void>;
  unpause: () => Promise<void>;
  setInitialApr: (newApr: string) => Promise<void>;
  setMinLockDuration: (newDuration: string) => Promise<void>;
  setAprReductionPerThousand: (newReduction: string) => Promise<void>;
  setEmergencyWithdrawPenalty: (newPenalty: string) => Promise<void>;
  recoverERC20: (tokenAddress: `0x${string}`, amount: string) => Promise<void>;
  transferOwnership: (newOwner: `0x${string}`) => Promise<void>;
  renounceOwnership: () => Promise<void>;

  refetchAll: () => void;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================
export function useStaking({
  chainId,
  watchEvents = false,
  tokenDecimals = 18,
}: UseStakingParams): UseStakingReturn {
  const { address: userAddress } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const stakingAddress = getContractAddresses(chainId)?.stakingContract as
    | `0x${string}`
    | undefined;

  if (!stakingAddress) {
    throw new Error(`No staking contract found for chain ${chainId}`);
  }

  // ============================================================================
  // CONTRACT READS
  // ============================================================================

  const { data: totalStaked, refetch: refetchTotalStaked } = useReadContract({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    functionName: "totalStaked",
    chainId,
  }) as { data: bigint | undefined; refetch: () => void };

  const { data: totalRewards, refetch: refetchTotalRewards } = useReadContract({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    functionName: "getTotalRewards",
    chainId,
  }) as { data: bigint | undefined; refetch: () => void };

  const { data: currentRewardRate, refetch: refetchRewardRate } =
    useReadContract({
      address: stakingAddress,
      abi: CONTRACT_ABI,
      functionName: "currentRewardRate",
      chainId,
    }) as { data: bigint | undefined; refetch: () => void };

  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
    refetch: refetchUserInfo,
  } = useReadContract({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    functionName: "userInfo",
    args: userAddress ? [userAddress] : undefined,
    chainId,
    query: { enabled: !!userAddress },
  }) as {
    data: unknown[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };

  const { data: userDetails, refetch: refetchUserDetails } = useReadContract({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    functionName: "getUserDetails",
    args: userAddress ? [userAddress] : undefined,
    chainId,
    query: { enabled: !!userAddress },
  }) as { data: { canWithdraw: boolean } | undefined; refetch: () => void };

  const { data: pendingRewards, refetch: refetchPendingRewards } =
    useReadContract({
      address: stakingAddress,
      abi: CONTRACT_ABI,
      functionName: "getPendingRewards",
      args: userAddress ? [userAddress] : undefined,
      chainId,
      query: { enabled: !!userAddress },
    }) as { data: bigint | string | number | undefined; refetch: () => void };

  const { data: timeUntilUnlock, refetch: refetchTimeUntilUnlock } =
    useReadContract({
      address: stakingAddress,
      abi: CONTRACT_ABI,
      functionName: "getTimeUntilUnlock",
      args: userAddress ? [userAddress] : undefined,
      chainId,
      query: { enabled: !!userAddress },
    }) as { data: bigint | string | number | undefined; refetch: () => void };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const totalStakedFormatted = totalStaked
    ? formatUnits(BigInt(totalStaked.toString()), tokenDecimals)
    : undefined;

  const currentRewardRateFormatted =
    currentRewardRate !== undefined
      ? formatUnits(BigInt(currentRewardRate), tokenDecimals)
      : undefined;

  const totalRewardsFormatted =
    totalRewards !== undefined
      ? formatUnits(totalRewards, tokenDecimals)
      : undefined;

  const stakedAmount =
    userInfo && Array.isArray(userInfo) && userInfo[0] != null
      ? BigInt(userInfo[0].toString())
      : undefined;

  const stakedAmountFormatted =
    stakedAmount !== undefined
      ? formatUnits(stakedAmount, tokenDecimals)
      : undefined;

  const pendingRewardsFormatted =
    pendingRewards !== undefined
      ? formatUnits(BigInt(pendingRewards.toString()), tokenDecimals)
      : undefined;

  const timeUntilUnlockSeconds =
    timeUntilUnlock !== undefined
      ? Number(timeUntilUnlock.toString())
      : undefined;

  const canWithdraw =
    typeof userDetails?.canWithdraw === "boolean"
      ? userDetails.canWithdraw
      : false;

  // ============================================================================
  // UTILITIES
  // ============================================================================
  const refetchAll = useCallback(() => {
    refetchUserInfo();
    refetchUserDetails();
    refetchPendingRewards();
    refetchTimeUntilUnlock();
    refetchTotalStaked();
    refetchTotalRewards();
    refetchRewardRate();
  }, [
    refetchUserInfo,
    refetchUserDetails,
    refetchPendingRewards,
    refetchTimeUntilUnlock,
    refetchTotalStaked,
    refetchTotalRewards,
    refetchRewardRate,
  ]);

  // ============================================================================
  // EVENT WATCHING
  // ============================================================================
  const handleEvent = useCallback(() => {
    refetchAll();
  }, [refetchAll]);

  // call hooks at top level — one per event (order and count must be stable)
  useWatchContractEvent({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    eventName: "Staked",
    chainId,
    enabled: watchEvents,
    onLogs: (logs) => {
      const userInvolved = logs.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (log: any) =>
          log.args?.user?.toLowerCase() === userAddress?.toLowerCase()
      );
      if (userInvolved) handleEvent();
    },
  });

  useWatchContractEvent({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    eventName: "Withdrawn",
    chainId,
    enabled: watchEvents,
    onLogs: (logs) => {
      const userInvolved = logs.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (log: any) =>
          log.args?.user?.toLowerCase() === userAddress?.toLowerCase()
      );
      if (userInvolved) handleEvent();
    },
  });

  useWatchContractEvent({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    eventName: "RewardsClaimed",
    chainId,
    enabled: watchEvents,
    onLogs: (logs) => {
      const userInvolved = logs.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (log: any) =>
          log.args?.user?.toLowerCase() === userAddress?.toLowerCase()
      );
      if (userInvolved) handleEvent();
    },
  });

  useWatchContractEvent({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    eventName: "EmergencyWithdrawn",
    chainId,
    enabled: watchEvents,
    onLogs: (logs) => {
      const userInvolved = logs.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (log: any) =>
          log.args?.user?.toLowerCase() === userAddress?.toLowerCase()
      );
      if (userInvolved) handleEvent();
    },
  });

  useWatchContractEvent({
    address: stakingAddress,
    abi: CONTRACT_ABI,
    eventName: "RewardRateUpdated",
    chainId,
    enabled: watchEvents,
    onLogs: (logs) => {
      const userInvolved = logs.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (log: any) =>
          log.args?.user?.toLowerCase() === userAddress?.toLowerCase()
      );
      if (userInvolved) handleEvent();
    },
  });

  // ============================================================================
  // WRITES (ACTIONS)
  // ============================================================================
  const safeWrite = async (fn: () => Promise<void>) => {
    try {
      await fn();
      refetchAll();
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  const stake = async (amount: string) =>
    safeWrite(async () => {
      const amountInWei = parseUnits(amount, tokenDecimals);
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "stake",
        args: [amountInWei],
        chainId,
      });
    });

  const withdraw = async (amount: string) =>
    safeWrite(async () => {
      const amountInWei = parseUnits(amount, tokenDecimals);
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "withdraw",
        args: [amountInWei],
        chainId,
      });
    });

  const claimRewards = async () =>
    safeWrite(async () => {
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "claimRewards",
        chainId,
      });
    });

  const emergencyWithdraw = async () =>
    safeWrite(async () => {
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "emergencyWithdraw",
        chainId,
      });
    });

  const pause = async () =>
    writeContract({
      address: stakingAddress,
      abi: CONTRACT_ABI,
      functionName: "pause",
      chainId,
    });

  const unpause = async () =>
    writeContract({
      address: stakingAddress,
      abi: CONTRACT_ABI,
      functionName: "unpause",
      chainId,
    });

  const setInitialApr = async (newApr: string) =>
    safeWrite(async () => {
      const aprInWei = parseUnits(newApr, tokenDecimals);
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "setInitialApr",
        args: [aprInWei],
        chainId,
      });
    });

  const setMinLockDuration = async (newDuration: string) =>
    safeWrite(async () => {
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "setMinLockDuration",
        args: [BigInt(newDuration)],
        chainId,
      });
    });

  const setAprReductionPerThousand = async (newReduction: string) =>
    safeWrite(async () => {
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "setAprReductionPerThousand",
        args: [BigInt(newReduction)],
        chainId,
      });
    });

  const setEmergencyWithdrawPenalty = async (newPenalty: string) =>
    safeWrite(async () => {
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "setEmergencyWithdrawPenalty",
        args: [BigInt(newPenalty)],
        chainId,
      });
    });

  const recoverERC20 = async (tokenAddress: `0x${string}`, amount: string) =>
    safeWrite(async () => {
      const amountInWei = parseUnits(amount, tokenDecimals);
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "recoverERC20",
        args: [tokenAddress, amountInWei],
        chainId,
      });
    });

  const transferOwnership = async (newOwner: `0x${string}`) =>
    safeWrite(async () => {
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "transferOwnership",
        args: [newOwner],
        chainId,
      });
    });

  const renounceOwnership = async () =>
    safeWrite(async () => {
      await writeContract({
        address: stakingAddress,
        abi: CONTRACT_ABI,
        functionName: "renounceOwnership",
        chainId,
      });
    });

  // // ============================================================================
  // // UTILITIES
  // // ============================================================================
  // const refetchAll = useCallback(() => {
  //   refetchUserInfo();
  //   refetchUserDetails();
  //   refetchPendingRewards();
  //   refetchTimeUntilUnlock();
  //   refetchTotalStaked();
  //   refetchTotalRewards();
  //   refetchRewardRate();
  // }, [ refetchUserInfo, refetchUserDetails, refetchPendingRewards, refetchTimeUntilUnlock, refetchTotalStaked, refetchTotalRewards, refetchRewardRate ]);

  // ============================================================================
  // RETURN
  // ============================================================================
  return {
    totalStakedFormatted,
    stakedAmountFormatted,
    pendingRewardsFormatted,
    currentRewardRateFormatted,
    totalRewardsFormatted,
    timeUntilUnlockSeconds,
    canWithdraw,

    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
    isPending,

    stake,
    withdraw,
    claimRewards,
    emergencyWithdraw,

    pause,
    unpause,
    setInitialApr,
    setMinLockDuration,
    setAprReductionPerThousand,
    setEmergencyWithdrawPenalty,
    recoverERC20,
    transferOwnership,
    renounceOwnership,
    refetchAll,
  };
}
