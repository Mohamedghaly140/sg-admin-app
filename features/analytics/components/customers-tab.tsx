import { handleAuthError } from "@/lib/api/handle-auth-error";

import type { AnalyticsParams } from "../hooks/use-analytics-params";
import { getCustomersAnalytics } from "../queries/get-customers-analytics";
import { AnalyticsKpiCards } from "./analytics-kpi-cards";
import { NewCustomersChart } from "./new-customers-chart";
import { TopSpendersTable } from "./top-spenders-table";

type CustomersTabProps = {
  params: Pick<AnalyticsParams, "from" | "to">;
};

export async function CustomersTab({ params }: CustomersTabProps) {
  let response: Awaited<ReturnType<typeof getCustomersAnalytics>>;

  try {
    response = await getCustomersAnalytics(params);
  } catch (error) {
    handleAuthError(error);
  }

  const { data } = response;

  return (
    <div className="flex flex-col gap-4">
      <AnalyticsKpiCards
        items={[
          { label: "Total customers (all time)", value: data.totalCustomers },
          { label: "New customers (in range)", value: data.newThisPeriod },
          {
            label: "Active customers (in range)",
            value: data.activeThisPeriod,
          },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <NewCustomersChart
          data={data.newCustomersOverTime}
          grouping={data.grouping}
        />
        <TopSpendersTable customers={data.topSpenders} />
      </div>
    </div>
  );
}
