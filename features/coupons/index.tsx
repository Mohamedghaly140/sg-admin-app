import { LucidePlus, LucideTicket } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { handleAuthError } from "@/lib/api/handle-auth-error";

import { CouponFormDialog } from "./components/coupon-form-dialog";
import { CouponsPagination } from "./components/coupons-pagination";
import { CouponsSearch } from "./components/coupons-search";
import { CouponsStatusFilter } from "./components/coupons-status-filter";
import { CouponsTable } from "./components/coupons-table";
import type { CouponsParams } from "./hooks/use-coupons-params";
import { getCoupons } from "./queries/get-coupons";

type CouponsFeatureProps = {
  searchParams: CouponsParams;
};

export default async function CouponsFeature({
  searchParams,
}: CouponsFeatureProps) {
  let response: Awaited<ReturnType<typeof getCoupons>>;

  try {
    response = await getCoupons(searchParams);
  } catch (error) {
    handleAuthError(error);
  }

  const { data: coupons, meta } = response;
  const hasActiveFilters = Boolean(
    searchParams.search.trim() || searchParams.status,
  );
  const newCouponTrigger = (
    <Button type="button">
      <LucidePlus data-icon="inline-start" aria-hidden="true" />
      New coupon
    </Button>
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-medium">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            Create discount codes and track their lifecycle and usage.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <CouponsSearch />
          <CouponsStatusFilter />
          <CouponFormDialog trigger={newCouponTrigger} />
        </div>
      </div>

      {coupons.length > 0 ? (
        <>
          <CouponsTable coupons={coupons} />
          <CouponsPagination meta={meta} params={searchParams} />
        </>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucideTicket className="size-5" aria-hidden="true" />}
            title={
              hasActiveFilters
                ? "No coupons match your filters"
                : "No coupons found"
            }
            description={
              hasActiveFilters
                ? "Try a different code or lifecycle status."
                : "Coupons will appear here after they are created."
            }
            action={<CouponFormDialog trigger={newCouponTrigger} />}
          />
        </div>
      )}
    </section>
  );
}
