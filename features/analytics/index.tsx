import { Suspense, type ReactNode } from "react";

import { AnalyticsShell } from "./components/analytics-shell";
import { CouponsTab } from "./components/coupons-tab";
import { CustomersTab } from "./components/customers-tab";
import { GeographyTab } from "./components/geography-tab";
import { ProductsTab } from "./components/products-tab";
import { SalesTab } from "./components/sales-tab";
import { TabSkeleton } from "./components/tab-skeletons";
import type {
  AnalyticsParams,
  AnalyticsTab,
} from "./hooks/use-analytics-params";

type AnalyticsFeatureProps = {
  params: AnalyticsParams;
};

export default function AnalyticsFeature({ params }: AnalyticsFeatureProps) {
  const asOf = new Date().toISOString().slice(0, 10);

  return (
    <AnalyticsShell asOf={asOf}>
      <Suspense key={params.tab} fallback={<TabSkeleton tab={params.tab} />}>
        {renderActiveTab(params.tab, params)}
      </Suspense>
    </AnalyticsShell>
  );
}

function renderActiveTab(
  tab: AnalyticsTab,
  params: AnalyticsParams,
): ReactNode {
  switch (tab) {
    case "products":
      return <ProductsTab params={params} />;
    case "customers":
      return <CustomersTab params={params} />;
    case "coupons":
      return <CouponsTab params={params} />;
    case "geography":
      return <GeographyTab params={params} />;
    case "sales":
      return <SalesTab params={params} />;
  }
}
