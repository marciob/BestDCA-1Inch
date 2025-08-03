"use client";

import { useState } from "react";
import Image from "next/image";
import ChainSelector from "./ChainSelector";
import SettingsModal from "./SettingsModal";

// Placeholder data - you'll replace this with dynamic data later
const fromChain = { name: "Arbitrum", logo: "/arbitrum-logo.png" };
const toChain = { name: "Base", logo: "/base-logo.png" };

export default function SwapWidget() {
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Start DCA</h2>
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        {/* You Pay Section */}
        <div className="mt-6 rounded-xl bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              className="w-full bg-transparent text-3xl font-bold text-white placeholder-gray-500 focus:outline-none"
              placeholder="0.0"
            />
            <ChainSelector
              chainName={fromChain.name}
              chainLogo={fromChain.logo}
            />
          </div>
          <div className="mt-2 flex items-center justify-end">
            <button className="flex items-center gap-2 rounded-full bg-black/20 p-2 text-lg font-medium text-white">
              <Image
                src="/usdc-logo.png"
                alt="USDC logo"
                width={24}
                height={24}
              />
              USDC
            </button>
          </div>
        </div>

        {/* Arrow Separator */}
        <div className="my-2 flex justify-center">
          <div className="rounded-full border-4 border-gray-900/50 bg-gray-800 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* You Receive Section */}
        <div className="rounded-xl bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              className="w-full cursor-default bg-transparent text-3xl font-bold text-gray-400 placeholder-gray-500 focus:outline-none"
              placeholder="0.0"
              readOnly
            />
            <ChainSelector chainName={toChain.name} chainLogo={toChain.logo} />
          </div>
          <div className="mt-2 flex items-center justify-end">
            <div className="flex items-center gap-2 rounded-full bg-black/20 p-2 text-lg font-medium text-white">
              <Image
                src="/wbtc-logo.png"
                alt="WBTC logo"
                width={24}
                height={24}
              />
              WBTC
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full rounded-xl bg-blue-600 py-4 text-xl font-semibold text-white hover:bg-blue-700">
            Connect Wallet
          </button>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
