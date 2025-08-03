// app/components/Dashboard.tsx
"use client";

import Card from "./Card";
import { useVaultInfo } from "@/app/hooks/useVaultInfo";
import { useFills } from "@/app/hooks/useFills";
import { usePrices } from "@/app/hooks/usePrices";

export default function Dashboard() {
  /* ── live vault data ───────────────────────────── */
  const { balance, isLoading: loadingInfo } = useVaultInfo();

  /* ── recent fill history ────────────────────────── */
  const { fills, isLoading: loadingFills, realised } = useFills();

  /* ── live price ratio (WBTC per ETH) ───────────── */
  const { wbtcPerEth, isLoading: loadingRatio } = usePrices();

  /* ── compute average cost vs market ─────────────── */
  const marketCostEth = wbtcPerEth ? 1 / wbtcPerEth : 0; // WETH needed for 1 WBTC
  const avgCostEth =
    realised.wbtcRecv > 0 ? realised.ethSpent / realised.wbtcRecv : 0;
  const diffPct =
    marketCostEth > 0
      ? ((marketCostEth - avgCostEth) / marketCostEth) * 100
      : 0;

  return (
    <div className="w-full space-y-6">
      {/* Dashboard Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">
          Portfolio Overview
        </h1>
        <p className="text-gray-400">
          Track your DCA performance and accumulations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {/* WETH Balance Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">WETH in Vault</h3>
          </div>
          {loadingInfo ? (
            <div className="h-8 w-32 animate-pulse rounded bg-gray-700/50" />
          ) : (
            <div>
              <p className="text-3xl font-bold text-white mb-1">
                {balance ?? "0.000"}
              </p>
              <p className="text-gray-400 text-sm">Available Balance</p>
            </div>
          )}
        </div>

        {/* Average Cost Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Avg WBTC Cost</h3>
          </div>
          {loadingFills || loadingRatio ? (
            <div className="h-8 w-32 animate-pulse rounded bg-gray-700/50" />
          ) : realised.wbtcRecv === 0 ? (
            <div>
              <p className="text-gray-400 text-sm">No fills yet</p>
              <p className="text-gray-500 text-xs">
                Start DCA to see your average cost
              </p>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold text-white mb-1">
                {avgCostEth.toFixed(5)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">ETH per WBTC</span>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    diffPct < 0
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {diffPct < 0 ? "↓" : "↑"} {Math.abs(diffPct).toFixed(1)}% vs
                  market
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Recent Accumulations
            </h3>
          </div>
        </div>

        <div className="p-6">
          {loadingFills ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-400">Loading fills…</span>
            </div>
          ) : fills.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">
                  No accumulations yet
                </div>
                <p className="text-gray-500 text-sm">
                  Your DCA fills will appear here once executed
                </p>
              </div>

              {/* Info Block - Cancel Button Explanation */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-500/20 rounded-lg flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-medium mb-1">
                      DCA Management
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      The <strong>Cancel DCA</strong> button will appear in the
                      Setup DCA panel once you create an active DCA order. You
                      can then cancel your order and withdraw your funds at any
                      time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fills.map((fill, idx) => (
                <div
                  key={fill.rowKey}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">
                      Acquired{" "}
                      <span className="text-blue-400 font-bold">
                        {fill.amount}
                      </span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Filled via {fill.chain}
                    </p>
                  </div>
                  <time className="text-gray-400 text-sm">{fill.time}</time>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
