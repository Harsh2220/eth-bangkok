import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PoolTableComponent from "@/components/pool-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="flex flex-col bg-transparent  w-[content]">
      <CardHeader className="items-center pb-0">
        <CardTitle className=" w-full">Pools </CardTitle>
        {/* <CardDescription>Overview</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-8">
        <PoolTableComponent data={invoices} />
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
