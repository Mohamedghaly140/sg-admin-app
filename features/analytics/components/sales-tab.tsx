import { handleAuthError } from "@/lib/api/handle-auth-error";
import { formatEGP } from "@/lib/format";

import type { AnalyticsParams } from "../hooks/use-analytics-params";
import { getSalesAnalytics } from "../queries/get-sales-analytics";
import { AnalyticsKpiCards } from "./analytics-kpi-cards";
import { OrdersByStatusChart } from "./orders-by-status-chart";
import { PaymentMethodChart } from "./payment-method-chart";
import { RevenueOverTimeChart } from "./revenue-over-time-chart";

type SalesTabProps = {
  params: Pick<AnalyticsParams, "from" | "to">;
};

export async function SalesTab({ params }: SalesTabProps) {
  let response: Awaited<ReturnType<typeof getSalesAnalytics>>;

  try {
    response = await getSalesAnalytics(params);
  } catch (error) {
    handleAuthError(error);
  }

  const { data } = response;

  return (
    <div className="flex flex-col gap-4">
      <AnalyticsKpiCards
        items={[
          {
            label: "Total revenue (paid)",
            value: data.totalRevenue,
            formatter: formatEGP,
          },
          { label: "Total orders (all statuses)", value: data.totalOrders },
          {
            label: "Average paid order value",
            value: data.avgOrderValue,
            formatter: formatEGP,
          },
          {
            label: "Discount applied (all statuses)",
            value: data.totalDiscountApplied,
            formatter: formatEGP,
          },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <RevenueOverTimeChart
          data={data.revenueOverTime}
          grouping={data.grouping}
        />
        <OrdersByStatusChart data={data.ordersByStatus} />
        <PaymentMethodChart data={data.paymentMethodSplit} />
      </div>
    </div>
  );
}
