// app/hooks/useBtcPrice.ts
"use client";
import useSWR from "swr";

const WBTC = "0xa1b2c3d4e5f678901234567890abcdefabcdef12";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useBtcPrice() {
  const { data, error } = useSWR<{ price: string }>(
    `/api/price?token=${WBTC}`,
    fetcher,
    { refreshInterval: 60_000 }
  );
  return {
    price: data ? Number(data.price) : null,
    isLoading: !data && !error,
    error,
  };
}
