import { parseUnits, formatUnits, createPublicClient, http, parseEventLogs } from 'viem';
import { baseSepolia, celoAlfajores } from 'viem/chains';
import { TOKEN_ABI } from '../lib/abi';
import { getContractAddresses } from '../lib/addresses';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useEffect } from 'react';

interface UseTokenParams {
  chainId: number;
  spenderAddress?: `0x${string}`;
  watchEvents?: boolean;
}

interface UseTokenReturn {
  name: string | undefined;
  symbol: string | undefined;
  decimals: number | undefined;
  totalSupply: bigint | undefined;
  mintAmount: bigint | undefined;
  mintCooldown: bigint | undefined;
  balance: bigint | undefined;
  balanceFormatted: string | undefined;
  allowance: bigint | undefined;
  allowanceFormatted: string | undefined;
  lastMintTimestamp: bigint | undefined;
  canMint: boolean;
  timeUntilNextMint: number | undefined;
  isLoading: boolean;
  isError: boolean;
  mint: () => Promise<void>;
  transfer: (to: `0x${string}`, amount: string) => Promise<void>;
  approve: (spender: `0x${string}`, amount: string) => Promise<void>;
  transferFrom: (from: `0x${string}`, to: `0x${string}`, amount: string) => Promise<void>;
  isPending: boolean;
}

