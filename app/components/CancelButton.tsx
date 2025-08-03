// app/components/CancelButton.tsx
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useVaultActions } from "@/app/hooks/useVaultActions";
import { useVaultInfo } from "@/app/hooks/useVaultInfo";
import { useWaitForTransactionReceipt } from "wagmi";
import { baseSepolia } from "viem/chains";
import { useHtlc } from "@/app/hooks/useHtlc";

export default function CancelButton() {
  const { currentHash, hasActiveOrder } = useVaultInfo();
  const { cancelOrder, withdraw } = useVaultActions();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [step, setStep] = useState<"idle" | "cancelling" | "withdraw">("idle");
  const { locked, refundTime, canClaim } = useHtlc();

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
    <div className="space-y-3">
      {step === "withdraw" ? (
        <button
          onClick={handleWithdraw}
          disabled={!canClaim}
          className="w-full rounded-xl py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-200"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            {locked && !canClaim
              ? `Withdraw disabled – HTLC live until ${new Date(
                  refundTime * 1000
                ).toLocaleString()}`
              : "Withdraw Funds"}
          </span>
        </button>
      ) : (
        <button
          disabled={step === "cancelling"}
          onClick={handleCancel}
          className={`w-full rounded-xl py-4 text-lg font-semibold transition-all duration-200 ${
            step === "cancelling"
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/25"
          }`}
        >
          {step === "cancelling" ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              Cancelling…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel DCA
            </span>
          )}
        </button>
      )}
    </div>
  );
}
