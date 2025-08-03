// app/components/Receive.tsx
import Image from "next/image";
import { useMemo } from "react";
import { differenceInHours, addDays } from "date-fns";

export default function Receive({
  amount,
  duration,
  unit,
}: {
  amount: string;
  duration: number | string;
  unit: "Days" | "Weeks" | "Months";
}) {
  // very rough estimate at 1 WBTC ≈ 23 ETH
  const wbtcEst = useMemo(() => Number(amount || 0) / 23, [amount]);
  const nextSwap = useMemo(() => {
    const mul = unit === "Weeks" ? 7 : unit === "Months" ? 30 : 1;
    return differenceInHours(addDays(new Date(), 1 * mul), new Date());
  }, [duration, unit]);

  return (
    <div className="rounded-xl bg-gray-900 p-4 border border-transparent">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm font-medium text-gray-400">
          You receive (on Base)
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="w-full text-4xl font-bold text-gray-500">0.0145</div>
        <div className="flex items-center gap-2 rounded-full p-2 text-lg font-medium text-white">
          +
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
      <div className="text-sm text-gray-400 mt-8">
        Next swap in ≈ {nextSwap} h • est. +{wbtcEst.toFixed(5)} WBTC
      </div>
    </div>
  );
}
