// app/hooks/useBtcPrice.ts
"use client";

import useSWR from "swr";

const chainId = 84532; // Base Sepolia
const WBTC = "0xa1b2c3d4e5f678901234567890abcdefabcdef12";

const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ONEINCH_KEY}` },
  }).then((r) => r.json());

export function useBtcPrice() {
  const { data, error } = useSWR(
    `https://api.1inch.dev/price/v1.1/${chainId}/tokens/${WBTC}`,
    fetcher,
    { refreshInterval: 60_000 } // 1-min refresh
  );

  if (error) return { price: null, isLoading: false };
  if (!data) return { price: null, isLoading: true };

  // API returns { price: "68123.45" }
  return { price: Number(data.price), isLoading: false };
}
