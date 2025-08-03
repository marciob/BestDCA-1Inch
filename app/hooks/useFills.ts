// app/hooks/useFills.ts
"use client";

import useSWR from "swr";

type FillRow = {
  id: string;
  amount: string;
  chain: string;
  time: string;
  rowKey: string;
};

type Realised = {
  ethSpent: number;
  wbtcRecv: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useFills() {
  const { data, error } = useSWR<FillRow[]>("/api/fill", fetcher, {
    refreshInterval: 8_000,
  });

  if (error)
    return {
      fills: [],
      isLoading: false,
      realised: { ethSpent: 0, wbtcRecv: 0 },
    };
  if (!data)
    return {
      fills: [],
      isLoading: true,
      realised: { ethSpent: 0, wbtcRecv: 0 },
    };

  const fills = data.map((f, idx) => ({
    ...f,
    time: new Date(f.time).toLocaleTimeString(),
    rowKey: `${f.id}-${idx}`,
  }));

  const realised = fills.reduce<Realised>(
    (acc, f) => ({
      ethSpent: acc.ethSpent + Number(f.amount),
      wbtcRecv: acc.wbtcRecv + Number(f.amount) / 23,
    }),
    { ethSpent: 0, wbtcRecv: 0 }
  );

  return { fills, isLoading: false, realised };
}
