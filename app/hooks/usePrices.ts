// app/hooks/usePrices.ts
"use client";

import useSWR from "swr";

const chainId = 84532; // Base Sepolia
const WETH = "0x4200000000000000000000000000000000000006";
const WBTC = "0xa1b2c3d4e5f678901234567890abcdefabcdef12";

const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ONEINCH_KEY}` },
  }).then((r) => r.json());

export function usePrices() {
  const { data: ethData } = useSWR(
    `https://api.1inch.dev/price/v1.1/${chainId}/tokens/${WETH}`,
    fetcher,
    { refreshInterval: 60_000 }
  );

  const { data: btcData } = useSWR(
    `https://api.1inch.dev/price/v1.1/${chainId}/tokens/${WBTC}`,
    fetcher,
    { refreshInterval: 60_000 }
  );

  return {
    ethUsd: ethData ? Number(ethData.price) : undefined,
    wbtcUsd: btcData ? Number(btcData.price) : undefined,
    isLoading: !ethData || !btcData,
  };
}
