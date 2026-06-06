"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/* -------------------------------------------------------------------------- */
/*                                Chart Config                                */
/* -------------------------------------------------------------------------- */

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type WeeklyEarning = {
  day: string;       // Sat, Sun, Mon...
  earnings: number;
};

type Props = {
  chartData: WeeklyEarning[];
  setType: (value: "weekly" | "monthly") => void;
};

/* -------------------------------------------------------------------------- */
/*                              Weekly Earnings                               */
/* -------------------------------------------------------------------------- */

export function WeeklyEarnings({ chartData, setType }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Platform Earning Report</CardTitle>

        <select
          onChange={(e) => setType(e.target.value as "weekly" | "monthly")}
          className="border px-4 py-1 text-gray-600 rounded-[6px]"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </CardHeader>

      <CardContent>
        <ChartContainer className="h-[380px] w-full" config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ top: 24, right: 16, left: 0, bottom: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="day"
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
