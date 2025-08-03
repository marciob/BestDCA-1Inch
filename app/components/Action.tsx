// app/components/Action.tsx
"use client";

import { useState } from "react";
import ChainSelector from "./ChainSelector";
import TokenSelector from "./TokenSelector";

export default function Action() {
  // State to manage the duration number and the selected unit
  const [duration, setDuration] = useState<number | string>(30);
  const [unit, setUnit] = useState<"Days" | "Weeks" | "Months">("Days");

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty input for user flexibility, but handle it as 0
    const value = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    setDuration(value);
  };

  // --- HANDLER FUNCTIONS FOR +/- BUTTONS ---
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
    <div className="rounded-xl bg-gray-800 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Action Selector */}
        <button className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white">
          <span>DCA</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* From Chain Selector */}
        <ChainSelector chainName="Polygon" chainLogo="/polygon_logo.png" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <input
          type="text"
          className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-500 focus:outline-none"
          placeholder="1,000"
        />
        <TokenSelector tokenName="USDC" tokenLogo="/usdc_logo.png" />
      </div>

      {/* --- UPDATED DURATION SECTION WITH +/- BUTTONS --- */}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Over a period of
        </label>
        <div className="flex items-center justify-between rounded-lg bg-gray-900 p-1">
          {/* Number Stepper Input */}
          <div className="flex flex-grow items-center">
            <button
              type="button"
              onClick={handleDecrement}
              className="px-3 py-2 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
            <input
              type="number"
              value={duration}
              onChange={handleDurationChange}
              className="w-full bg-transparent text-center text-lg font-medium text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleIncrement}
              className="px-3 py-2 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>

          {/* Unit Selector */}
          <div className="flex shrink-0 rounded-md bg-gray-800 p-0.5">
            <UnitButton value="Days" />
            <UnitButton value="Weeks" />
            <UnitButton value="Months" />
          </div>
        </div>
      </div>
    </div>
  );
}
