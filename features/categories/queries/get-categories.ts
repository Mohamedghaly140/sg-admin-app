import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { CategoriesParams } from "../hooks/use-categories-params";
import type { Category } from "../types";

export const getCategories = cache((params: CategoriesParams) =>
  apiFetch<Category[]>(`/admin/categories?${toSearchParams(params)}`),
);

function toSearchParams(params: CategoriesParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  const search = params.search.trim();
  if (search) {
    searchParams.set("search", search);
  }

  return searchParams.toString();
}
