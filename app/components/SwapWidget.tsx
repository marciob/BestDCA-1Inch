//app/components/SwapWidget.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoMdSettings } from "react-icons/io";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { parseEther } from "viem";
import { formatDistance } from "date-fns";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SettingsModal from "./SettingsModal";
import Action from "./Action";
import Receive from "./Receive";
import ChainSelector from "./ChainSelector";
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "@/lib/constants";
import { useHasMounted } from "@/app/hooks/useHasMounted";
import toast from "react-hot-toast";

const BitcoinIcon = () => (
  <Image
    src="/btc_logo.png"
    alt="Bitcoin logo"
    width={20}
    height={20}
    className="rounded-full"
  />
);

export default function SwapWidget() {
  const [activeTab, setActiveTab] = useState<"dca" | "settle">("dca");
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const [amount, setAmount] = useState("0.01"); // Default to 0.01 ETH
  const [duration, setDuration] = useState<number | string>(7); // Default to 7 days
  const [unit, setUnit] = useState<"Days" | "Weeks" | "Months">("Days");

  const { isConnected } = useAccount();
  const { writeContract } = useWriteContract();
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
    query: { enabled: !!txHash },
  });

  // Handle transaction success/error with useEffect
  useEffect(() => {
    if (isSuccess && txHash) {
      toast.dismiss(); // close the spinner
      toast.success(
        <span>
          Deposit <b>confirmed</b>&nbsp;—&nbsp;
          <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            className="underline"
          >
            view&nbsp;on&nbsp;explorer
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

  /* -------------------------- send tx --------------------------- */

  const handleDepositAndDCA = () => {
    toast.loading("Waiting for wallet…");
    writeContract(
      {
        address: VAULT_CONTRACT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "deposit",
        value: parseEther(amount),
      },
      {
        onSuccess(hash) {
          toast.dismiss();
          // show spinner w/ elapsed time & explorer link
          toast(
            (t) => (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span>
                  Mining&nbsp;(
                  {formatDistance(sentAt ?? new Date(), new Date(), {
                    includeSeconds: true,
                  })}
                  ) —&nbsp;
                  <a
                    href={`https://sepolia.basescan.org/tx/${hash}`}
                    target="_blank"
                    className="underline"
                  >
                    explorer
                  </a>
                </span>
              </div>
            ),
            { id: "txSpinner", duration: Infinity } // keep until we dismiss
          );
          setSentAt(new Date());
          setTxHash(hash);
        },
        onError(err: Error) {
          toast.dismiss();
          toast.error(err.message);
        },
      }
    );
  };

  const TabButton = ({
    tabName,
    label,
  }: {
    tabName: "dca" | "settle";
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`w-full rounded-t-lg py-2.5 text-center font-semibold transition-colors ${
        activeTab === tabName
          ? "bg-gray-900/50 text-white"
          : "bg-transparent text-gray-400 hover:bg-gray-800/50"
      }`}
    >
      {label}
    </button>
  );

  if (!mounted) return null;

  return (
    <>
      <div className="w-full max-w-md">
        <div className="flex">
          <TabButton tabName="dca" label="DCA" />
          <TabButton tabName="settle" label="Settle" />
        </div>

        <div className="flex h-[480px] flex-col rounded-b-2xl rounded-tr-2xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-md">
          <div className="flex-grow">
            {activeTab === "dca" && (
              <>
                <div className="mb-4 flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-white">Setup DCA</h2>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <IoMdSettings className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <Action
                    amount={amount}
                    setAmount={setAmount}
                    duration={duration}
                    setDuration={setDuration}
                    unit={unit}
                    setUnit={setUnit}
                  />
                  <Receive amount={amount} duration={duration} unit={unit} />
                </div>
              </>
            )}

            {activeTab === "settle" && (
              <>
                <div className="mb-4 flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-white">Settle WBTC</h2>
                  <div className="h-5 w-5"></div>
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl bg-gray-800 p-4">
                    <div className="text-sm font-medium text-gray-400">
                      From Base
                    </div>
                    <div className="mt-2 text-3xl font-bold text-white">
                      0.0145 WBTC
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-800 p-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      To Prize Chain
                    </label>
                    <div className="flex items-center justify-between rounded-lg bg-gray-900 p-1">
                      <input
                        id="dest_address"
                        name="dest_address"
                        type="text"
                        placeholder="Enter address..."
                        className="w-full bg-transparent p-2 text-base font-medium text-white placeholder-gray-500 focus:outline-none"
                      />
                      <ChainSelector
                        chainName="Bitcoin"
                        icon={<BitcoinIcon />}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4">
            {!isConnected ? (
              <div className="w-full rounded-xl bg-blue-600 py-4 text-xl font-semibold text-white text-center hover:bg-blue-700">
                <ConnectButton.Custom>
                  {({ openConnectModal, mounted }) => (
                    <button
                      onClick={openConnectModal}
                      disabled={!mounted}
                      className="w-full"
                    >
                      Connect Wallet
                    </button>
                  )}
                </ConnectButton.Custom>
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
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
