"use client";

import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { arbitrum, base, optimism, polygon } from "viem/chains";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";

// 1. Get projectId at https://cloud.reown.com
const projectId = "be1c543939dbd66ef6e523248a000e7c";

// 2. Set Ethers adapters
const ethersAdapter = new EthersAdapter();

// 3. Create a metadata object
const metadata = {
  name: "Portfolio tracker",
  description: "Track your crypto portfolio",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

export const config = createConfig({
  chains: [arbitrum, base, optimism, polygon],
  transports: {
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

// 4. Create the AppKit instance
createAppKit({
  adapters: [ethersAdapter],
  metadata: metadata,
  networks: [arbitrum, optimism, base, polygon],
  projectId,
  defaultNetwork: polygon,
  features: {
    analytics: true,
    email: false,
    socials: false,
  },
});

export function AppKit({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">{children}</div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
