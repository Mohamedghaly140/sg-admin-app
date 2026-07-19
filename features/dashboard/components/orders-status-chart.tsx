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

import {
  DASHBOARD_ORDER_STATUSES,
  type DashboardOrderStatusCount,
} from "../types";

type OrdersStatusChartProps = {
  ordersByStatus: DashboardOrderStatusCount[];
};

export function OrdersStatusChart({
  ordersByStatus,
}: OrdersStatusChartProps) {
  const normalizedData = withDefaultOrderStatuses(ordersByStatus);
  const hasData = normalizedData.some((item) => item.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="dashboard-orders-status-chart-title">Orders by status</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartDataTable
            caption="Orders by status"
            columns={["Status", "Orders"]}
            rows={normalizedData.map((item) => [
              formatStatus(item.status),
              item.count,
            ])}
          />
        ) : null}
        {hasData ? (
          <div className="flex h-72 items-center">
            <div className="w-full">
              <DistributionBar
                labelledBy="dashboard-orders-status-chart-title"
                segments={normalizedData.map((item) => ({
                  label: formatStatus(item.status),
                  value: item.count,
                }))}
              />
            </div>
          </div>
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
