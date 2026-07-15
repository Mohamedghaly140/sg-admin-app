import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { CouponsAnalytics } from "../types";
import { toRangeQuery, type AnalyticsRangeParams } from "./range-query";

export const getCouponsAnalytics = cache((params: AnalyticsRangeParams) =>
  apiFetch<CouponsAnalytics>(
    `/admin/analytics/coupons${toRangeQuery(params)}`,
  ),
);
