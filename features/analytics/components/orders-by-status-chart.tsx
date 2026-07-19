"use client";

import { LucideChartNoAxesColumn } from "lucide-react";

import { ChartDataTable } from "@/components/shared/chart-data-table";
import { DistributionBar } from "@/components/shared/distribution-bar";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { SalesAnalytics } from "../types";

type OrdersByStatusChartProps = {
  data: SalesAnalytics["ordersByStatus"];
};

export function OrdersByStatusChart({ data }: OrdersByStatusChartProps) {
  const hasData = data.some((item) => item.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="analytics-orders-by-status-chart-title">
            Orders by status
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartDataTable
            caption="Orders by status"
            columns={["Status", "Orders"]}
            rows={data.map((item) => [formatLabel(item.status), item.count])}
          />
        ) : null}
        {hasData ? (
          <DistributionBar
            labelledBy="analytics-orders-by-status-chart-title"
            segments={data.map((item) => ({
              label: formatLabel(item.status),
              value: item.count,
            }))}
          />
        ) : (
          <div className="flex h-24 items-center justify-center">
            <EmptyState
              icon={
                <LucideChartNoAxesColumn
                  className="size-5"
                  aria-hidden="true"
                />
              }
              title="No order status data"
              description="Order counts in this range will appear here."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
