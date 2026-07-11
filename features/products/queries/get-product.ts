import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { ProductDetail } from "../types";

export const getProduct = cache((id: string) =>
  apiFetch<ProductDetail>(`/admin/products/${id}`),
);
