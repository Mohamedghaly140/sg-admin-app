import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { SalesAnalytics } from "../types";
import { toRangeQuery, type AnalyticsRangeParams } from "./range-query";

export const getSalesAnalytics = cache((params: AnalyticsRangeParams) =>
  apiFetch<SalesAnalytics>(`/admin/analytics/sales${toRangeQuery(params)}`),
);
