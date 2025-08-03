// app/components/CancelButton.tsx
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useVaultActions } from "@/app/hooks/useVaultActions";
import { useVaultInfo } from "@/app/hooks/useVaultInfo";
import { useWaitForTransactionReceipt } from "wagmi";
import { baseSepolia } from "viem/chains";

export default function CancelButton() {
  const { currentHash, hasActiveOrder } = useVaultInfo();
  const { cancelOrder, withdraw } = useVaultActions();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [step, setStep] = useState<"idle" | "cancelling" | "withdraw">("idle");

  // wait for the cancel-tx confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: baseSepolia.id,
    confirmations: 1,
  });

  // Handle success and error states with useEffect
  useEffect(() => {
    if (isConfirmed && txHash) {
      toast.dismiss("cancel");
      toast.success("Order cancelled ✅");
      setStep("withdraw");
      setTxHash(undefined);
    }
  }, [isConfirmed, txHash]);

  useEffect(() => {
    if (error && txHash) {
      toast.dismiss("cancel");
      toast.error(error.message);
      setStep("idle");
      setTxHash(undefined);
    }
  }, [error, txHash]);

  if (!hasActiveOrder) return null; // nothing to cancel

  async function handleCancel() {
    if (!currentHash) return;
    setStep("cancelling");
    toast.loading("Cancelling order…", { id: "cancel" });
    try {
      const h = await cancelOrder(currentHash);
      setTxHash(h); // start waiting
    } catch (e: any) {
      toast.dismiss("cancel");
      toast.error(e.message);
      setStep("idle");
    }
  }

  async function handleWithdraw() {
    if (!currentHash) return;
    setStep("idle");
    try {
      await withdraw(currentHash);
      toast.success("Funds withdrawn ✅");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {step === "withdraw" ? (
        <button
          onClick={handleWithdraw}
          className="w-full rounded-xl bg-green-600 py-3 text-lg font-semibold text-white hover:bg-green-700"
        >
          Withdraw Funds
        </button>
      ) : (
        <button
          disabled={step === "cancelling"}
          onClick={handleCancel}
          className={`w-full rounded-xl py-3 text-lg font-semibold text-white ${
            step === "cancelling"
              ? "bg-gray-600 animate-pulse"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {step === "cancelling" ? "Cancelling…" : "Cancel DCA"}
        </button>
      )}
    </div>
  );
}
