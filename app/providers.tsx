// app/providers.tsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Get a free projectId at https://cloud.walletconnect.com
export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WC_ID || ""; // must be non-empty & V2 projectId

// If you don’t care about AppKit analytics failures, mute them:
if (typeof window !== "undefined") {
  // @ts-ignore – WalletConnect uses window.AppKit internally
  window.AppKit = { initialize: async () => ({}) };
}

const config = getDefaultConfig({
  appName: "Best DCA",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [baseSepolia],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
          <Toaster position="top-right" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
