import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { OrderDetail } from "../types";

export const getOrder = cache((id: string) =>
  apiFetch<OrderDetail>(`/admin/orders/${id}`),
);
