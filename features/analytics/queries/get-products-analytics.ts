import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { ProductsAnalytics } from "../types";
import { toRangeQuery, type AnalyticsRangeParams } from "./range-query";

export const getProductsAnalytics = cache((params: AnalyticsRangeParams) =>
  apiFetch<ProductsAnalytics>(
    `/admin/analytics/products${toRangeQuery(params)}`,
  ),
);
