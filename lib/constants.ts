// lib/constants.ts
import type { Abi } from "viem";

/* ───–  update to YOUR fresh deployment  ─── */
export const VAULT_CONTRACT_ADDRESS =
  "0x9095237c65931a38DaB979385a043efF9C84FD97" as const;

/** Minimal ABI: only what the dApp calls */
export const VAULT_ABI: Abi = [
  /* –– mutating –– */
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },

  /* –– views –– */
  {
    type: "function",
    name: "vaultBalanceOf",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "currentOrder", // <── new
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "bytes32" }],
  },
  {
    type: "function",
    name: "dcaParamsOf",
    stateMutability: "view",
    inputs: [{ name: "orderHash", type: "bytes32" }],
    outputs: [
      {
        components: [
          { name: "sliceSize", type: "uint256" },
          { name: "startTime", type: "uint256" },
          { name: "deltaTime", type: "uint256" },
          { name: "totalAmount", type: "uint256" },
        ],
        type: "tuple",
      },
    ],
  },
] as const;
