"use client";

import { Pie, PieChart, LabelList } from "recharts";

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
import { useOverviewStatsQuery } from "@/redux/api/stats.api";



/**
 * Chart configuration aligned with real services
 */
const chartConfig = {
  value: {
    label: "Booking",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-3)",

  },
  Cancelleed: {
    label: "Cancelled",
    color: "#FF2D55",
  },
  Pending: {
    label: "Pending",
    color: "var(--chart-2)",
  },
  Confirmed: {
    label: "Confirmed",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function BookingOverview() {
  const { data, isLoading } = useOverviewStatsQuery("");

  const overview = data?.result?.bookingStatusPieChart;

  /**
   * Derive pie data from API response
   * Zero-value services are excluded to avoid visual noise
   */
  const chartData = overview
    ? [
      {
        name: "Completed",
        value: overview.COMPLETED,
        fill: "#22C35D",
      },
      {
        name: "Cancelled",
        value: overview.CANCELLED,
        fill: "#FF2D55",
      },
      {
        name: "Pending",
        value: overview.PENDING,
        fill: "#F7CD5F",
      },
      {
        name: "Confirmed",
        value: overview.CONFIRMED,
        fill: "#3D8AF5",
      },
    ].filter(item => item.value > 0)
    : [];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Booking Status</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[279px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" />}
            />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius="95%"
              innerRadius={0} // remove if you want a full pie instead of donut
            >
              <LabelList
                dataKey="name"
                stroke="none"
                fontSize={8}
                formatter={(value: string) => value}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {!isLoading && chartData.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            No booking activity available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
