/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import TableComponent from "@/components/token-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartComponent } from "@/components/ui/line-chart";
import { PieChartComponent } from "@/components/ui/pie-chart";
import { useAppKitAccount } from "@reown/appkit-core/react";
import { useQuery } from "@tanstack/react-query";

// import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

const Home = () => {
  const { address } = useAppKitAccount();

  // First query
  const { data: amountData, isSuccess: isAmountSuccess } = useQuery({
    queryKey: ["amount", address],
    queryFn: () =>
      fetch(`/api/allnetworks?addresses=${address}`)
        .then((res) => res.json())
        .then((data) => data.data.result[0].value_usd.toFixed(5)),
    enabled: !!address,
  });

  // Second query
  const { data: pnlData, isSuccess: isPnlSuccess } = useQuery({
    queryKey: ["pnl", address],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          fetch(`/api/generalpnl?addresses=${address}`)
            .then((res) => res.json())
            .then(resolve);
        }, 1000);
      }),
    enabled: !!address && isAmountSuccess,
  });

  // Third query
  const { data: allnetworkspercentage, isSuccess: isPercentageSuccess } =
    useQuery({
      queryKey: ["percentage-split", address],
      queryFn: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            fetch(`/api/allnetworkspercentage?addresses=${address}`)
              .then((res) => res.json())
              .then(resolve);
          }, 1000);
        }),
      enabled: !!address && isPnlSuccess,
    });

  // Fourth query
  const { data: tokenDetails } = useQuery({
    queryKey: ["token-details", address],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          fetch(`/api/tokendetails?addresses=${address}`)
            .then((res) => res.json())
            .then(resolve);
        }, 1000);
      }),
    enabled: !!address && isPercentageSuccess,
  });

  console.log("ttt", amountData);
  console.log("xxx", pnlData);
  console.log("tokenDetails", tokenDetails?.data?.result);

  return (
    <div className="min-h-screen px-6 flex flex-col gap-12">
      <div className="flex justify-between">
        <div>
          <h1 className="text-lg font-normal text-gray-600">Total Balance</h1>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">${amountData}</div>
            <div
              className={`text-lg font-semibold border border-opacity-40 rounded-full px-4 flex items-center gap-2
        ${
          pnlData?.data.roi > 0
            ? "text-green-500 border-green-500"
            : "text-red-500 border-red-500"
        }`}
            >
              {pnlData?.data.roi > 0 ? (
                <TrendingUp color="green" />
              ) : (
                <TrendingDown color="red" />
              )}
              {pnlData?.data.roi}%
            </div>
            <div
              className={`text-lg font-semibold
    ${pnlData?.data.abs_profit_usd > 0 ? "text-green-500" : "text-red-500"}`}
            >
              $ {Number(pnlData?.data.abs_profit_usd).toFixed(2)}
            </div>
          </div>
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
            <TableComponent data={tokenDetails?.data.result} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
