import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { ShippingZonesParams } from "../hooks/use-shipping-zones-params";
import type { ShippingZone } from "../types";

export const getShippingZones = cache((params: ShippingZonesParams) =>
  apiFetch<ShippingZone[]>(`/admin/shipping-zones?${toSearchParams(params)}`),
);

function toSearchParams(params: ShippingZonesParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  const search = params.search.trim().slice(0, 100); // contract: search ≤ 100
  if (search) {
    searchParams.set("search", search);
  }

  return searchParams.toString();
}
