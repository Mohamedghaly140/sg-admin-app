import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { DashboardMetrics } from "../types";

export const getDashboardMetrics = cache(() =>
  apiFetch<DashboardMetrics>("/admin/dashboard/metrics"),
);
