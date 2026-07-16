"use client";

import { LucideChartNoAxesColumn } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { formatEGP } from "@/lib/format";

import type { GeographyAnalytics } from "../types";

type GeographyChartProps = {
  data: GeographyAnalytics["rows"];
};

const ordersChartConfig = {
  orderCount: {
    label: "Orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function GeographyChart({ data }: GeographyChartProps) {
  const hasRevenue = data.some((row) => row.revenue > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Orders and revenue by governorate</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 && (
          <ChartDataTable
            caption="Orders and revenue by governorate"
            columns={["Governorate", "Orders", "Revenue"]}
            rows={data.map((row) => [
              row.governorate,
              row.orderCount,
              formatEGP(row.revenue),
            ])}
          />
        )}
        {data.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <section aria-labelledby="geography-orders-title">
              <h3
                id="geography-orders-title"
                className="mb-3 text-sm font-medium"
              >
                Orders
              </h3>
              <ChartContainer
                config={ordersChartConfig}
                className="h-96 w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={data}
                  layout="vertical"
                  margin={{ left: 8, right: 24 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="var(--border)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="governorate"
                    axisLine={false}
                    tickLine={false}
                    width={96}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="orderCount"
                    fill="var(--color-orderCount)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </section>
            <section aria-labelledby="geography-revenue-title">
              <h3
                id="geography-revenue-title"
                className="mb-3 text-sm font-medium"
              >
                Revenue
              </h3>
              {hasRevenue ? (
                <ChartContainer
                  config={revenueChartConfig}
                  className="h-96 w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={data}
                    layout="vertical"
                    margin={{ left: 8, right: 24 }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke="var(--border)"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={formatEGP}
                    />
                    <YAxis
                      type="category"
                      dataKey="governorate"
                      axisLine={false}
                      tickLine={false}
                      width={96}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent valueFormatter={formatEGP} />
                      }
                    />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-96 items-center justify-center">
                  <EmptyState
                    icon={
                      <LucideChartNoAxesColumn
                        className="size-5"
                        aria-hidden="true"
                      />
                    }
                    title="No revenue in this range"
                    description="Revenue will appear here once there are paid orders in this range."
                  />
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center">
            <EmptyState
              icon={
                <LucideChartNoAxesColumn
                  className="size-5"
                  aria-hidden="true"
                />
              }
              title="No geography data"
              description="Governorate analytics will appear here."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
