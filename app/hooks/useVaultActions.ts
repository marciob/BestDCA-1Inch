// app/hooks/useVaultActions.ts
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useWriteContract } from "wagmi";
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "@/lib/constants";

export function useVaultActions() {
  const queryClient = useQueryClient();

  // wagmi v2: gives you writeContractAsync + status flags
  const {
    writeContractAsync,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
    data: txHash,
  } = useWriteContract();

  /* ────────────── helpers ────────────── */

  /** Payable `deposit()` — send ETH as `value`, no args */
  async function deposit(value: bigint): Promise<`0x${string}`> {
    try {
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "deposit",
        value,
      });
      queryClient.invalidateQueries({ queryKey: ["vaultInfo"] });
      return hash;
    } catch (err) {
      console.error("deposit failed", err);
      throw err;
    }
  }

  /** `startDca(sliceSize,startTime,deltaTime,totalAmount)` */
  async function createOrder(
    sliceSize: bigint,
    startTime: bigint,
    deltaTime: bigint,
    totalAmount: bigint
  ): Promise<`0x${string}`> {
    try {
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "startDca",
        args: [sliceSize, startTime, deltaTime, totalAmount],
      });
      queryClient.invalidateQueries({ queryKey: ["vaultInfo"] });
      return hash;
    } catch (err) {
      console.error("startDca failed", err);
      throw err;
    }
  }

  /** `cancelOrder(orderHash)` */
  async function cancelOrder(orderHash: `0x${string}`): Promise<`0x${string}`> {
    try {
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "cancelOrder",
        args: [orderHash],
      });
      queryClient.invalidateQueries({ queryKey: ["vaultInfo"] });
      return hash;
    } catch (err) {
      console.error("cancelOrder failed", err);
      throw err;
    }
  }

  /** `withdraw(orderHash)` */
  async function withdraw(orderHash: `0x${string}`): Promise<`0x${string}`> {
    try {
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [orderHash],
      });
      queryClient.invalidateQueries({ queryKey: ["vaultInfo"] });
      return hash;
    } catch (err) {
      console.error("withdraw failed", err);
      throw err;
    }
  }

  return {
    deposit, // (value: bigint) => Promise<`0x${string}`>
    createOrder, // (...args) => Promise<`0x${string}`>
    cancelOrder, // (orderHash) => Promise<`0x${string}`>
    withdraw, // (orderHash) => Promise<`0x${string}`>
    txState: { isPending, isSuccess, isError, error, txHash, reset },
  };
}
