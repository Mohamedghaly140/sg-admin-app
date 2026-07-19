import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { AnalyticsTab } from "../hooks/use-analytics-params";

type TabSkeletonProps = {
  tab: AnalyticsTab;
};

export function TabSkeleton({ tab }: TabSkeletonProps) {
  const layout = tabSkeletonLayout[tab];

  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {layout.kpis > 0 ? (
        <KpiSkeletons
          count={layout.kpis}
          sparklineIndex={layout.sparklineIndex}
        />
      ) : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {layout.charts.map((chart, index) => (
          <ChartSkeleton
            key={index}
            size={chart.size}
            wide={chart.wide}
          />
        ))}
      </div>
      {layout.table ? <TableSkeleton /> : null}
    </div>
  );
}

export function AnalyticsLoadingSkeleton() {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-64 max-w-full" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-24" />
          ))}
        </div>
      </header>
      <Skeleton className="h-8 w-full max-w-lg" />
      <TabSkeleton tab="sales" />
    </section>
  );
}

const tabSkeletonLayout: Record<
  AnalyticsTab,
  {
    kpis: number;
    sparklineIndex?: number;
    charts: { size: "default" | "distribution"; wide?: boolean }[];
    table: boolean;
  }
> = {
  sales: {
    kpis: 4,
    sparklineIndex: 0,
    charts: [
      { size: "default", wide: true },
      { size: "distribution" },
      { size: "distribution" },
    ],
    table: false,
  },
  products: {
    kpis: 3,
    charts: [{ size: "default" }],
    table: true,
  },
  customers: {
    kpis: 3,
    sparklineIndex: 1,
    charts: [{ size: "default" }],
    table: true,
  },
  coupons: { kpis: 3, charts: [], table: true },
  geography: {
    kpis: 0,
    charts: [{ size: "default" }],
    table: false,
  },
};

type KpiSkeletonsProps = {
  count: number;
  sparklineIndex?: number;
};

function KpiSkeletons({ count, sparklineIndex }: KpiSkeletonsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-28" />
              {index === sparklineIndex ? (
                <Skeleton className="h-10 w-full" />
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type ChartSkeletonProps = {
  size: "default" | "distribution";
  wide?: boolean;
};

function ChartSkeleton({ size, wide = false }: ChartSkeletonProps) {
  return (
    <Card className={cn(wide && "xl:col-span-2")}>
      <CardHeader>
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent>
        <Skeleton
          className={cn(
            "w-full",
            size === "distribution" ? "h-24" : "h-72",
          )}
        />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
