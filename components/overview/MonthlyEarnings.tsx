"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription, 
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type MonthlyEarning = {
  month: string;
  earnings: number;
};

export function MonthlyEarnings({ chartData ,setType }: { chartData: MonthlyEarning[], setType: any }) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>Platform Earning Report</CardTitle>
       <select onChange={(e)=>setType(e.target.value)} className="border px-4 py-1 text-gray-600 rounded-[6px]" name="" id="">
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
       </select>
      </CardHeader>

      <CardContent >
        <ChartContainer className="h-[380px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />

            <Bar
              dataKey="earnings"
              fill="var(--color-earnings)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>     
    </Card>
  );
}
