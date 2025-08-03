"use client";

import { useState } from "react";
import Image from "next/image";
import { IoMdSettings } from "react-icons/io";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import SettingsModal from "./SettingsModal";
import Action from "./Action";
import Receive from "./Receive";
import ChainSelector from "./ChainSelector";
import { VAULT_ABI, VAULT_CONTRACT_ADDRESS } from "../../constants";

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

  // State for the DCA form, managed here
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState<number | string>(30);
  const [unit, setUnit] = useState<"Days" | "Weeks" | "Months">("Days");

  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const handleStartDCA = () => {
    // This is where you will call your Orchestrator in the future to get a real hash.
    // For now, we use a placeholder hash to test the contract call.
    const placeholderOrderHash =
      "0x0000000000000000000000000000000000000000000000000000000000000001";

    // Convert duration to seconds
    let durationInSeconds = Number(duration) * 24 * 60 * 60; // Days
    if (unit === "Weeks") durationInSeconds *= 7;
    if (unit === "Months") durationInSeconds *= 30; // Approximation

    // This is a placeholder for your logic to calculate slice size based on total amount and duration
    const sliceSize = parseUnits("10", 6); // Placeholder: 10 USDC (6 decimals)
    const deltaTime = 15 * 60; // 15 minutes

    // Call the smart contract
    writeContract({
      address: VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "startDCA",
      args: [
        placeholderOrderHash,
        BigInt(durationInSeconds),
        sliceSize,
        BigInt(deltaTime),
      ],
    });
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
                  <Receive />
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
                onClick={activeTab === "dca" ? handleStartDCA : () => {}}
                disabled={isPending}
                className={`w-full rounded-xl py-4 text-xl font-semibold text-white transition-colors ${
                  activeTab === "dca"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } disabled:bg-gray-600 disabled:cursor-not-allowed`}
              >
                {isPending
                  ? "Confirming..."
                  : activeTab === "dca"
                  ? "Start Accumulating"
                  : "Get Settlement Quote"}
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
