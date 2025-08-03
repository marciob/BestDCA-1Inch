// app/hooks/useVaultInfo.ts
"use client";

import { useAccount } from "wagmi";
import { formatEther, type Address } from "viem";
import { useReadContract } from "wagmi";
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "@/lib/constants";

type DcaParams = {
  sliceSize: bigint;
  startTime: bigint;
  deltaTime: bigint;
  totalAmount: bigint;
};

export function useVaultInfo() {
  const { address } = useAccount();
  const zeroAddr = "0x0000000000000000000000000000000000000000" as Address;
  const zeroHash =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  // 1️⃣ Read vaultBalanceOf(address)
  const { data: balanceRaw, isLoading: loadingBalance } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS as Address,
    abi: VAULT_ABI,
    functionName: "vaultBalanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10_000,
    },
  });

  // 2️⃣ Read currentOrder()
  const { data: currentHash, isLoading: loadingHash } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS as Address,
    abi: VAULT_ABI,
    functionName: "currentOrder",
    query: {
      refetchInterval: 10_000,
    },
  });

  // Determine if there's an active DCA
  const hasActiveOrder =
    typeof currentHash === "string" && currentHash !== zeroHash;

  // 3️⃣ Read dcaParamsOf(currentHash) only if active
  const { data: paramsRaw, isLoading: loadingParams } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS as Address,
    abi: VAULT_ABI,
    functionName: "dcaParamsOf",
    args: hasActiveOrder ? [currentHash as `0x${string}`] : undefined,
    query: {
      enabled: hasActiveOrder,
      refetchInterval: 10_000,
    },
  });

  return {
    /** User’s WETH balance in the vault (as a decimal string) */
    balance: balanceRaw ? formatEther(balanceRaw as bigint) : null,
    /** The current DCA order hash, if any */
    currentHash: currentHash as `0x${string}` | undefined,
    /** On‐chain parameters for the active DCA */
    params: paramsRaw as DcaParams | undefined,
    /** True if there is a non‐zero active DCA order */
    hasActiveOrder,
    /** True if any of the reads are still loading */
    isLoading: loadingBalance || loadingHash || loadingParams,
  };
}
