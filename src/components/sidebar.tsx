"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Compass, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function MainSidebar({ className }: { className?: string }) {
  return (
    <Sidebar className={cn("border-r", className)}>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
          <span className="font-semibold">Portfolio Tracker</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full px-4">
          <div className="space-y-2 py-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/pools">
              <Button variant="ghost" className="w-full justify-start">
                <Compass className="mr-2 h-4 w-4" />
                Pools
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Made by Arpita
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
