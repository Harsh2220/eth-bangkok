"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter as EthersAdapterImport } from "@reown/appkit-adapter-ethers";
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
const EthersAdapter = new EthersAdapterImport();

// 3. Create a metadata object
const metadata = {
  name: "Portfolio tracker",
  description: "Track your crypto portfolio",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create the AppKit instance
createAppKit({
  adapters: [EthersAdapter],
  metadata: metadata,
  networks: [mainnet, polygon, arbitrum, gnosis, optimism, base, bsc],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false,
    socials: false,
  },
});

export function AppKit({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col h-screen bg-[#F8F8F8] w-screen"
      style={{ height: "100vh" }}
    >
      <header
        className="flex justify-between items-center p-6 bg-white w-[100%]"
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="text-3xl font-bold text-[#333333]">
          Portfolio tracker
        </div>
        <div className="flex items-center gap-2">
          <w3m-button />
        </div>
      </header>
      <main className="flex-1 w-full h-full">{children}</main>
    </div>
  );
}
