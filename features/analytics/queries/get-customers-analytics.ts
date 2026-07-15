import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { CustomersAnalytics } from "../types";
import { toRangeQuery, type AnalyticsRangeParams } from "./range-query";

export const getCustomersAnalytics = cache((params: AnalyticsRangeParams) =>
  apiFetch<CustomersAnalytics>(
    `/admin/analytics/customers${toRangeQuery(params)}`,
  ),
);
