"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface LineChartComponentProps {
  timestamp: number;
  value_usd: number;
}

export function LineChartComponent({
  data,
}: {
  data: LineChartComponentProps[];
}) {
  // Convert timestamp to formatted date and transform data
  const formattedData = data?.map((item) => ({
    date: new Date(item.timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    price: item.value_usd,
  }));

  // Group by month-year and calculate average price
  const monthlyData = formattedData?.reduce(
    (
      acc: Record<string, { date: string; price: number; count: number }>,
      curr
    ) => {
      if (!acc[curr.date]) {
        acc[curr.date] = {
          date: curr.date,
          price: curr.price,
          count: 1,
        };
      } else {
        acc[curr.date].price += curr.price;
        acc[curr.date].count += 1;
      }
      return acc;
    },
    {}
  );

  console.log("monthlyData", monthlyData);

  const chartData =
    monthlyData &&
    Object?.values(monthlyData).map((item) => ({
      date: item.date,
      price: item.price / item.count, // average price for the month
    }));

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  return (
    <Card className="bg-transparent w-full">
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        {/* <CardDescription className="flex gap-4">
          <div>
            Current:{" "}
            <span className="text-green-500">
              ${chartData[chartData?.length - 1].price.toFixed(2)}
            </span>
          </div>
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--color-mobile)"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
