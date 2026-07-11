import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { ProductFormData } from "../types";

export const getProductFormData = cache(() =>
  apiFetch<ProductFormData>("/admin/products/form-data"),
);
