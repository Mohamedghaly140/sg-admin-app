import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { ProductForm } from "../types";

export const getProductForm = cache((id: string) =>
  apiFetch<ProductForm>(`/admin/products/${id}/form`),
);
