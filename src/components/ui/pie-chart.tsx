"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function PieChartComponent({ data }: { data: unknown }) {
  const chartData = React.useMemo(() => {
    if (Array.isArray(data)) {
      return data.map((item, index) => ({
        protocolname: item.protocol_name,
        usdvalue: item.value_usd,
        fill: `hsl(var(--chart-${index + 1}))`,
      }));
    } else {
      return [];
    }
  }, [data]);

  const chartConfig = React.useMemo(() => {
    return {
      ...chartData.reduce<Omit<ChartConfig, "usdvalue">>((acc, item, index) => {
        acc[item?.protocolname] = {
          label: item.protocolname,
          color: `hsl(var(--chart-${index + 1}))`,
        };
        return acc;
      }, {}),
      usdvalue: {
        label: "usd value",
      },
    } satisfies ChartConfig;
  }, [chartData]);

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.usdvalue, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col bg-transparent  w-[content]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Overview</CardTitle>
        {/* <CardDescription>Overview</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="usdvalue"
              nameKey="protocolname"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Token Split
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
