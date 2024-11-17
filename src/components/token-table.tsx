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

interface TokenData {
  chain_id: number;
  contract_address: string;
  amount: number;
  price_to_usd: number;
  value_usd: number;
  abs_profit_usd: number;
  roi: number;
  status: number;
}

const TableComponent = ({ data }: { data: TokenData[] }) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Token</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Balance</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Value</TableHead>

          <TableHead className="text-right">PnL</TableHead>
          <TableHead className="text-right">ROI%</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((d, i: number) => {
            return (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {d.contract_address}
                </TableCell>
                <TableCell>{d.chain_id}</TableCell>
                <TableCell className="text-right">
                  {d.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{d.price_to_usd}</TableCell>
                <TableCell className="text-right">
                  ${d.value_usd.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    d.abs_profit_usd > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ${d.abs_profit_usd.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    d.roi > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {d.roi.toFixed(2)}%
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
