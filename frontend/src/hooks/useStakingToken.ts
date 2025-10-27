import { useEffect, useState, useCallback } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { getContractAddresses } from "@/lib/addresses";
import { TOKEN_ABI } from "@/lib/abi";
import { createPublicClient, createWalletClient, custom, formatEther, parseEther } from "viem";
import { baseSepolia, celoAlfajores } from "viem/chains";

// Map to chain IDs
const CHAINS: Record<number, any> = {
  84532: baseSepolia,
  11142220: celoAlfajores,
};STAKING_ABI

export function useStakingToken() {
  const { address, chainId, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider();

  const [balance, setBalance] = useState<string>("0");
  const [decimals, setDecimals] = useState<number>(18);
  const [symbol, setSymbol] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ✅ Instantiate contract clients
  const chain = CHAINS[chainId ?? 84532];
  const addresses = chainId ? getContractAddresses(chainId) : null;

  const publicClient = chain
    ? createPublicClient({ chain, transport: custom(walletProvider as any) })
    : null;

  const walletClient = walletProvider
    ? createWalletClient({
        account: address as `0x${string}`,
        chain,
        transport: custom(walletProvider as any),
      })
    : null;

  // 🔹 Fetch token balance
  const fetchBalance = useCallback(async () => {
    if (!publicClient || !addresses?.stakingToken || !address) return;
    try {
      const result = await publicClient.readContract({
        address: addresses.stakingToken as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setBalance(formatEther(result as bigint));
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
    }
  }, [publicClient, address, addresses]);

  // 🔹 Fetch token metadata (symbol, decimals)
  const fetchTokenInfo = useCallback(async () => {
    if (!publicClient || !addresses?.stakingToken) return;
    try {
      const [symbol, decimals] = await Promise.all([
        publicClient.readContract({
          address: addresses.stakingToken as `0x${string}`,
          abi: TOKEN_ABI,
          functionName: "symbol",
        }),
        publicClient.readContract({
          address: addresses.stakingToken as `0x${string}`,
          abi: TOKEN_ABI,
          functionName: "decimals",
        }),
      ]);
      setSymbol(symbol as string);
      setDecimals(Number(decimals));
    } catch (error) {
      console.error("❌ Error fetching token info:", error);
    }
  }, [publicClient, addresses]);

  // 🔹 Approve spender
  const approve = useCallback(
    async (spender: `0x${string}`, amount: string) => {
      if (!walletClient || !addresses?.stakingToken) return;
      setIsLoading(true);
      try {
        const tx = await walletClient.writeContract({
          address: addresses.stakingToken as `0x${string}`,
          abi: TOKEN_ABI,
          functionName: "approve",
          args: [spender, parseEther(amount)],
        });
        console.log("✅ Approve TX:", tx);
        return tx;
      } catch (error) {
        console.error("❌ Approve error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [walletClient, addresses]
  );

  // 🔹 Transfer tokens
  const transfer = useCallback(
    async (to: `0x${string}`, amount: string) => {
      if (!walletClient || !addresses?.stakingToken) return;
      setIsLoading(true);
      try {
        const tx = await walletClient.writeContract({
          address: addresses.stakingToken as `0x${string}`,
          abi: TOKEN_ABI,
          functionName: "transfer",
          args: [to, parseEther(amount)],
        });
        console.log("✅ Transfer TX:", tx);
        return tx;
      } catch (error) {
        console.error("❌ Transfer error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [walletClient, addresses]
  );

  // 🔹 Mint tokens (if allowed)
  const mint = useCallback(async () => {
    if (!walletClient || !addresses?.stakingToken) return;
    setIsLoading(true);
    try {
      const tx = await walletClient.writeContract({
        address: addresses.stakingToken as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: "mint",
      });
      console.log("✅ Mint TX:", tx);
      return tx;
    } catch (error) {
      console.error("❌ Mint error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, addresses]);

  // 🔹 Lifecycle: auto-fetch token info & balance
  useEffect(() => {
    if (isConnected && address && chainId) {
      fetchBalance();
      fetchTokenInfo();
    }
  }, [isConnected, address, chainId, fetchBalance, fetchTokenInfo]);

  return {
    address,
    chainId,
    balance,
    symbol,
    decimals,
    isLoading,
    fetchBalance,
    approve,
    transfer,
    mint,
  };
}