export function useToken({ 
  chainId, 
  spenderAddress,
  watchEvents = false 
}: UseTokenParams): UseTokenReturn {
  const { address: userAddress } = useAccount();
  const tokenAddress = getContractAddresses(chainId).stakingToken as `0x${string}`;
  
  // Create public client for the current chain
  const publicClient = createPublicClient({
    chain: chainId === 84532 ? baseSepolia : celoAlfajores,
    transport: http()
  });

  // Read contract data
  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'name',
    chainId,
  }) as { data: string | undefined };

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'symbol',
    chainId,
  }) as { data: string | undefined };

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'decimals',
    chainId,
  }) as { data: number | undefined };

  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'totalSupply',
    chainId,
  }) as { data: bigint | undefined };

  const { data: mintAmount } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'MINT_AMOUNT',
    chainId,
  }) as { data: bigint | undefined };

  const { data: mintCooldown } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'MINT_COOLDOWN',
    chainId,
  }) as { data: bigint | undefined };

  const { 
    data: balance, 
    isLoading: isBalanceLoading, 
    isError: isBalanceError, 
    refetch: refetchBalance 
  } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    chainId,
    query: {
      enabled: !!userAddress,
    },
  }) as { 
    data: bigint | undefined; 
    isLoading: boolean; 
    isError: boolean; 
    refetch: () => void; 
  };

  const { 
    data: allowance, 
    refetch: refetchAllowance 
  } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: userAddress && spenderAddress ? [userAddress, spenderAddress] : undefined,
    chainId,
    query: {
      enabled: !!userAddress && !!spenderAddress,
    },
  }) as { 
    data: bigint | undefined; 
    refetch: () => void; 
  };

  const { 
    data: lastMintTimestamp, 
    refetch: refetchLastMint 
  } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'lastMintTimestamp',
    args: userAddress ? [userAddress] : undefined,
    chainId,
    query: {
      enabled: !!userAddress,
    },
  }) as { 
    data: bigint | undefined; 
    refetch: () => void; 
  };

  // Computed values
  const balanceFormatted = balance !== undefined && decimals !== undefined 
    ? formatUnits(balance, decimals) 
    : undefined;

  const allowanceFormatted = allowance !== undefined && decimals !== undefined
    ? formatUnits(allowance, decimals)
    : undefined;

  const canMint = lastMintTimestamp !== undefined && mintCooldown !== undefined
    ? Date.now() / 1000 >= Number(lastMintTimestamp) + Number(mintCooldown)
    : false;

  const timeUntilNextMint = lastMintTimestamp !== undefined && mintCooldown !== undefined
    ? Math.max(0, (Number(lastMintTimestamp) + Number(mintCooldown)) - Date.now() / 1000)
    : undefined;

  // Event watching
  useEffect(() => {
    if (!watchEvents || !userAddress || !publicClient) return;

    // Watch Transfer events
    const unwatchTransfer = publicClient.watchContractEvent({
      address: tokenAddress,
      abi: TOKEN_ABI,
      eventName: 'Transfer',
      onLogs: (logs) => {
        const involvedInTransfer = logs.some(
          (log) => {
            // Use type assertion to access the event data
            const event = log as unknown as { args: { from?: `0x${string}`; to?: `0x${string}`; amount?: bigint } };
            return (
              (event.args.from?.toLowerCase() === userAddress?.toLowerCase()) ||
              (event.args.to?.toLowerCase() === userAddress?.toLowerCase())
            );
          }
        );
        if (involvedInTransfer) {
          refetchBalance();
        }
      },
    });

    // Watch Approval events
    const unwatchApproval = publicClient.watchContractEvent({
      address: tokenAddress,
      abi: TOKEN_ABI,
      eventName: 'Approval',
      onLogs: (logs) => {
        const userApproved = logs.some((log) => {
          try {
            const events = parseEventLogs({
              abi: TOKEN_ABI,
              eventName: 'Approval',
              logs: [log],
            });
            if (events.length > 0) {
              const event = events[0] as { owner?: `0x${string}`; args?: { owner?: `0x${string}` } };
              const owner = event.owner || event.args?.owner;
              return owner?.toLowerCase() === userAddress?.toLowerCase();
            }
            return false;
          } catch (e) {
            console.error('Error parsing Approval event:', e);
            return false;
          }
        });
        if (userApproved) {
          refetchAllowance();
        }
      },
    });

    return () => {
      unwatchTransfer();
      unwatchApproval();
    };
  }, [watchEvents, userAddress, spenderAddress, tokenAddress, publicClient, refetchBalance, refetchAllowance]);

  // Write contract functions
  const { writeContract, isPending } = useWriteContract();

  const mint = async () => {
    if (!userAddress) throw new Error('Wallet not connected');
    
    await writeContract({
      address: tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'mint',
      chainId,
    });

    // Refetch data after successful mint
    setTimeout(() => {
      refetchBalance();
      refetchLastMint();
    }, 2000);
  };

  const transfer = async (to: `0x${string}`, amount: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    if (decimals === undefined) throw new Error('Decimals not loaded');

    const amountInWei = parseUnits(amount, decimals);

    await writeContract({
      address: tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'transfer',
      args: [to, amountInWei],
      chainId,
    });

    setTimeout(() => {
      refetchBalance();
    }, 2000);
  };

  const approve = async (spender: `0x${string}`, amount: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    if (decimals === undefined) throw new Error('Decimals not loaded');

    const amountInWei = parseUnits(amount, decimals);

    await writeContract({
      address: tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [spender, amountInWei],
      chainId,
    });

    setTimeout(() => {
      refetchAllowance();
    }, 2000);
  };

  const transferFrom = async (from: `0x${string}`, to: `0x${string}`, amount: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    if (decimals === undefined) throw new Error('Decimals not loaded');

    const amountInWei = parseUnits(amount, decimals);

    await writeContract({
      address: tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'transferFrom',
      args: [from, to, amountInWei],
      chainId,
    });

    setTimeout(() => {
      refetchBalance();
      refetchAllowance();
    }, 2000);
  };

  return {
    name,
    symbol,
    decimals,
    totalSupply,
    mintAmount,
    mintCooldown,
    balance,
    balanceFormatted,
    allowance,
    allowanceFormatted,
    lastMintTimestamp,
    canMint,
    timeUntilNextMint,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    mint,
    transfer,
    approve,
    transferFrom,
    isPending,
  };
}