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

type PaymentMethodChartProps = {
  data: SalesAnalytics["paymentMethodSplit"];
};

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const hasData = data.some((item) => item.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="analytics-payment-method-chart-title">Payment methods</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartDataTable
            caption="Payment methods"
            columns={["Method", "Orders"]}
            rows={data.map((item) => [formatLabel(item.method), item.count])}
          />
        ) : null}
        {hasData ? (
          <DistributionBar
            labelledBy="analytics-payment-method-chart-title"
            segments={data.map((item) => ({
              label: formatLabel(item.method),
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
              title="No payment method data"
              description="Payment method counts will appear here."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatLabel(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
