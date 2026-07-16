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

import type { SalesAnalytics } from "../types";

type PaymentMethodChartProps = {
  data: SalesAnalytics["paymentMethodSplit"];
};

const chartConfig = {
  count: {
    label: "Orders",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="analytics-payment-method-chart-title">Payment methods</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            role="group"
            aria-labelledby="analytics-payment-method-chart-title"
          >
            <BarChart
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
                dataKey="method"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-72 items-center justify-center">
            <EmptyState
              icon={
                <LucideChartNoAxesColumn
                  className="size-5"
                  aria-hidden="true"
                />
              }
              title="No payment method data"
              description="Payment method counts will appear here."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
