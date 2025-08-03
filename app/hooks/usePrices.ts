// app/hooks/usePrices.ts
"use client";
import useSWR from "swr";

const WETH = "0x4200000000000000000000000000000000000006";
const WBTC = "0xa1b2c3d4e5f678901234567890abcdefabcdef12";
const fetcher = (u: string) => fetch(u).then((r) => r.json());

export function usePrices() {
  const { data: weth } = useSWR<{ price: number }>(
    `/api/price?token=${WETH}`,
    fetcher
  );
  const { data: wbtc } = useSWR<{ price: number }>(
    `/api/price?token=${WBTC}`,
    fetcher
  );

  return {
    // ratio: how much WBTC you can buy with 1 ETH (ETH price ÷ WBTC price)
    wbtcPerEth: wbtc && weth ? weth.price / wbtc.price : undefined, // ~0.05
    isLoading: !weth || !wbtc,
  };
}
