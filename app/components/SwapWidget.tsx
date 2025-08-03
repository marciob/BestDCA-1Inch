// app/components/SwapWidget.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoMdSettings } from "react-icons/io";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { baseSepolia } from "viem/chains";
import { parseEther, zeroAddress } from "viem";
import { formatDistance } from "date-fns";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import toast from "react-hot-toast";

import SettingsModal from "./SettingsModal";
import Action from "./Action";
import Receive from "./Receive";
import CancelButton from "./CancelButton";
import { useHasMounted } from "@/app/hooks/useHasMounted";
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "@/lib/constants";
import { useVaultActions } from "@/app/hooks/useVaultActions";

const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

export default function SwapWidget() {
  /* ── user UI state ─────────────────────────────── */
  const [activeTab, setActiveTab] = useState<"dca" | "settle">("dca");
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const [amount, setAmount] = useState("0.01");
  const [duration, setDuration] = useState<number | string>(7);
  const [unit, setUnit] = useState<"Days" | "Weeks" | "Months">("Days");

  /* ── wallet + contract helpers ─────────────────── */
  const { address, isConnected } = useAccount();
  const { deposit } = useVaultActions();
  const mounted = useHasMounted();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const {
    isLoading: isMining,
    isSuccess,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
    chainId: baseSepolia.id,
  });

  /* ── live reads from the vault ─────────────────── */
  const { data: balanceRaw } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "vaultBalanceOf",
    args: [address ?? zeroAddress],
    query: { enabled: !!address, refetchInterval: 10_000 },
  });

  const { data: currentHash } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "currentOrder",
    query: { refetchInterval: 10_000 },
  });

  const { data: params } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "dcaParamsOf",
    args: [currentHash ?? ZERO_HASH],
    query: {
      enabled: !!currentHash && currentHash !== ZERO_HASH,
      refetchInterval: 10_000,
    },
  });

  /* ── tx-status side-effects ────────────────────── */
  useEffect(() => {
    if (isSuccess && txHash) {
      toast.dismiss();
      toast.success(
        <span>
          Deposit <b>confirmed</b> —&nbsp;
          <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            className="underline"
          >
            explorer
          </a>
        </span>
      );
      // orchestrator will now → startDCA for us
      setTxHash(undefined);
    }
  }, [isSuccess, txHash]);

  useEffect(() => {
    if (isError && error) {
      toast.dismiss();
      toast.error(error.message);
      setTxHash(undefined);
    }
  }, [isError, error]);

  /* ── primary CTA ───────────────────────────────── */
  async function handleDeposit() {
    toast.loading("Waiting for wallet …");
    try {
      const hash = await deposit(parseEther(amount));
      toast.dismiss();
      toast(
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
          Depositing ETH…&nbsp;
          <a
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            className="underline"
          >
            explorer
          </a>
        </div>,
        { id: "txSpinner", duration: Infinity }
      );
      setTxHash(hash);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    }
  }

  /* ── render ────────────────────────────────────── */
  if (!mounted) return null;
  const balanceEth =
    balanceRaw !== undefined ? Number(balanceRaw) / 1e18 : undefined;

  return (
    <>
      {/* --- card shell ------------------------------------------------ */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* tabs */}
          <div className="flex border-b border-white/10">
            {(["dca", "settle"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-4 text-center font-semibold transition-all duration-200 ${
                  activeTab === t
                    ? "bg-blue-500/20 text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {t === "dca" ? "DCA" : "Settle"}
              </button>
            ))}
          </div>

          {/* body */}
          <div className="p-6">
            {activeTab === "dca" ? (
              <>
                {/* setup panels */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Setup DCA</h2>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <IoMdSettings className="h-5 w-5" />
                  </button>
                </div>

                <Action
                  amount={amount}
                  setAmount={setAmount}
                  duration={duration}
                  setDuration={setDuration}
                  unit={unit}
                  setUnit={setUnit}
                />
                <Receive
                  amount={amount}
                  duration={duration}
                  unit={unit}
                  params={params as any}
                />

                {/* CTA */}
                <div className="mt-6 space-y-3">
                  {!isConnected ? (
                    <ConnectButton />
                  ) : (
                    <button
                      onClick={handleDeposit}
                      disabled={!amount || isMining || !!txHash}
                      className={`w-full rounded-xl py-4 text-lg font-semibold transition-all duration-200 ${
                        isMining
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                      }`}
                    >
                      {isMining ? "Depositing…" : `Deposit ${amount} ETH`}
                    </button>
                  )}

                  {/* cancel / withdraw */}
                  <CancelButton />
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-gray-400">
                Settle tab coming soon…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* settings modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      {/* optional vault balance under card */}
      {balanceEth !== undefined && (
        <p className="mt-2 text-center text-sm text-gray-400">
          In Vault: {balanceEth.toFixed(4)} ETH
        </p>
      )}
    </>
  );
}
