"use client";

import { useState } from "react";
import Image from "next/image"; // <-- ADD THIS IMPORT
import SettingsModal from "./SettingsModal";
import Action from "./Action";
import Receive from "./Receive";
import ChainSelector from "./ChainSelector";

// A small SVG icon for the "Bitcoin" option
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

  const TabButton = ({
    tabName,
    label,
  }: {
    tabName: "dca" | "settle";
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`w-full rounded-t-lg py-2.5 text-center font-semibold ${
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
        <div className="rounded-b-2xl rounded-tr-2xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-md">
          {/* DCA View */}
          {activeTab === "dca" && (
            <div>
              <div className="mb-4 flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-white">Setup DCA</h2>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  {/* Settings Icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                <Action />
                <Receive />
              </div>
              <div className="mt-4">
                <button className="w-full rounded-xl bg-blue-600 py-4 text-xl font-semibold text-white hover:bg-blue-700">
                  Connect Wallet
                </button>
              </div>
            </div>
          )}

          {/* Settle View */}
          {activeTab === "settle" && (
            <div>
              <div className="mb-4 flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-white">Settle WBTC</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-gray-800 p-4 text-center">
                  <p className="text-sm text-gray-400">Accumulated Balance</p>
                  <p className="text-2xl font-bold text-white">0.0145 WBTC</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Settle to Prize Chain
                  </label>
                  <div className="mt-2">
                    <ChainSelector chainName="Bitcoin" icon={<BitcoinIcon />} />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="dest_address"
                    className="text-sm font-medium text-gray-400"
                  >
                    Destination Bitcoin Address
                  </label>
                  <input
                    id="dest_address"
                    name="dest_address"
                    type="text"
                    placeholder="bc1q..."
                    className="mt-2"
                  />
                </div>
                <button className="w-full rounded-xl bg-purple-600 py-4 text-xl font-semibold text-white hover:bg-purple-700">
                  Get Settlement Quote
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
