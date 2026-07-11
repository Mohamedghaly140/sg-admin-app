import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { Category } from "../types";

export type CategoryOption = Pick<Category, "id" | "name">;

type ProductFormData = {
  categories: CategoryOption[];
  subCategories: Array<{
    id: string;
    name: string;
    categoryId: string;
  }>;
};

export const getAllCategories = cache(async (): Promise<CategoryOption[]> => {
  const { data } = await apiFetch<ProductFormData>("/admin/products/form-data");
  return data.categories;
});
