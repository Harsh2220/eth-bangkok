import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { PoolData } from "@/app/pools/page";

const PoolTableComponent = ({ data }: { data: PoolData[] }) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow className="!border-b-0">
          <TableHead className="w-[200px]">Token</TableHead>
          <TableHead className="text-right">TVL</TableHead>
          <TableHead className="text-right">Volume</TableHead>
          <TableHead className="text-right">APR</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((data) => (
          <TableRow key={data.token} className="!border-b-0">
            <TableCell className="font-medium flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {data.token}
            </TableCell>
            <TableCell className="text-right">{data.tvl}</TableCell>
            <TableCell className="text-right">{data.volume}</TableCell>
            <TableCell className="text-right">{data.apr}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PoolTableComponent;
