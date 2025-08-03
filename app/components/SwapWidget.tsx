// app/components/SwapWidget.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
import ChainSelector from "./ChainSelector";
import CancelButton from "./CancelButton";
import { useHasMounted } from "@/app/hooks/useHasMounted";
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "@/lib/constants";
import { useVaultActions } from "@/app/hooks/useVaultActions";

/* ------------------------------------------------------------------ */
/*                tiny util + static asset helper                     */
/* ------------------------------------------------------------------ */

const BitcoinIcon = () => (
  <Image
    src="/btc_logo.png"
    alt="Bitcoin logo"
    width={20}
    height={20}
    className="rounded-full"
  />
);

const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

/* ------------------------------------------------------------------ */

export default function SwapWidget() {
  /* ─── user setup state ─────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<"dca" | "settle">("dca");
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const [amount, setAmount] = useState("0.01"); // 0.01 ETH default
  const [duration, setDuration] = useState<number | string>(7); // 7 days
  const [unit, setUnit] = useState<"Days" | "Weeks" | "Months">("Days");

  /* ─── wallet + tx helpers ──────────────────────────────────────── */
  const { address, isConnected } = useAccount();
  const { deposit, createOrder /*, cancelOrder, withdraw*/ } =
    useVaultActions();

  const mounted = useHasMounted();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [sentAt, setSentAt] = useState<Date | null>(null);

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

  /* ─── live Vault reads (balance → currentOrder → params) ───────── */

  // 1️⃣ User’s balance in vault
  const { data: balanceRaw } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "vaultBalanceOf",
    args: [address ?? zeroAddress],
    query: { enabled: !!address, refetchInterval: 10_000 },
  });

  // 2️⃣ What order (hash) is active right now?
  const { data: currentHash } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "currentOrder",
    query: { refetchInterval: 10_000 },
  });

  // 3️⃣ Params for that order (when there is one)
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

  /* ----------------------------------------------------------------
   *               Helper function to create DCA order
   * ---------------------------------------------------------------- */
  const createDCAOrder = useCallback(async () => {
    try {
      toast.loading("Creating DCA order…", { id: "createOrder" });

      // Calculate DCA parameters from user input
      const totalAmountWei = parseEther(amount);
      const sliceCount = BigInt(10); // Split into 10 slices
      const sliceSize = totalAmountWei / sliceCount;

      // Convert duration to seconds
      const durationNum = Number(duration);
      const multiplier = unit === "Weeks" ? 7 : unit === "Months" ? 30 : 1;
      const totalDays = durationNum * multiplier;
      const deltaTimeSeconds = BigInt(
        Math.floor((totalDays * 24 * 60 * 60) / Number(sliceCount))
      );

      // Start in 1 minute
      const startTime = BigInt(Math.floor(Date.now() / 1000) + 60);

      const orderHash = await createOrder(
        sliceSize,
        startTime,
        deltaTimeSeconds,
        totalAmountWei
      );

      toast.dismiss("createOrder");
      toast.success(
        <span>
          DCA order <b>created</b> —&nbsp;
          <a
            href={`https://sepolia.basescan.org/tx/${orderHash}`}
            target="_blank"
            className="underline"
          >
            explorer
          </a>
        </span>
      );
    } catch (err: any) {
      toast.dismiss("createOrder");
      toast.error(`Failed to create DCA order: ${err.message}`);
    }
  }, [amount, duration, unit, createOrder]);

  /* ----------------------------------------------------------------
   *               side-effects: toast notifications
   * ---------------------------------------------------------------- */
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

      // Step 2: Create DCA order after deposit confirms
      createDCAOrder();

      setTxHash(undefined);
      setSentAt(null);
    }
  }, [isSuccess, txHash, createDCAOrder]);

  useEffect(() => {
    if (isError && error) {
      toast.dismiss();
      toast.error(error.message);
      setTxHash(undefined);
      setSentAt(null);
    }
  }, [isError, error]);

  /* ----------------------------------------------------------------
   *               send "deposit()" + "createOrder()" transactions
   * ---------------------------------------------------------------- */
  const handleDepositAndDCA = async () => {
    toast.loading("Waiting for wallet …");

    try {
      // Step 1: Deposit ETH to vault
      const depositHash = await deposit(parseEther(amount));

      toast.dismiss();
      toast(
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
          Depositing ETH…&nbsp;
          <a
            href={`https://sepolia.basescan.org/tx/${depositHash}`}
            target="_blank"
            className="underline"
          >
            explorer
          </a>
        </div>,
        { id: "txSpinner", duration: Infinity }
      );
      setSentAt(new Date());
      setTxHash(depositHash);

      // Note: DCA order creation will happen after deposit confirms
      // This is handled by the useEffect for transaction success
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  /* ---------------------------------------------------------------- */

  if (!mounted) return null;

  const balanceEth =
    balanceRaw !== undefined ? Number(balanceRaw) / 1e18 : undefined;

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        {/* Modern Card with Better Spacing */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Tabs */}
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

          {/* Widget Body */}
          <div className="p-6">
            {activeTab === "dca" ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Setup DCA</h2>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <IoMdSettings className="h-5 w-5" />
                  </button>
                </div>

                {/* Vault Balance - Moved to top for better visibility */}
                {balanceEth !== undefined && (
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/20">
                    <div className="text-sm text-gray-400 mb-1">
                      Current Balance
                    </div>
                    <div className="text-xl font-bold text-white">
                      {balanceEth.toFixed(4)} ETH
                      <span className="text-sm text-gray-400 ml-2">
                        in Vault
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Panels */}
                <div className="space-y-4">
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
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isConnected ? (
                    <div className="w-full">
                      <ConnectButton />
                    </div>
                  ) : (
                    <button
                      onClick={handleDepositAndDCA}
                      disabled={!amount || isMining || !!txHash}
                      className={`w-full rounded-xl py-4 text-lg font-semibold transition-all duration-200 ${
                        isMining
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                      }`}
                    >
                      {isMining ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                          Depositing…
                        </span>
                      ) : (
                        `Deposit ${amount || "0"} ETH`
                      )}
                    </button>
                  )}

                  {/* Cancel Button - Better integrated */}
                  {activeTab === "dca" && <CancelButton />}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-gray-400 text-lg">
                  Settle tab coming soon…
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  Advanced settlement features
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
