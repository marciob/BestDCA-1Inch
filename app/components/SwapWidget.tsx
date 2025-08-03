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
      setTxHash(undefined);
      setSentAt(null);
    }
  }, [isSuccess, txHash]);

  useEffect(() => {
    if (isError && error) {
      toast.dismiss();
      toast.error(error.message);
      setTxHash(undefined);
      setSentAt(null);
    }
  }, [isError, error]);

  /* ----------------------------------------------------------------
   *               send “deposit()” transaction
   * ---------------------------------------------------------------- */
  const handleDepositAndDCA = () => {
    toast.loading("Waiting for wallet …");
    deposit(parseEther(amount))
      .then((hash) => {
        toast.dismiss();
        toast(
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
            Mining&nbsp;(
            {formatDistance(new Date(), new Date(), { includeSeconds: true })})
            —&nbsp;
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
        setSentAt(new Date());
        setTxHash(hash);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err.message);
      });
  };

  /* ---------------------------------------------------------------- */

  if (!mounted) return null;

  const balanceEth =
    balanceRaw !== undefined ? Number(balanceRaw) / 1e18 : undefined;

  return (
    <>
      <div className="w-full max-w-md">
        {/* tabs */}
        <div className="flex">
          {(["dca", "settle"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`w-full rounded-t-lg py-2.5 text-center font-semibold transition-colors ${
                activeTab === t
                  ? "bg-gray-900/50 text-white"
                  : "bg-transparent text-gray-400 hover:bg-gray-800/50"
              }`}
            >
              {t === "dca" ? "DCA" : "Settle"}
            </button>
          ))}
        </div>

        {/* widget body */}
        <div
          className="flex h-[480px] flex-col rounded-b-2xl rounded-tr-2xl
                        border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-md"
        >
          <div className="flex-grow">
            {activeTab === "dca" ? (
              <>
                {/* header row */}
                <div className="mb-4 flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-white">Setup DCA</h2>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <IoMdSettings className="h-5 w-5" />
                  </button>
                </div>

                {/* action panels */}
                <div className="space-y-2">
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
                    params={params as any} // safe – undefined → Receive falls back
                  />
                </div>
              </>
            ) : (
              /* settle tab (still stub) */
              <div className="mt-4 text-center text-gray-400">
                Settle tab coming soon…
              </div>
            )}
          </div>

          {/* bottom CTA */}
          <div className="mt-4">
            {!isConnected ? (
              <div className="w-full rounded-xl bg-blue-600 py-4 text-center text-xl font-semibold text-white hover:bg-blue-700">
                <ConnectButton />
              </div>
            ) : (
              <button
                onClick={handleDepositAndDCA}
                disabled={!amount || isMining || !!txHash}
                className={`w-full rounded-xl py-4 text-xl font-semibold text-white
                  ${
                    isMining
                      ? "bg-gray-600 animate-pulse"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                  disabled:cursor-not-allowed`}
              >
                {isMining ? "Depositing…" : `Deposit ${amount || "0"} ETH`}
              </button>
            )}
          </div>

          {/* cancel/withdraw controls - only show on DCA tab */}
          {activeTab === "dca" && <CancelButton />}
        </div>

        {/* tiny balance readout – optional */}
        {balanceEth !== undefined && (
          <p className="mt-2 text-center text-sm text-gray-400">
            In Vault: {balanceEth.toFixed(4)} ETH
          </p>
        )}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
