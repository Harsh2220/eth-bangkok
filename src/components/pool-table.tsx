import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pool } from "@/hooks/usePools";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button size={"sm"}>Lend</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Lend</DialogTitle>
                    <DialogDescription>
                      Lend token from various chain and earn highest yield
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="name"
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                        type="number"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button size={"sm"} variant={"outline"}>
                Borrow
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PoolTableComponent;
