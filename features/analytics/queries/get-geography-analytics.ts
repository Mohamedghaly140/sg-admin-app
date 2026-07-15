import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { GeographyAnalytics } from "../types";
import { toRangeQuery, type AnalyticsRangeParams } from "./range-query";

export const getGeographyAnalytics = cache((params: AnalyticsRangeParams) =>
  apiFetch<GeographyAnalytics>(
    `/admin/analytics/geography${toRangeQuery(params)}`,
  ),
);
