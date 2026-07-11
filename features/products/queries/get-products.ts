import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { ProductsParams } from "../hooks/use-products-params";
import type { Product } from "../types";

export const getProducts = cache((params: ProductsParams) =>
  apiFetch<Product[]>(`/admin/products?${toSearchParams(params)}`),
);

function toSearchParams(params: ProductsParams): string {
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
  if (params.categoryId) {
    searchParams.set("categoryId", params.categoryId);
  }
  if (params.featured) {
    searchParams.set("featured", params.featured);
  }

  return searchParams.toString();
}
