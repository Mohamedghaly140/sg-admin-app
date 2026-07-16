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

import type { DashboardRevenueByDay } from "../types";

type RevenueChartProps = {
  revenueByDay: DashboardRevenueByDay[];
  /** `YYYY-MM-DD` window anchor computed on the server (see DashboardFeature). */
  asOf: string;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueChart({ revenueByDay, asOf }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="dashboard-revenue-chart-title">Revenue — last 30 days</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {revenueByDay.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            role="group"
            aria-labelledby="dashboard-revenue-chart-title"
          >
            <AreaChart
              accessibilityLayer
              data={fillRevenueGaps(revenueByDay, asOf)}
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
                tickFormatter={formatChartDate}
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

function fillRevenueGaps(
  revenueByDay: DashboardRevenueByDay[],
  asOf: string,
): DashboardRevenueByDay[] {
  const revenueByDate = new Map(
    revenueByDay.map((item) => [item.date, item.revenue]),
  );
  const end = new Date(`${asOf}T00:00:00.000Z`);

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - (29 - index));
    const dateKey = date.toISOString().slice(0, 10);

    return {
      date: dateKey,
      revenue: revenueByDate.get(dateKey) ?? 0,
    };
  });
}

function formatChartDate(value: string): string {
  return formatDate(value).replace(/,? \d{4}/, "");
}

function formatTooltipDate(value: ReactNode): ReactNode {
  return typeof value === "string" ? formatDate(value) : value;
}
