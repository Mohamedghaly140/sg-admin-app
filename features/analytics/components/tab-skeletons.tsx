import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { AnalyticsTab } from "../hooks/use-analytics-params";

type TabSkeletonProps = {
  tab: AnalyticsTab;
};

export function TabSkeleton({ tab }: TabSkeletonProps) {
  const layout = tabSkeletonLayout[tab];

  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {layout.kpis > 0 ? <KpiSkeletons count={layout.kpis} /> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: layout.charts }).map((_, index) => (
          <ChartSkeleton key={index} />
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
  { kpis: number; charts: number; table: boolean }
> = {
  sales: { kpis: 4, charts: 3, table: false },
  products: { kpis: 3, charts: 1, table: true },
  customers: { kpis: 3, charts: 1, table: true },
  coupons: { kpis: 3, charts: 0, table: true },
  geography: { kpis: 0, charts: 1, table: false },
};

function KpiSkeletons({ count }: { count: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72 w-full" />
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
