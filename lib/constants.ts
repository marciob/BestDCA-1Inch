import type { Abi } from "viem";

export const VAULT_CONTRACT_ADDRESS =
  "0xFf30dbaFc3033f591c062d767D5E8A61f5e165B9" as const;

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
