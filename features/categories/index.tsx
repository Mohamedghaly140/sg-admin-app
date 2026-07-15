import { LucideFolderOpen, LucidePlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { handleAuthError } from "@/lib/api/handle-auth-error";
import { redirectToLastPageIfOutOfRange } from "@/lib/pagination";

import { CategoriesPagination } from "./components/categories-pagination";
import { CategoriesSearch } from "./components/categories-search";
import { CategoriesTable } from "./components/categories-table";
import { CategoryFormDialog } from "./components/category-form-dialog";
import {
  buildCategoriesHref,
  type CategoriesParams,
} from "./hooks/use-categories-params";
import { getAllCategories } from "./queries/get-all-categories";
import { getCategories } from "./queries/get-categories";

type CategoriesFeatureProps = {
  searchParams: CategoriesParams;
};

export default async function CategoriesFeature({
  searchParams,
}: CategoriesFeatureProps) {
  let response: [
    Awaited<ReturnType<typeof getCategories>>,
    Awaited<ReturnType<typeof getAllCategories>>,
  ];

  try {
    response = await Promise.all([
      getCategories(searchParams),
      getAllCategories(),
    ]);
  } catch (error) {
    handleAuthError(error);
  }

  const [{ data: categories, meta }, categoryOptions] = response;
  redirectToLastPageIfOutOfRange(meta, (page) =>
    buildCategoriesHref({ ...searchParams, page }),
  );
  const hasFilters = Boolean(searchParams.search.trim());

  const newCategoryTrigger = (
    <Button type="button">
      <LucidePlus data-icon="inline-start" aria-hidden="true" />
      New category
    </Button>
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-medium">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Browse category images and nested sub-categories.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <CategoriesSearch />
          <CategoryFormDialog trigger={newCategoryTrigger} />
        </div>
      </div>

      {categories.length > 0 ? (
        <>
          <CategoriesTable
            categories={categories}
            categoryOptions={categoryOptions}
          />
          <CategoriesPagination meta={meta} params={searchParams} />
        </>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucideFolderOpen className="size-5" aria-hidden="true" />}
            title={
              hasFilters
                ? "No categories match your search"
                : "No categories found"
            }
            description={
              hasFilters
                ? "Try a different name or slug."
                : "Categories will appear here after they are created."
            }
            action={<CategoryFormDialog trigger={newCategoryTrigger} />}
          />
        </div>
      )}
    </section>
  );
}
