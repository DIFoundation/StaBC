import { useState, useEffect, useCallback } from 'react';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS, TokenInfo } from './types';

export function useToken(account?: Address) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({ balance: 0n, allowance: 0n });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTokenInfo = useCallback(async () => {
    if (!publicClient || !walletClient?.account) {
      setIsLoading(false);
      return;
    }

    try {
      const userAddress = account || walletClient.account.address;

      const [balance, allowance] = await Promise.all([
        publicClient.readContract({
          address: TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [userAddress],
        }) as Promise<bigint>,
        publicClient.readContract({
          address: TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [userAddress, CONTRACT_ADDRESS],
        }) as Promise<bigint>
      ]);

      setTokenInfo({ balance, allowance });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch token info:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch token info'));
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, walletClient, account]);

  const approve = useCallback(async (amount: string) => {
    if (!walletClient?.account?.address) {
      throw new Error('Please connect your wallet first');
    }

    if (!publicClient) {
      throw new Error('Failed to connect to the network');
    }

    try {
      const amountBigInt = parseUnits(amount, 18);
      
      const { request } = await publicClient.simulateContract({
        account: walletClient.account,
        address: TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amountBigInt],
      });

      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        await fetchTokenInfo();
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Approval error:', err);
      const error = err instanceof Error ? err : new Error('Failed to approve tokens');
      setError(error);
      throw error;
    }
  }, [walletClient, publicClient, fetchTokenInfo]);

  const needsApproval = useCallback((amount: string) => {
    const amountBigInt = parseUnits(amount, 18);
    return tokenInfo.allowance < amountBigInt;
  }, [tokenInfo.allowance]);

  // Initial fetch
  useEffect(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  return {
    ...tokenInfo,
    isLoading,
    error,
    approve,
    needsApproval,
    refresh: fetchTokenInfo,
    formatBalance: (amount: bigint) => formatUnits(amount, 18),
    parseAmount: (amount: string) => parseUnits(amount, 18)
  };
}
