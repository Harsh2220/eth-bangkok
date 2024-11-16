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
import { useEffect, useState } from "react";
// import { useState } from "react";
import { TrendingUp } from "lucide-react";

const page = () => {
  const { address } = useAppKitAccount();
  const [value, setValue] = useState(0);
  const [percent, setPercent] = useState(0);
  const [pnl, setPnl] = useState(0);

  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  // useEffect(() => {
  //   fetchData(address);
  // }
  // , []);

  const fetchAmount = async () => {
    try {
      const BASE_URL = process.env.BASE_URL;
      const response = await fetch(`/api/allnetworks?addresses=${address}`);
      const data = await response.json();

      // console.log("result", data);

      // const responsePercentage = await fetch(
      //   "http://localhost:3000/api/allnetworkspercentage"
      // );
      // const resultPercentage = await responsePercentage.json();
      // console.log("resultPercentage", resultPercentage);

      // // Access the data from your response structure
      // const data = result.data.result[0].value_usd;

      // Now you can use the data
      // console.log(data.data, "asdsad");
      setValue(data.data.result[0].value_usd.toFixed(5));
      fetchPNL();
    } catch (error) {
      console.log("Error fetching data:", error);
      return null;
    }
  };

  const fetchPNL = async () => {
    try {
      const responsePnl = await fetch(`/api/generalpnl?addresses=${address}`);
      console.log("===> ", responsePnl);

      const resultPercentage = await responsePnl.json();

      console.log("resultPercentage", resultPercentage);
    } catch (error) {
      console.log("Error fetching data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (address) {
      fetchAmount();
    }
  }, [address]);

  return (
    <div className="min-h-screen px-6 flex flex-col gap-12">
      <div className="flex justify-between">
        <div>
          <h1 className="text-lg font-normal text-gray-600">Total Balance</h1>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">${value}</div>
            <div className="text-lg text-green-500 font-semibold border border-green-500 border-opacity-40 border-5 rounded-full px-4 flex items-center gap-2">
              <TrendingUp /> 10%
            </div>
            <div className="text-lg text-green-500 font-semibold">+ $21</div>
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
          <PieChartComponent />
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

export default page;
