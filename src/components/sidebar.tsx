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
import { usePathname } from "next/navigation";

export function MainSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <Sidebar className={cn("border-r", className)}>
      <SidebarHeader className=" px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/ocean.svg" alt="Logo" className="h-10 w-10" />
          <span className="font-semibold text-xl">OceanPot</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full px-4">
          <div className="flex flex-col space-y-4 py-4">
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-lg",
                  pathname === "/" && "text-pink-500 border-l-4 border-pink-500"
                )}
              >
                <LayoutDashboard className="mr-2 h-6 w-6" />
                Dashboard
              </Button>
            </Link>
            <Link href="/pools">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-lg",
                  pathname === "/pools" &&
                    "text-pink-500 border-l-4 border-pink-500"
                )}
              >
                <Compass className="mr-2 h-6 w-6" />
                Pools
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className=" p-4">
        <Button variant="ghost" className="w-full justify-start text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
