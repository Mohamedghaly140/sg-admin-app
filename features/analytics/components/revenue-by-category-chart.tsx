"use client";

import { LucideChartNoAxesColumn } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

import type { ProductsAnalytics } from "../types";

type RevenueByCategoryChartProps = {
  data: ProductsAnalytics["revenueByCategory"];
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function RevenueByCategoryChart({
  data,
}: RevenueByCategoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="analytics-revenue-by-category-chart-title">
            Revenue by category
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.some((category) => category.revenue > 0) ? (
          <ChartContainer
            config={chartConfig}
            className="h-80 w-full"
            role="group"
            aria-labelledby="analytics-revenue-by-category-chart-title"
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
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={96}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent valueFormatter={formatEGP} />}
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-80 items-center justify-center">
            <EmptyState
              icon={
                <LucideChartNoAxesColumn
                  className="size-5"
                  aria-hidden="true"
                />
              }
              title="No category revenue data"
              description="Category revenue will appear here once there are paid sales in this range."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
