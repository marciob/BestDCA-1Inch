// app/hooks/useHtlc.ts
"use client";
import { useReadContract } from "wagmi";
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "@/lib/constants";

export function useHtlc() {
  const { data: lock } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "hashLock",
  });
  const { data: refund } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "refundTime",
  });

  const hashLock = lock as `0x${string}`;
  const refundTime = (refund as bigint | undefined) ?? 0n;

  const locked =
    hashLock !==
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const canClaim = !locked || Number(refundTime) < Date.now() / 1e3;

  return { locked, refundTime: Number(refundTime), canClaim };
}
