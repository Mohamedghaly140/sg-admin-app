import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { CouponsParams } from "../hooks/use-coupons-params";
import type { Coupon } from "../types";

export const getCoupons = cache((params: CouponsParams) =>
  apiFetch<Coupon[]>(`/admin/coupons?${toSearchParams(params)}`),
);

function toSearchParams(params: CouponsParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  const search = params.search.trim();
  if (search) {
    searchParams.set("search", search);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  return searchParams.toString();
}
