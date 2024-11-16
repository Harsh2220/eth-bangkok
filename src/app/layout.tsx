import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { AppKit } from "../../context/web3modal";
import { MainSidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const notoSans = Raleway({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OceanPot",
  description: "Track your crypto portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${notoSans.className}  antialiased`}>
        <AppKit>
          <div className="flex min-h-screen">
            <div className="">
              <SidebarProvider>
                <MainSidebar className="hidden md:flex" />
              </SidebarProvider>
            </div>
            <div className=" w-full">
              <Navbar />
              {children}
            </div>
          </div>
        </AppKit>
      </body>
    </html>
  );
}
