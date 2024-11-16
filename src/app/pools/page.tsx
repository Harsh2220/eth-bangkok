"use client";

import PoolTableComponent from "@/components/pool-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PoolData = {
  token: string;
  tvl: number;
  volume: number;
  apr: number;
};

const poolData: PoolData[] = [
  {
    token: "ETH",
    tvl: 1000000,
    volume: 50000,
    apr: 5.5,
  },
  {
    token: "USDT",
    tvl: 2000000,
    volume: 100000,
    apr: 4.5,
  },
  {
    token: "DAI",
    tvl: 1500000,
    volume: 75000,
    apr: 4.8,
  },
  {
    token: "USDC",
    tvl: 1800000,
    volume: 90000,
    apr: 4.7,
  },
  {
    token: "WBTC",
    tvl: 2500000,
    volume: 125000,
    apr: 6.0,
  },
];

export default function Pools() {
  return (
    <Card className="flex flex-col bg-transparent  w-[content]">
      <CardHeader className="items-center pb-0">
        <CardTitle className=" w-full">Pools </CardTitle>
        {/* <CardDescription>Overview</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-8">
        <PoolTableComponent data={poolData} />
      </CardContent>
    </Card>
    // <section className="min-h-[calc(100vh-56px)] flex justify-center items-center">
    //   <div className="bg-secondary rounded-3xl">
    //     <div className="p-4 flex justify-between items-center">
    //       <h4 className="font-semibold">Lend</h4>
    //       <SelectDemo />
    //     </div>
    //     <PoolTableComponent data={invoices} />
    //   </div>
    // </section>
  );
}
