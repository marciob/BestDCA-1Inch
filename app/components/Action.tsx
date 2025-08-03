//app/components/Action.tsx
"use client";

import React from "react";
import ChainSelector from "./ChainSelector";
import Image from "next/image"; // Make sure Image is imported

type ActionProps = {
  amount: string;
  setAmount: (value: string) => void;
  duration: number | string;
  setDuration: React.Dispatch<React.SetStateAction<number | string>>;
  unit: "Days" | "Weeks" | "Months";
  setUnit: (value: "Days" | "Weeks" | "Months") => void;
};

export default function Action({
  amount,
  setAmount,
  duration,
  setDuration,
  unit,
  setUnit,
}: ActionProps) {
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value === "" ? "" : parseInt(e.target.value, 10));
  };

  const handleDecrement = () => {
    setDuration((prev) => (Number(prev) > 1 ? Number(prev) - 1 : 1));
  };

  const handleIncrement = () => {
    setDuration((prev) => Number(prev) + 1);
  };

  const UnitButton = ({ value }: { value: "Days" | "Weeks" | "Months" }) => (
    <button
      type="button"
      onClick={() => setUnit(value)}
      className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
        unit === value
          ? "bg-gray-600 text-white"
          : "bg-transparent text-gray-400 hover:bg-gray-700/50"
      }`}
    >
      {value}
    </button>
  );

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">DCA Setup</span>
        </div>
        <ChainSelector chainName="Base" chainLogo="/base_logo.png" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-3">
          Amount to DCA
        </label>
        <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-500 focus:outline-none"
            placeholder="0.001"
          />
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 text-white font-medium">
            <Image src="/eth_logo.png" alt="ETH logo" width={20} height={20} />
            <span>ETH</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">
          Duration
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <button
              type="button"
              onClick={handleDecrement}
              className="p-3 text-white hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="number"
              value={duration}
              onChange={handleDurationChange}
              className="w-16 bg-transparent py-3 text-center text-white focus:outline-none"
              min="1"
            />
            <button
              type="button"
              onClick={handleIncrement}
              className="p-3 text-white hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <UnitButton value="Days" />
            <UnitButton value="Weeks" />
            <UnitButton value="Months" />
          </div>
        </div>
      </div>
    </div>
  );
}
