"use client";

import { LucideSearch } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useProductsParams } from "../hooks/use-products-params";

export function ProductsSearch() {
  const [{ search }, setParams] = useProductsParams();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    void setParams({ search: event.target.value, page: 1 });
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <LucideSearch
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={search}
        onChange={handleChange}
        placeholder="Search products"
        aria-label="Search products"
        className="pl-8"
      />
    </div>
  );
}
