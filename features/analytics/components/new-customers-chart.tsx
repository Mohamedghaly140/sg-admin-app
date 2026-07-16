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
import { formatDate } from "@/lib/format";

import type { AnalyticsGrouping, CustomersAnalytics } from "../types";
import { formatGroupingAxisLabel } from "../utils";

type NewCustomersChartProps = {
  data: CustomersAnalytics["newCustomersOverTime"];
  grouping: AnalyticsGrouping;
};

const chartConfig = {
  count: {
    label: "New customers",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function NewCustomersChart({
  data,
  grouping,
}: NewCustomersChartProps) {
  function formatAxisDate(value: string): string {
    return formatGroupingAxisLabel(value, grouping);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="analytics-new-customers-chart-title">
            New customers over time
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 && (
          <ChartDataTable
            caption="New customers over time"
            columns={["Period", "New customers"]}
            rows={data.map((point) => [formatAxisDate(point.date), point.count])}
          />
        )}
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            role="group"
            aria-labelledby="analytics-new-customers-chart-title"
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
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent labelFormatter={formatTooltipDate} />
                }
              />
              <Area
                dataKey="count"
                type="monotone"
                fill="var(--color-count)"
                fillOpacity={0.15}
                stroke="var(--color-count)"
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
              title="No customer growth data"
              description="New customers in this range will appear here."
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
