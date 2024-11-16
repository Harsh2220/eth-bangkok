"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ABI } from "@/constants/abi";
import { POLYGON_CONTRACT } from "@/constants/contracts";
import { polygon } from "@reown/appkit/networks";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";
import {
  useChainId,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { formatUnits } from "viem";
import { AaveV3Polygon } from "@bgd-labs/aave-address-book";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px] rounded-xl">
        <SelectValue placeholder="Select token" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function Pools() {
  const { data, error, writeContractAsync } = useWriteContract();
  const { address } = useAppKitAccount();
  const chain = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { data: read, error: err } = useReadContract({
    abi: ABI,
    address: POLYGON_CONTRACT,
    functionName: "getReserveData",
    args: ["0xc2132D05D31c914a87C6611C10748AEb04B58e8F"],
  });

  async function handleCall() {
    if (!address) return;
    console.log(chain);
    await switchChainAsync({
      chainId: polygon.id,
    });
    await writeContractAsync({
      abi: ABI,
      address: POLYGON_CONTRACT,
      functionName: "supply",
      args: [
        "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        BigInt(1000000),
        address as `0x${string}`,
        0,
      ],
    });
    console.log(data, error);
  }

  useEffect(() => {
    if (read) {
      console.log(read, err, formatUnits(read?.currentLiquidityRate, 27));
    }
  }, [read]);

  return (
    <section className="min-h-[calc(100vh-56px)] flex justify-center items-center">
      <div className="bg-secondary rounded-3xl">
        <div className="p-4 flex justify-between items-center">
          <h4 className="font-semibold">Lend</h4>
          <SelectDemo />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="!border-b-0">
              <TableHead className="w-[200px]">Token</TableHead>
              <TableHead className="text-right">TVL</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">APR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice} className="!border-b-0">
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {invoice.invoice}
                </TableCell>
                <TableCell className="text-right">
                  {invoice.paymentStatus}
                </TableCell>
                <TableCell className="text-right">
                  {invoice.paymentMethod}
                </TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={handleCall}>Hello</Button>
    </section>
  );
}
