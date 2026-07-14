"use client";

import { LucideSearch } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useCouponsParams } from "../hooks/use-coupons-params";

export function CouponsSearch() {
  const [{ search }, setParams] = useCouponsParams();

  return (
    <div className="relative w-full sm:max-w-xs">
      <LucideSearch
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={search}
        maxLength={30}
        onChange={(event) => {
          void setParams({ search: event.target.value, page: 1 });
        }}
        placeholder="Search coupons"
        aria-label="Search coupons"
        className="pl-8"
      />
    </div>
  );
}
