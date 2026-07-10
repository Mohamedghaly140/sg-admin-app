"use client";

import { LucideSearch } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useCategoriesParams } from "../hooks/use-categories-params";

export function CategoriesSearch() {
  const [{ search }, setParams] = useCategoriesParams();

  return (
    <div className="relative w-full sm:max-w-xs">
      <LucideSearch
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={search}
        onChange={(event) => {
          void setParams({ search: event.target.value, page: 1 });
        }}
        placeholder="Search categories"
        className="pl-8"
      />
    </div>
  );
}
