import {
  LucideArrowDown,
  LucideArrowUp,
  LucideMinus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEGP } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { DashboardMetricPair } from "../types";

type KpiCardsProps = {
  revenue: DashboardMetricPair;
  orders: DashboardMetricPair;
  newCustomers: DashboardMetricPair;
  avgOrderValue: DashboardMetricPair;
};

type KpiCardProps = {
  label: string;
  metric: DashboardMetricPair;
  formatValue?: (value: number) => string;
};

export function KpiCards({
  revenue,
  orders,
  newCustomers,
  avgOrderValue,
}: KpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Revenue" metric={revenue} formatValue={formatEGP} />
      <KpiCard label="Orders" metric={orders} />
      <KpiCard label="New customers" metric={newCustomers} />
      <KpiCard
        label="Average order value"
        metric={avgOrderValue}
        formatValue={formatEGP}
      />
    </div>
  );
}

function KpiCard({ label, metric, formatValue }: KpiCardProps) {
  const delta = getPercentageDelta(metric);
  const direction = delta === null || delta === 0 ? "flat" : delta > 0 ? "up" : "down";
  const DeltaIcon =
    direction === "up"
      ? LucideArrowUp
      : direction === "down"
        ? LucideArrowDown
        : LucideMinus;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{label}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-mono text-2xl font-semibold tabular-nums">
          {formatValue ? formatValue(metric.current) : metric.current.toLocaleString("en-EG")}
        </p>
        <div className="flex items-center gap-2">
          <Badge
            variant={direction === "down" ? "destructive" : "secondary"}
            className={cn(
              direction === "up" &&
                "bg-green-500/10 text-green-700 dark:text-green-400",
            )}
          >
            <DeltaIcon data-icon="inline-start" aria-hidden="true" />
            {delta === null ? "—" : `${Math.abs(delta).toFixed(1)}%`}
          </Badge>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function getPercentageDelta(metric: DashboardMetricPair): number | null {
  if (metric.previous === 0) {
    return null;
  }

  return ((metric.current - metric.previous) / metric.previous) * 100;
}
