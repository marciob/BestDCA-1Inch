import type { Abi } from "viem";

export const VAULT_CONTRACT_ADDRESS =
  "0xC32DF513444723f40d8A3900F15DdBFB706C1AbC" as const;

// trimmed-down ABI: only what you call from the dApp
export const VAULT_ABI: Abi = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
