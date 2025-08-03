import { NextRequest, NextResponse } from "next/server";

const API = "https://api.1inch.dev";
const CHAIN = 1; // main-net price feed
const API_KEY = process.env.ONEINCH_API_KEY!;

// Map Base-Sepolia tokens → main-net tokens
const TOKEN_MAP: Record<string, string> = {
  "0x4200000000000000000000000000000000000006":
    "0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2", // WETH
  "0xa1b2c3d4e5f678901234567890abcdefabcdef12":
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
};

export async function GET(req: NextRequest) {
  const addr = new URL(req.url).searchParams.get("token");
  if (!addr)
    return NextResponse.json(
      { error: "token query param missing" },
      { status: 400 }
    );

  const mainnetAddr = (TOKEN_MAP[addr.toLowerCase()] ?? addr).toLowerCase();
  const url = `${API}/price/v1.1/${CHAIN}/${mainnetAddr}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    console.error("1inch price fetch failed", res.status, await res.text());
    return NextResponse.json({ error: "upstream error" }, { status: 502 });
  }

  // Response shape: { "<token>": "123000000000000000000" }
  const obj = (await res.json()) as Record<string, string>;
  const raw = obj[Object.keys(obj)[0]];
  if (!raw)
    return NextResponse.json({ error: "no price for token" }, { status: 404 });

  const price = Number(raw) / 1e18; // convert 18-decimals → USD
  return NextResponse.json({ price });
}
