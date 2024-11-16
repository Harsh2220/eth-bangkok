"use client";

import TableComponent from "@/components/token-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartComponent } from "@/components/ui/line-chart";
import { PieChartComponent } from "@/components/ui/pie-chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useAppKitAccount } from "@reown/appkit-core/react";
import { useQuery } from "@tanstack/react-query";

// import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

const Home = () => {
  const { address } = useAppKitAccount();

  // Replace individual fetch functions with React Query hooks
  const {
    data: amountData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["amount", address],
    queryFn: async () => {
      const response = await fetch(`/api/allnetworks?addresses=${address}`);
      const data = await response.json();
      return data.data.result[0].value_usd.toFixed(5);
    },
    enabled: !!address,
  });

  console.log("ttt", amountData);

  const {
    data: pnlData,
    isPending: pnlPending,
    isError: pnlError,
  } = useQuery({
    queryKey: ["pnl", address],
    queryFn: async () => {
      const response = await fetch(`/api/generalpnl?addresses=${address}`);
      return response.json();
    },
    enabled: !!address,
  });

  console.log("xxx", pnlData);

  const {
    data: allnetworkspercentage,
    isPending: allnetworkspercentagePending,
    isError: allnetworkspercentageError,
  } = useQuery({
    queryKey: ["percentage-split", address],
    queryFn: async () => {
      const response = await fetch(
        `/api/allnetworkspercentage?addresses=${address}`
      );
      const data = await response.json();
      return data;
    },
    enabled: !!address,
  });

  console.log("allnetworkspercentage", allnetworkspercentage);

  return (
    <div className="min-h-screen px-6 flex flex-col gap-12">
      <div className="flex justify-between">
        <div>
          <h1 className="text-lg font-normal text-gray-600">Total Balance</h1>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">${amountData}</div>
            <div className="text-lg text-green-500 font-semibold border border-green-500 border-opacity-40 border-5 rounded-full px-4 flex items-center gap-2">
              <TrendingUp /> {pnlData?.data.roi}%
              {/* change color of down icon */}
              {/* <TrendingDown /> */}
            </div>
            <div className="text-lg text-green-500 font-semibold">
              + ${pnlData?.data.roi}
            </div>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-4/12">
          <PieChartComponent data={allnetworkspercentage?.data} />
        </div>
        <div className="border-[0.5px] border-gray-800 ml-2 mr-2" />
        <div className="w-8/12">
          <LineChartComponent />
        </div>
      </div>
      <div>
        <Card className="flex flex-col bg-transparent w-[content]">
          <CardHeader className="items-center pb-0">
            <CardTitle className=" w-full">Tokens</CardTitle>
            {/* <CardDescription>Overview</CardDescription> */}
          </CardHeader>
          <CardContent className="flex-1 pb-0 pt-8">
            <TableComponent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
