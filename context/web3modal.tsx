"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


import {
  mainnet,
  polygon,
  arbitrum,
  gnosis,
  optimism,
  base,
  bsc,
} from "@reown/appkit/networks";

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

// 4. Create the AppKit instance
createAppKit({
  adapters: [ethersAdapter],
  metadata: metadata,
  networks: [mainnet, polygon, arbitrum, gnosis, optimism, base, bsc],
  projectId,
  defaultNetwork: mainnet,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false,
    socials: false,
  },
});
const queryClient = new QueryClient()

export function AppKit({ children }: { children: React.ReactNode }) {
  return (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
     <div className="min-h-screen bg-background">{children}</div>
     </QueryClientProvider>
  </WagmiProvider>)
}


// const signer = createWalletClient({
//   transport: http('https://polygon-mainnet.g.alchemy.com/v2/JxWlGwJmN3m6cTpQ0JDktyI7pafFtMC7')
// })