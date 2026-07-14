import Link from "next/link";

import type { PageMeta } from "@/lib/api/http";

import {
  buildStaffUsersHref,
  type StaffUsersParams,
} from "../hooks/use-staff-users-params";

type StaffUsersPaginationProps = {
  meta?: PageMeta;
  params: StaffUsersParams;
};

export function StaffUsersPagination({
  meta,
  params,
}: StaffUsersPaginationProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-3 text-sm"
      aria-label="Staff users pagination"
    >
      <p className="text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </p>
      <div className="flex gap-2">
        {meta.hasPrev ? (
          <Link
            href={buildStaffUsersHref({ ...params, page: meta.page - 1 })}
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
            href={buildStaffUsersHref({ ...params, page: meta.page + 1 })}
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
