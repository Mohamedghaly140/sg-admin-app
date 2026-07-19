import {
  LucideArrowUpRight,
  LucideBadgePercent,
  LucidePackageSearch,
  LucideTimer,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuickStatsProps = {
  pendingOrders: number;
  lowStockCount: number;
  activeCoupons: number;
};

type QuickStatCardProps = {
  href: string;
  label: string;
  value: number;
  icon: LucideIcon;
};

export function QuickStats({
  pendingOrders,
  lowStockCount,
  activeCoupons,
}: QuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <QuickStatCard
        href="/orders?status=PENDING"
        label="Pending orders"
        value={pendingOrders}
        icon={LucideTimer}
      />
      <QuickStatCard
        href="#low-stock"
        label="Low-stock products"
        value={lowStockCount}
        icon={LucidePackageSearch}
      />
      <QuickStatCard
        href="/coupons"
        label="Active coupons"
        value={activeCoupons}
        icon={LucideBadgePercent}
      />
    </div>
  );
}

function QuickStatCard({
  href,
  label,
  value,
  icon: Icon,
}: QuickStatCardProps) {
  return (
    <Link href={href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      <Card className="h-full transition-colors group-hover:bg-muted/50">
        <CardHeader className="grid-cols-[1fr_auto] items-center">
          <CardTitle>
            <h2>{label}</h2>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
            <LucideArrowUpRight
              className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-2xl font-semibold tabular-nums">
            {value.toLocaleString("en-EG")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
