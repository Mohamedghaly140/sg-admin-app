"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  analyticsTabValues,
  type AnalyticsTab,
} from "../hooks/use-analytics-params";

const tabLabels: Record<AnalyticsTab, string> = {
  sales: "Sales",
  products: "Products",
  customers: "Customers",
  coupons: "Coupons",
  geography: "Geography",
};

export function AnalyticsTabsNav() {
  return (
    <TabsList
      variant="line"
      aria-label="Analytics sections"
      className="max-w-full justify-start overflow-x-auto"
    >
      {analyticsTabValues.map((tab) => (
        <TabsTrigger key={tab} value={tab}>
          {tabLabels[tab]}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
