"use client";

import PoolTableComponent from "@/components/pool-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import usePools from "@/hooks/usePools";
import { useQuery } from "@tanstack/react-query";

export default function Pools() {
  const { getPools } = usePools();
  const { data, isLoading, error } = useQuery({
    queryKey: ["pools"],
    queryFn: async () => {
      const pools = await getPools();
      return pools;
    },
  });

  console.log(data, isLoading);

  if (isLoading) return;

  if (error) return;

  if (data) {
    return (
      <Card className="flex flex-col bg-transparent  w-[content]">
        <CardHeader className="items-center pb-0">
          <CardTitle className=" w-full">Pools </CardTitle>
          {/* <CardDescription>Overview</CardDescription> */}
        </CardHeader>
        <CardContent className="flex-1 pb-0 pt-8">
          <PoolTableComponent data={data} />
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
}
