import { handleAuthError } from "@/lib/api/handle-auth-error";

import type { AnalyticsParams } from "../hooks/use-analytics-params";
import { getProductsAnalytics } from "../queries/get-products-analytics";
import { AnalyticsKpiCards } from "./analytics-kpi-cards";
import { RevenueByCategoryChart } from "./revenue-by-category-chart";
import { TopProductsTable } from "./top-products-table";

type ProductsTabProps = {
  params: Pick<AnalyticsParams, "from" | "to">;
};

export async function ProductsTab({ params }: ProductsTabProps) {
  let response: Awaited<ReturnType<typeof getProductsAnalytics>>;

  try {
    response = await getProductsAnalytics(params);
  } catch (error) {
    handleAuthError(error);
  }

  const { data } = response;

  return (
    <div className="flex flex-col gap-4">
      <AnalyticsKpiCards
        items={[
          { label: "Units sold (paid, in range)", value: data.totalUnitsSold },
          {
            label: "Active products (current)",
            value: data.activeProductsCount,
          },
          {
            label: "Out of stock (current)",
            value: data.outOfStockCount,
          },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <TopProductsTable products={data.topProducts} />
        <RevenueByCategoryChart data={data.revenueByCategory} />
      </div>
    </div>
  );
}
