"use client";

import { useCallback } from "react";
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useChainId 
} from "wagmi";
// import { parseAbi } from "viem";

import { BRIDGE_ABI } from "@/lib/bridgeAbi";

export const useBridgeContract = (contractAddress: `0x${string}`) => {
  const chainId = useChainId();
  const { address: user } = useAccount();

  const abi = BRIDGE_ABI;

  const { 
    writeContractAsync, 
    isPending 
  } = useWriteContract();

  // -----------------------------------------
  // 🔹 READ HELPERS
  // -----------------------------------------

  const owner = useReadContract({
    abi,
    address: contractAddress,
    functionName: "owner",
  });

  const relayer = useReadContract({
    abi,
    address: contractAddress,
    functionName: "relayer",
  });

  const tokenAddress = useReadContract({
    abi,
    address: contractAddress,
    functionName: "tokenAddress",
  });

  const lockNonce = useReadContract({
    abi,
    address: contractAddress,
    functionName: "lockNonce",
  });

  const tokenIsMintable = useReadContract({
    abi,
    address: contractAddress,
    functionName: "tokenIsMintable",
  });

  // -----------------------------------------
  // 🔹 WRITE HELPERS
  // -----------------------------------------

  const lockTokens = useCallback(
    async (amount: bigint, targetChainId: bigint, targetRecipient: `0x${string}`) => {
      return writeContractAsync({
        abi,
        address: contractAddress,
        functionName: "lockTokens",
        args: [amount, targetChainId, targetRecipient],
      });
    },
    [contractAddress, writeContractAsync, abi]
  );

  const unlockTokens = useCallback(
    async (
      recipient: `0x${string}`,
      amount: bigint,
      sourceChainId: bigint,
      sourceTxHash: `0x${string}`,
      nonce: bigint,
      signature: `0x${string}`
    ) => {
      return writeContractAsync({
        abi,
        address: contractAddress,
        functionName: "unlockTokens",
        args: [recipient, amount, sourceChainId, sourceTxHash, nonce, signature],
      });
    },
    [contractAddress, writeContractAsync, abi]
  );

  const updateRelayer = useCallback(
    async (newRelayer: `0x${string}`) => {
      return writeContractAsync({
        abi,
        address: contractAddress,
        functionName: "updateRelayer",
        args: [newRelayer],
      });
    },
    [contractAddress, writeContractAsync, abi]
  );

  const updateTokenAddress = useCallback(
    async (newToken: `0x${string}`) => {
      return writeContractAsync({
        abi,
        address: contractAddress,
        functionName: "updateTokenAddress",
        args: [newToken],
      });
    },
    [contractAddress, writeContractAsync, abi]
  );

  const setTokenIsMintable = useCallback(
    async (flag: boolean) => {
      return writeContractAsync({
        abi,
        address: contractAddress,
        functionName: "setTokenIsMintable",
        args: [flag],
      });
    },
    [contractAddress, writeContractAsync, abi]
  );

  const transferOwnership = useCallback(
    async (newOwner: `0x${string}`) => {
      return writeContractAsync({
        abi,
        address: contractAddress,
        functionName: "transferOwnership",
        args: [newOwner],
      });
    },
    [contractAddress, writeContractAsync, abi]
  );

  return {
    // READ values
    owner,
    relayer,
    tokenAddress,
    tokenIsMintable,
    lockNonce,
    chainId,

    // WRITE actions
    lockTokens,
    unlockTokens,
    updateRelayer,
    updateTokenAddress,
    setTokenIsMintable,
    transferOwnership,

    // Status
    isPending,
    user,
  };
};
