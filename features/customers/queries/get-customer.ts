import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { CustomerDetail } from "../types";

export const getCustomer = cache((id: string) =>
  apiFetch<CustomerDetail>(`/admin/customers/${id}`),
);
