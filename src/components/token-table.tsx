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

const TableComponent = () => {
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
        <TableRow>
          <TableCell className="font-medium">Pepe</TableCell>
          <TableCell>Token</TableCell>
          <TableCell className="text-right">92110185</TableCell>
          <TableCell className="text-right">$0.005</TableCell>
          <TableCell className="text-right">$1933.00</TableCell>
          <TableCell className="text-right text-green-500">$1857.00</TableCell>
          <TableCell className="text-right text-green-500">1741%</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Pepe</TableCell>
          <TableCell>Token</TableCell>
          <TableCell className="text-right">92110185</TableCell>
          <TableCell className="text-right">$0.005</TableCell>
          <TableCell className="text-right">$1933.00</TableCell>
          <TableCell className="text-right text-green-500">$1857.00</TableCell>
          <TableCell className="text-right text-green-500">1741%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableComponent;
