import Link from "next/link";

import type { PageMeta } from "@/lib/api/http";

import type { CouponsParams } from "../hooks/use-coupons-params";

type CouponsPaginationProps = {
  meta?: PageMeta;
  params: CouponsParams;
};

export function CouponsPagination({
  meta,
  params,
}: CouponsPaginationProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-3 text-sm"
      aria-label="Coupons pagination"
    >
      <p className="text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </p>
      <div className="flex gap-2">
        {meta.hasPrev ? (
          <Link
            href={toHref({ ...params, page: meta.page - 1 })}
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
            href={toHref({ ...params, page: meta.page + 1 })}
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

function toHref(params: CouponsParams): string {
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

  return `/coupons?${searchParams.toString()}`;
}
