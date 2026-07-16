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

import {
  DASHBOARD_ORDER_STATUSES,
  type DashboardOrderStatusCount,
} from "../types";

type OrdersStatusChartProps = {
  ordersByStatus: DashboardOrderStatusCount[];
};

const chartConfig = {
  count: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function OrdersStatusChart({
  ordersByStatus,
}: OrdersStatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="dashboard-orders-status-chart-title">Orders by status</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ordersByStatus.length > 0 && (
          <ChartDataTable
            caption="Orders by status"
            columns={["Status", "Orders"]}
            rows={withDefaultOrderStatuses(ordersByStatus).map((item) => [
              formatStatus(item.status),
              item.count,
            ])}
          />
        )}
        {ordersByStatus.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            role="group"
            aria-labelledby="dashboard-orders-status-chart-title"
          >
            <BarChart
              accessibilityLayer
              data={withDefaultOrderStatuses(ordersByStatus)}
              margin={{ left: 8, right: 8 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="status"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={formatStatus}
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
              title="No order data"
              description="Order status totals will appear here."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function withDefaultOrderStatuses(
  ordersByStatus: DashboardOrderStatusCount[],
): DashboardOrderStatusCount[] {
  const counts = new Map(
    ordersByStatus.map((item) => [item.status, item.count]),
  );

  return DASHBOARD_ORDER_STATUSES.map((status) => ({
    status,
    count: counts.get(status) ?? 0,
  }));
}

function formatStatus(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}
