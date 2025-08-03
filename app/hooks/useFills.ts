// app/hooks/useFills.ts
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
const maker = process.env.NEXT_PUBLIC_VAULT;
const key = process.env.NEXT_PUBLIC_ONEINCH_KEY;

const fetcher = (url: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${key}` } }).then((r) =>
    r.json()
  );

export function useFills() {
  const { data, error } = useSWR(
    `https://api.1inch.dev/history/v1.1/${chainId}/orders/by_maker/${maker}?statuses=3`,
    fetcher,
    { refreshInterval: 20_000 } // 20 s
  );

  if (error) return { fills: [], isLoading: false };
  if (!data) return { fills: [], isLoading: true };

  return {
    fills: data.map((f: any) => ({
      id: f.orderHash,
      amount: `${Number(f.makingAmount) / 10 ** 18} WBTC`,
      chain: f.chainId === 84532 ? "Base" : f.chainId,
      time: formatDistanceToNow(new Date(f.filledAt), { addSuffix: true }),
    })),
    isLoading: false,
  };
}
