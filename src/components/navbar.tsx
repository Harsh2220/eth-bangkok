"use client";

import { MainSidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useKlaster from "@/hooks/useKlaster";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Menu } from "lucide-react";

export function Navbar() {
  const { isConnected } = useAppKitAccount();
  const { klaster } = useKlaster();
  const { open } = useAppKit();

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MainSidebar />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
          <span className="font-semibold">OceanPot</span>
        </div>

        <div className="flex-1" />
        {isConnected && klaster ? (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              open();
            }}
          >
            {klaster?.account.getAddress(1)?.slice(0, 4)}...
            {klaster?.account.getAddress(1)?.slice(-2)}
          </Button>
        ) : (
          <appkit-button />
        )}
      </div>
    </nav>
  );
}
