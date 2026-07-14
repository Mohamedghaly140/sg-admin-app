import Link from "next/link";

import type { PageMeta } from "@/lib/api/http";

import {
  buildCategoriesHref,
  type CategoriesParams,
} from "../hooks/use-categories-params";

type CategoriesPaginationProps = {
  meta?: PageMeta;
  params: CategoriesParams;
};

export function CategoriesPagination({
  meta,
  params,
}: CategoriesPaginationProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-3 text-sm"
      aria-label="Categories pagination"
    >
      <p className="text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </p>
      <div className="flex gap-2">
        {meta.hasPrev ? (
          <Link
            href={buildCategoriesHref({ ...params, page: meta.page - 1 })}
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
            href={buildCategoriesHref({ ...params, page: meta.page + 1 })}
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
