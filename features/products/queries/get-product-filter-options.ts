import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

export type ProductCategoryOption = {
  id: string;
  name: string;
};

type ProductFilterOptions = {
  categories: ProductCategoryOption[];
};

export const getProductFilterOptions = cache(() =>
  apiFetch<ProductFilterOptions>("/admin/products/filter-options"),
);
