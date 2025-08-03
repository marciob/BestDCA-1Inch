"use client";

import { useState } from "react";
import Image from "next/image";
import { IoMdSettings } from "react-icons/io";
import SettingsModal from "./SettingsModal";
import Action from "./Action";
import Receive from "./Receive";
import ChainSelector from "./ChainSelector";

// A small component for the Bitcoin logo
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

  // Dynamically set the CTA text and color based on the active tab
  const ctaText =
    activeTab === "dca" ? "Connect Wallet" : "Get Settlement Quote";
  const ctaColor =
    activeTab === "dca"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-purple-600 hover:bg-purple-700";

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
        {/* Tab Navigation */}
        <div className="flex">
          <TabButton tabName="dca" label="DCA" />
          <TabButton tabName="settle" label="Settle" />
        </div>

        {/* Main Content Area */}
        <div className="flex h-[480px] flex-col rounded-b-2xl rounded-tr-2xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-md">
          {/* This new wrapper will grow to fill the available space, pushing the CTA button down */}
          <div className="flex-grow">
            {/* DCA View */}
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
                  <Action />
                  <Receive />
                </div>
              </>
            )}

            {/* --- SETTLE VIEW (UPDATED FOR BETTER HORIZONTAL LAYOUT) --- */}
            {activeTab === "settle" && (
              <>
                <div className="mb-4 flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-white">Settle WBTC</h2>
                  <div className="h-5 w-5"></div>
                </div>
                <div className="space-y-2">
                  {/* "From" block */}
                  <div className="rounded-xl bg-gray-800 p-4">
                    <div className="text-sm font-medium text-gray-400">
                      From Polygon
                    </div>
                    <div className="mt-2 text-3xl font-bold text-white">
                      0.0145 WBTC
                    </div>
                  </div>

                  {/* "To" block */}
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

          {/* UNIFIED CTA BUTTON - Stays at the bottom due to flexbox */}
          <div className="mt-4">
            <button
              className={`w-full rounded-xl py-4 text-xl font-semibold text-white transition-colors ${ctaColor}`}
            >
              {ctaText}
            </button>
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
