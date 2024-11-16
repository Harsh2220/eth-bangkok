import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppKit } from "../../context/web3modal";
import { MainSidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Portfolio tracker",
  description: "Track your crypto portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
