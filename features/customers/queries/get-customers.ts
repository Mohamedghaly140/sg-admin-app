import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { CustomersParams } from "../hooks/use-customers-params";
import type { Customer } from "../types";

export const getCustomers = cache((params: CustomersParams) =>
  apiFetch<Customer[]>(`/admin/customers?${toSearchParams(params)}`),
);

function toSearchParams(params: CustomersParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  const search = params.search.trim().slice(0, 100);
  if (search) {
    searchParams.set("search", search);
  }
  if (params.active) {
    searchParams.set("active", params.active);
  }

  return searchParams.toString();
}
