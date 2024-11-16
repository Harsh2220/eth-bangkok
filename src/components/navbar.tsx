"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MainSidebar } from "@/components/sidebar";

export function Navbar() {
  return (
    <nav className="sticky top-2 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        <w3m-button />
      </div>
    </nav>
  );
}
