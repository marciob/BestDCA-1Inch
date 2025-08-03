// app/providers.tsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Get a free projectId at https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = "YOUR_WALLETCONNECT_PROJECT_ID";

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
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
