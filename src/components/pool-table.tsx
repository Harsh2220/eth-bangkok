import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pool } from "@/hooks/usePools";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";

const PoolTableComponent = ({ data }: { data: Pool[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="!border-b-0">
          <TableHead className="w-[200px]">Token</TableHead>
          <TableHead className="text-right">Chain</TableHead>
          <TableHead className="text-right">APY</TableHead>
          <TableHead className="text-right">APR</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((data) => (
          <TableRow key={data.token.address} className="!border-b-0">
            <TableCell className="font-medium flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={data.token.image}
                  alt="@shadcn"
                  className="rounded-lg"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {data.token.symbol}
            </TableCell>
            <TableCell className="text-right">{data.chain.name}</TableCell>
            <TableCell className="text-right">
              {data.supplyYield.toFixed(2)}%
            </TableCell>
            <TableCell className="text-right">
              {data.borrowYield.toFixed(2)}%
            </TableCell>
            <TableCell className="text-right flex gap-2 justify-end">
              <Button size={"sm"}>Lend</Button>
              <Button size={"sm"}>Borrow</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PoolTableComponent;
