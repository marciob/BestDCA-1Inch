// app/components/Receive.tsx
"use client";

import Image from "next/image";
import { useMemo } from "react";
import { add, formatDistanceToNowStrict, formatDistanceStrict } from "date-fns";
import { usePrices } from "@/app/hooks/usePrices";

type Props = {
  amount: string; // ETH entered by user
  duration: number | string; // input in Action panel
  unit: "Days" | "Weeks" | "Months";
  params?: {
    startTime: bigint; // on-chain, seconds
    deltaTime: bigint; // seconds between slices
  };
};

/**
 * Displays the estimated WBTC received per slice and
 * a human-readable “next swap” timer.
 */
export default function Receive({ amount, duration, unit, params }: Props) {
  const { ethUsd, wbtcUsd, isLoading } = usePrices();

  const wbtcEst = useMemo(() => {
    const eth = Number(amount || 0);
    if (!ethUsd || !wbtcUsd) return 0;
    return (eth * ethUsd) / wbtcUsd; // ETH→USD / WBTC→USD
  }, [amount, ethUsd, wbtcUsd]);

  /* Fallback: based purely on UI cadence (before on-chain params exist) */
  const uiNextSlice = useMemo(() => {
    const mul = unit === "Weeks" ? 7 : unit === "Months" ? 30 : 1;
    const next = add(new Date(), { days: mul });
    return formatDistanceToNowStrict(next, { unit: "hour" }); // e.g. "in 23 h"
  }, [unit]);

  /* On-chain timer: (startTime + deltaTime) – now */
  const chainNextSlice = useMemo(() => {
    if (!params) return null;
    const targetMs = Number(params.startTime + params.deltaTime) * 1000;
    return formatDistanceStrict(new Date(targetMs), new Date(), {
      unit: "hour",
    });
  }, [params]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <p className="mb-4 text-sm font-medium text-gray-400">
        You receive (on&nbsp;Base)
      </p>

      <div className="flex items-center justify-between">
        <span className="text-4xl font-bold text-gray-300">
          {isLoading ? "…" : wbtcEst.toFixed(5)}
        </span>

        <div className="flex items-center gap-2 rounded-full p-2 text-lg font-medium text-white">
          <Image
            src="/btc_logo.png"
            alt="WBTC logo"
            width={20}
            height={20}
            style={{ width: "auto", height: "auto" }}
          />
          <span>WBTC</span>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Next swap&nbsp;
        {chainNextSlice ?? uiNextSlice}
      </p>
    </div>
  );
}
