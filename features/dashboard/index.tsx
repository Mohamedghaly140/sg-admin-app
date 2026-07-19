import { handleAuthError } from "@/lib/api/handle-auth-error";

import { DashboardMetrics } from "./components/dashboard-metrics";
import { KpiCards } from "./components/kpi-cards";
import { LowStockList } from "./components/low-stock-list";
import { OrdersStatusChart } from "./components/orders-status-chart";
import { QuickStats } from "./components/quick-stats";
import { RecentOrdersTable } from "./components/recent-orders-table";
import { RevenueChart } from "./components/revenue-chart";
import { TopProducts } from "./components/top-products";
import { getDashboardMetrics } from "./queries/get-dashboard-metrics";

export default async function DashboardFeature() {
  let response: Awaited<ReturnType<typeof getDashboardMetrics>>;

  try {
    response = await getDashboardMetrics();
  } catch (error) {
    handleAuthError(error);
  }

  const { data: metrics } = response;

  // Anchor the 30-day revenue window on the server so the client renders the
  // same range (a render-time `new Date()` in the chart would drift across a
  // UTC-midnight hydration boundary).
  const asOf = new Date().toISOString().slice(0, 10);

  return (
    <DashboardMetrics
      asOf={asOf}
      title="Dashboard"
      subtitle="Store performance, recent activity, and inventory at a glance."
    >
      <KpiCards
        revenue={metrics.revenue}
        orders={metrics.orders}
        newCustomers={metrics.newCustomers}
        avgOrderValue={metrics.avgOrderValue}
      />
      <QuickStats
        pendingOrders={metrics.pendingOrders}
        lowStockCount={metrics.lowStockCount}
        activeCoupons={metrics.activeCoupons}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <RevenueChart revenueByDay={metrics.revenueByDay} asOf={asOf} />
        <OrdersStatusChart ordersByStatus={metrics.ordersByStatus} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <RecentOrdersTable orders={metrics.recentOrders} />
        <TopProducts products={metrics.topProducts} />
      </div>

      <LowStockList products={metrics.lowStockProducts} />
    </DashboardMetrics>
  );
}
