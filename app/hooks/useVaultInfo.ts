// app/hooks/useVaultInfo.ts
"use client";

import { useAccount, useReadContracts } from "wagmi";
import { formatEther, type Address } from "viem"; // <– Address type comes from viem
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "@/lib/constants";

type DcaParams = {
  sliceSize: bigint;
  startTime: bigint;
  deltaTime: bigint;
  totalAmount: bigint;
};

export function useVaultInfo() {
  const { address } = useAccount();

  /* 🗒️ contracts array is memo-safe – no need for useMemo */
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: VAULT_CONTRACT_ADDRESS as Address,
        abi: VAULT_ABI,
        functionName: "vaultBalanceOf",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        address: VAULT_CONTRACT_ADDRESS as Address,
        abi: VAULT_ABI,
        functionName: "dcaParamsOf",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
      },
    ],
    /*  🔄 poll every 10 s instead of the removed `watch` flag  */
    query: {
      refetchInterval: 10_000,
      enabled: !!address, // don’t hit the RPC if wallet not connected
    },
  });

  /* ---------- defensive parsing ---------- */
  const balanceRaw = data?.[0]?.result as bigint | undefined;
  const paramsRaw = data?.[1]?.result as DcaParams | undefined;

  return {
    balance: balanceRaw ? formatEther(balanceRaw) : null,
    params: paramsRaw,
    isLoading,
    error,
  };
}
