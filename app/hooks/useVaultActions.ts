// app/hooks/useVaultActions.ts
/* eslint-disable @typescript-eslint/consistent-type-imports */
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useWriteContract } from "wagmi";
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "@/lib/constants";

/**
 * Hook that exposes the **only** on-chain actions the UI needs:
 *   • deposit()     – fund the vault with WETH/ETH
 *   • cancelOrder() – ask the vault to cancel the current DCA
 *   • withdraw()    – withdraw finished / cancelled funds
 *
 * All `startDCA` logic now lives in the off-chain orchestrator,
 * which listens for `Deposited` events, builds the limit-order,
 * obtains the `orderHash`, and then calls `vault.startDCA(...)`.
 */
export function useVaultActions() {
  const queryClient = useQueryClient();
  const {
    writeContractAsync,
    // status flags (useful for a “Tx spinner” etc.)
    isPending,
    isSuccess,
    isError,
    error,
    reset,
    data: txHash,
  } = useWriteContract();

  /* ───────── helpers ───────── */

  /** Payable `deposit()` – send ETH/WETH as `value`, no args. */
  async function deposit(value: bigint): Promise<`0x${string}`> {
    const hash = await writeContractAsync({
      address: VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "deposit",
      value,
    });
    queryClient.invalidateQueries({ queryKey: ["vaultInfo", "htlc"] });

    return hash;
  }

  /** `cancelOrder(bytes32 orderHash)` – user-triggered cancel. */
  async function cancelOrder(orderHash: `0x${string}`): Promise<`0x${string}`> {
    const hash = await writeContractAsync({
      address: VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "cancelOrder",
      args: [orderHash],
    });
    queryClient.invalidateQueries({ queryKey: ["vaultInfo", "htlc"] });

    return hash;
  }

  /** `withdraw(uint256 amount)` – user pulls funds back. */
  async function withdraw(orderHash: `0x${string}`): Promise<`0x${string}`> {
    const hash = await writeContractAsync({
      address: VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "withdraw",
      args: [orderHash],
    });
    queryClient.invalidateQueries({ queryKey: ["vaultInfo", "htlc"] });
    return hash;
  }

  return {
    /* exposed actions */
    deposit,
    cancelOrder,
    withdraw,

    /* tx state helpers for UI */
    txState: { isPending, isSuccess, isError, error, txHash, reset },
  };
}
