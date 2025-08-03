// app/components/Dashboard.tsx
"use client";

import Card from "./Card";
import { useVaultInfo } from "@/app/hooks/useVaultInfo";
import { useFills } from "@/app/hooks/useFills";
import { useBtcPrice } from "@/app/hooks/useBtcPrice";

export default function Dashboard() {
  /* ── live vault data ───────────────────────────── */
  const { balance, isLoading: loadingInfo } = useVaultInfo();

  /* ── recent fill history (polls every 20 s) ─────── */
  const { fills, isLoading: loadingFills, realised } = useFills();
  const { price: btcUsd, isLoading: loadingPrice } = useBtcPrice();

  return (
    <div className="flex w-full flex-col gap-6">
      {/*  ░░░  TOP CARDS  ░░░  */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* WETH balance */}
        <Card title="WETH in Vault">
          {loadingInfo ? (
            <div className="h-8 w-32 animate-pulse rounded bg-gray-700/50" />
          ) : (
            <p className="text-3xl font-bold text-white">
              {balance ?? "0.000"} <span className="text-xl">WETH</span>
            </p>
          )}
        </Card>

        {/* Live average cost */}
        <Card title="Your Avg WBTC Cost">
          {loadingFills || loadingPrice ? (
            <div className="h-8 w-32 animate-pulse rounded bg-gray-700/50" />
          ) : realised.wbtcRecv === 0 ? (
            <p className="text-sm text-gray-400">No fills yet</p>
          ) : (
            <>
              <p className="text-3xl font-bold text-white">
                $
                {(realised.ethSpent * (btcUsd! / realised.wbtcRecv)).toFixed(2)}
              </p>
              <p
                className={`text-sm ${
                  realised.ethSpent * (btcUsd! / realised.wbtcRecv) < btcUsd!
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {(
                  ((btcUsd! -
                    realised.ethSpent * (btcUsd! / realised.wbtcRecv)) /
                    btcUsd!) *
                  100
                ).toFixed(1)}
                % vs market
              </p>
            </>
          )}
        </Card>
      </div>

      {/*  ░░░  FILL FEED  ░░░  */}
      <Card title="Recent Accumulations">
        {loadingFills ? (
          <p className="text-sm text-gray-400">Loading fills…</p>
        ) : fills.length === 0 ? (
          <p className="text-sm text-gray-400">No fills yet</p>
        ) : (
          <ul role="list" className="-mb-8 flow-root">
            {fills.map((fill, idx) => (
              <li key={fill.rowKey}>
                {" "}
                <div className="relative pb-8">
                  {idx !== fills.length - 1 && (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-700"
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative flex items-center space-x-3">
                    {/* green check icon */}
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-gray-900">
                      <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>

                    <div className="flex min-w-0 flex-1 justify-between space-x-4">
                      <div>
                        <p className="text-md text-white">
                          Acquired&nbsp;
                          <span className="font-bold">{fill.amount}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Filled via {fill.chain}
                        </p>
                      </div>

                      <time
                        className="whitespace-nowrap text-right text-sm text-gray-500"
                        dateTime={fill.time}
                      >
                        {fill.time}
                      </time>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
