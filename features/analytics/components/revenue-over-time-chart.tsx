"use client";

import { LucideChartNoAxesCombined } from "lucide-react";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { ChartDataTable } from "@/components/shared/chart-data-table";
import { EmptyState } from "@/components/shared/empty-state";
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
import { formatDate, formatEGP } from "@/lib/format";

import type { AnalyticsGrouping, SalesAnalytics } from "../types";
import { formatGroupingAxisLabel } from "../utils";

type RevenueOverTimeChartProps = {
  data: SalesAnalytics["revenueOverTime"];
  grouping: AnalyticsGrouping;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueOverTimeChart({
  data,
  grouping,
}: RevenueOverTimeChartProps) {
  function formatAxisDate(value: string): string {
    return formatGroupingAxisLabel(value, grouping);
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>
          <h2 id="analytics-revenue-over-time-chart-title">
            Revenue over time
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 && (
          <ChartDataTable
            caption="Revenue over time"
            columns={["Period", "Revenue"]}
            rows={data.map((point) => [
              formatAxisDate(point.date),
              formatEGP(point.revenue),
            ])}
          />
        )}
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            role="group"
            aria-labelledby="analytics-revenue-over-time-chart-title"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ left: 8, right: 8 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={formatAxisDate}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={88}
                tickFormatter={formatEGP}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={formatTooltipDate}
                    valueFormatter={formatEGP}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="var(--color-revenue)"
                fillOpacity={0.15}
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-72 items-center justify-center">
            <EmptyState
              icon={
                <LucideChartNoAxesCombined
                  className="size-5"
                  aria-hidden="true"
                />
              }
              title="No revenue data"
              description="Paid-order revenue will appear here."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatTooltipDate(value: ReactNode): ReactNode {
  return typeof value === "string" ? formatDate(value) : value;
}
