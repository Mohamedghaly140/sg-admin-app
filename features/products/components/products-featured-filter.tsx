"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProductsParams } from "../hooks/use-products-params";

const featuredOptions = [
  { value: "", label: "All" },
  { value: "true", label: "Featured" },
  { value: "false", label: "Not featured" },
] as const;

export function ProductsFeaturedFilter() {
  const [{ featured }, setParams] = useProductsParams();

  function handleValueChange(value: string | null) {
    void setParams({
      featured: value === "true" || value === "false" ? value : "",
      page: 1,
    });
  }

  return (
    <Select items={featuredOptions} value={featured} onValueChange={handleValueChange}>
      <SelectTrigger aria-label="Filter products by featured status" className="w-full sm:w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {featuredOptions.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
