import { LucidePlus, LucideTruck } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { handleAuthError } from "@/lib/api/handle-auth-error";

import { ShippingZoneFormDialog } from "./components/shipping-zone-form-dialog";
import { ShippingZonesPagination } from "./components/shipping-zones-pagination";
import { ShippingZonesSearch } from "./components/shipping-zones-search";
import { ShippingZonesTable } from "./components/shipping-zones-table";
import type { ShippingZonesParams } from "./hooks/use-shipping-zones-params";
import { getShippingZones } from "./queries/get-shipping-zones";

type ShippingZonesFeatureProps = {
  searchParams: ShippingZonesParams;
};

export default async function ShippingZonesFeature({
  searchParams,
}: ShippingZonesFeatureProps) {
  let response: Awaited<ReturnType<typeof getShippingZones>>;

  try {
    response = await getShippingZones(searchParams);
  } catch (error) {
    handleAuthError(error);
  }

  const { data: zones, meta } = response;
  const hasActiveFilters = Boolean(searchParams.search.trim());
  const newZoneTrigger = (
    <Button type="button">
      <LucidePlus data-icon="inline-start" aria-hidden="true" />
      New zone
    </Button>
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-medium">Shipping zones</h1>
          <p className="text-sm text-muted-foreground">
            Set flat delivery fees per country, governorate, and city.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ShippingZonesSearch />
          <ShippingZoneFormDialog trigger={newZoneTrigger} />
        </div>
      </div>

      {zones.length > 0 ? (
        <>
          <ShippingZonesTable zones={zones} />
          <ShippingZonesPagination meta={meta} params={searchParams} />
        </>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucideTruck className="size-5" aria-hidden="true" />}
            title={
              hasActiveFilters
                ? "No shipping zones match your search"
                : "No shipping zones yet"
            }
            description={
              hasActiveFilters
                ? "Try a different country, governorate, or city."
                : "Customers can't check out without at least one active zone."
            }
            action={<ShippingZoneFormDialog trigger={newZoneTrigger} />}
          />
        </div>
      )}
    </section>
  );
}
