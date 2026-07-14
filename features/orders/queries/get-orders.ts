import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { OrdersParams } from "../hooks/use-orders-params";
import type { Order } from "../types";

export const getOrders = cache((params: OrdersParams) =>
  apiFetch<Order[]>(`/admin/orders?${toSearchParams(params)}`),
);

function toSearchParams(params: OrdersParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  const search = params.search.trim().slice(0, 100);
  if (search) {
    searchParams.set("search", search);
  }
  if (params.status) {
    searchParams.set("status", params.status);
  }
  if (params.paymentMethod) {
    searchParams.set("paymentMethod", params.paymentMethod);
  }
  if (params.isPaid) {
    searchParams.set("isPaid", params.isPaid);
  }
  if (params.from) {
    searchParams.set("from", params.from);
  }
  if (params.to) {
    searchParams.set("to", params.to);
  }

  return searchParams.toString();
}
