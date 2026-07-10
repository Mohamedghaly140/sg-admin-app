import { LucideFolderOpen } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { handleAuthError } from "@/lib/api/handle-auth-error";

import { CategoriesPagination } from "./components/categories-pagination";
import { CategoriesSearch } from "./components/categories-search";
import { CategoriesTable } from "./components/categories-table";
import { getCategories } from "./queries/get-categories";
import type { CategoriesParams } from "./hooks/use-categories-params";

type CategoriesFeatureProps = {
  searchParams: CategoriesParams;
};

export default async function CategoriesFeature({
  searchParams,
}: CategoriesFeatureProps) {
  let response: Awaited<ReturnType<typeof getCategories>>;

  try {
    response = await getCategories(searchParams);
  } catch (error) {
    handleAuthError(error);
  }

  const { data: categories, meta } = response;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-medium">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Browse category images and nested sub-categories.
          </p>
        </div>
        <CategoriesSearch />
      </div>

      {categories.length > 0 ? (
        <>
          <CategoriesTable categories={categories} />
          <CategoriesPagination meta={meta} params={searchParams} />
        </>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucideFolderOpen className="size-5" aria-hidden="true" />}
            title={
              searchParams.search
                ? "No categories match your search"
                : "No categories found"
            }
            description={
              searchParams.search
                ? "Try a different name or slug."
                : "Categories will appear here after they are created."
            }
          />
        </div>
      )}
    </section>
  );
}
