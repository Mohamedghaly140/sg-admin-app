import Link from "next/link";

import type { PageMeta } from "@/lib/api/http";

import {
  buildProductsHref,
  type ProductsParams,
} from "../hooks/use-products-params";

type ProductsPaginationProps = {
  meta?: PageMeta;
  params: ProductsParams;
};

export function ProductsPagination({
  meta,
  params,
}: ProductsPaginationProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-3 text-sm"
      aria-label="Products pagination"
    >
      <p className="text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </p>
      <div className="flex gap-2">
        {meta.hasPrev ? (
          <Link
            href={buildProductsHref({ ...params, page: meta.page - 1 })}
            className="inline-flex h-8 items-center rounded-lg border px-3 font-medium transition-colors hover:bg-muted"
          >
            Previous
          </Link>
        ) : (
          <span className="inline-flex h-8 items-center rounded-lg border px-3 font-medium text-muted-foreground opacity-50">
            Previous
          </span>
        )}
        {meta.hasNext ? (
          <Link
            href={buildProductsHref({ ...params, page: meta.page + 1 })}
            className="inline-flex h-8 items-center rounded-lg border px-3 font-medium transition-colors hover:bg-muted"
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex h-8 items-center rounded-lg border px-3 font-medium text-muted-foreground opacity-50">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
