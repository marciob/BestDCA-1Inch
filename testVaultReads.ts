#!/usr/bin/env ts-node

import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

// ─── configure ─────────────────────────────────────────────────────────
const TEST_ADDRESS =
  "0x95a548A77f41d64f5F0d6905f8F9CD3aeFe972A9" as `0x${string}`;

/** fallback if you want to test a specific hash */
const TEST_ORDER_HASH =
  "0x296fab8ecfd2535682f525968a4bf94052b6f3f084161c3374a68e6d6744028a" as `0x${string}`;

/** your freshly-deployed vault */
const VAULT_CONTRACT_ADDRESS =
  "0x9095237c65931a38DaB979385a043efF9C84FD97" as `0x${string}`;

/** expand as in your frontend */
const VAULT_ABI = [
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "vaultBalanceOf",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "currentOrder",
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
        type: "tuple",
        components: [
          { name: "sliceSize", type: "uint256" },
          { name: "startTime", type: "uint256" },
          { name: "deltaTime", type: "uint256" },
          { name: "totalAmount", type: "uint256" },
        ],
      },
    ],
  },
] as const;
// ────────────────────────────────────────────────────────────────────────

async function testVaultReads() {
  console.log("🔍 Testing Vault Contract Reads");
  console.log("================================");
  console.log(`Vault:   ${VAULT_CONTRACT_ADDRESS}`);
  console.log(`EOA:     ${TEST_ADDRESS}`);
  console.log("");

  const client = createPublicClient({ chain: baseSepolia, transport: http() });
  try {
    const block = await client.getBlockNumber();
    console.log(`✅ RPC alive, latest block ${block}`);
  } catch (e) {
    console.error("❌ RPC connection failed:", e);
    return;
  }

  console.log("\n🧪 Test 1: vaultBalanceOf()");
  try {
    const bal = await client.readContract({
      address: VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "vaultBalanceOf",
      args: [TEST_ADDRESS],
    });
    console.log(`  → raw: ${bal}`);
    console.log(`  → ${Number(bal) / 1e18} ETH`);
  } catch (e: any) {
    console.error("  ❌ vaultBalanceOf error:", e.message);
  }

  console.log("\n🧪 Test 2: currentOrder()");
  let orderHash = TEST_ORDER_HASH;
  try {
    const cur = await client.readContract({
      address: VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "currentOrder",
    });
    console.log(`  → currentOrder: ${cur}`);
    if (
      cur !==
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      orderHash = cur;
      console.log("    (using on-chain orderHash for next test)");
    } else {
      console.log("    (no active DCA order on-chain—using TEST_ORDER_HASH)");
    }
  } catch (e: any) {
    console.error("  ❌ currentOrder error:", e.message);
  }

  console.log("\n🧪 Test 3: dcaParamsOf()");
  try {
    const p = await client.readContract({
      address: VAULT_CONTRACT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "dcaParamsOf",
      args: [orderHash as `0x${string}`],
    });
    console.log("  → raw:", p);
    const { sliceSize, startTime, deltaTime, totalAmount } = p as any;
    console.log(
      `    sliceSize:   ${sliceSize} wei (${Number(sliceSize) / 1e18} ETH)`
    );
    console.log(
      `    startTime:   ${startTime} → ${new Date(
        Number(startTime) * 1000
      ).toISOString()}`
    );
    console.log(`    deltaTime:   ${deltaTime} sec`);
    console.log(
      `    totalAmount: ${totalAmount} wei (${Number(totalAmount) / 1e18} ETH)`
    );
  } catch (e: any) {
    console.error("  ❌ dcaParamsOf error:", e.message);
  }

  console.log("\n🏁 All done");
}

testVaultReads().catch((e) => {
  console.error("💥 fatal:", e);
  process.exit(1);
});
