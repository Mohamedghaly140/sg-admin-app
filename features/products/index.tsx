import Link from "next/link";
import { LucidePackageOpen, LucidePlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { handleAuthError } from "@/lib/api/handle-auth-error";

import { ProductsCategoryFilter } from "./components/products-category-filter";
import { ProductsFeaturedFilter } from "./components/products-featured-filter";
import { ProductsPagination } from "./components/products-pagination";
import { ProductsSearch } from "./components/products-search";
import { ProductsStatusFilter } from "./components/products-status-filter";
import { ProductsTable } from "./components/products-table";
import type { ProductsParams } from "./hooks/use-products-params";
import { getProductFilterOptions } from "./queries/get-product-filter-options";
import { getProducts } from "./queries/get-products";

type ProductsFeatureProps = {
  searchParams: ProductsParams;
};

export default async function ProductsFeature({
  searchParams,
}: ProductsFeatureProps) {
  let response: [
    Awaited<ReturnType<typeof getProducts>>,
    Awaited<ReturnType<typeof getProductFilterOptions>>,
  ];

  try {
    response = await Promise.all([
      getProducts(searchParams),
      getProductFilterOptions(),
    ]);
  } catch (error) {
    handleAuthError(error);
  }

  const [{ data: products, meta }, { data: filterOptions }] = response;
  const hasFilters = Boolean(
    searchParams.search.trim() ||
      searchParams.status ||
      searchParams.categoryId ||
      searchParams.featured,
  );

  const newProductButton = (
    <Button render={<Link href="/products/new" />}>
      <LucidePlus data-icon="inline-start" aria-hidden="true" />
      New product
    </Button>
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-base font-medium">Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage product inventory, pricing, and availability.
            </p>
          </div>
          {newProductButton}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <ProductsSearch />
          <ProductsStatusFilter />
          <ProductsCategoryFilter categories={filterOptions.categories} />
          <ProductsFeaturedFilter />
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <ProductsTable products={products} />
          <ProductsPagination meta={meta} params={searchParams} />
        </>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucidePackageOpen className="size-5" aria-hidden="true" />}
            title={
              hasFilters ? "No products match your filters" : "No products found"
            }
            description={
              hasFilters
                ? "Try adjusting your search or filters."
                : "New products will appear here after they are created."
            }
            action={hasFilters ? undefined : newProductButton}
          />
        </div>
      )}
    </section>
  );
}
