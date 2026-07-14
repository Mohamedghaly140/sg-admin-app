"use client";

import { LucideSearch } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useShippingZonesParams } from "../hooks/use-shipping-zones-params";

export function ShippingZonesSearch() {
  const [{ search }, setParams] = useShippingZonesParams();

  return (
    <div className="relative w-full sm:max-w-xs">
      <LucideSearch
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={search}
        maxLength={100}
        onChange={(event) => {
          void setParams({ search: event.target.value, page: 1 });
        }}
        placeholder="Search zones"
        aria-label="Search shipping zones"
        className="pl-8"
      />
    </div>
  );
}
