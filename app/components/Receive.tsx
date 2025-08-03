// app/components/Receive.tsx
"use client";

import Image from "next/image";
import { useMemo } from "react";
import { add, formatDistanceToNowStrict, formatDistanceStrict } from "date-fns";
import { usePrices } from "@/app/hooks/usePrices";

type Props = {
  amount: string; // ETH entered by user
  duration: number | string; // e.g. 7
  unit: "Days" | "Weeks" | "Months";
  params?: {
    startTime: bigint; // seconds
    deltaTime: bigint; // seconds
  };
};

/**
 * Shows the WBTC you’ll receive (live quote) and
 * a timer until the next slice.
 */
export default function Receive({ amount, unit, params, duration }: Props) {
  const { wbtcPerEth, isLoading } = usePrices();

  // How many WBTC does `amount` ETH buy? ETH amount × (WBTC per ETH)
  const wbtcEst = useMemo(() => {
    if (!wbtcPerEth) return 0;
    const eth = Number(amount || 0);
    return eth * wbtcPerEth; // ETH × (WBTC per ETH) = WBTC
  }, [amount, wbtcPerEth]);
  /* UI-only fallback timer */
  const uiNextSlice = useMemo(() => {
    const mul = unit === "Weeks" ? 7 : unit === "Months" ? 30 : 1;
    const next = add(new Date(), { days: mul });
    return formatDistanceToNowStrict(next, { unit: "hour" });
  }, [unit]);

  /* On-chain timer (once params exist) */
  const chainNextSlice = useMemo(() => {
    if (!params) return null;
    const targetMs = Number(params.startTime + params.deltaTime) * 1000;
    return formatDistanceStrict(new Date(targetMs), new Date(), {
      unit: "hour",
    });
  }, [params]);

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <svg
            className="w-4 h-4 text-orange-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400">You receive</h3>
          <p className="text-xs text-gray-500">on Base Network</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="text-3xl font-bold text-white mb-1">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading...</span>
              </div>
            ) : (
              wbtcEst.toFixed(5)
            )}
          </div>
          <div className="text-sm text-gray-400">Estimated amount</div>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full px-4 py-2 border border-orange-500/30">
          <Image
            src="/btc_logo.png"
            alt="WBTC logo"
            width={20}
            height={20}
            style={{ width: "auto", height: "auto" }}
          />
          <span className="text-orange-300 font-medium">WBTC</span>
        </div>
      </div>

      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-blue-400">Next Swap</span>
        </div>
        <p className="text-white font-medium">
          {chainNextSlice ?? uiNextSlice}
        </p>
      </div>
    </div>
  );
}
