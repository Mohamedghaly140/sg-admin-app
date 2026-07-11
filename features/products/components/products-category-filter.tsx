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
import type { ProductCategoryOption } from "../queries/get-product-filter-options";

type ProductsCategoryFilterProps = {
  categories: ProductCategoryOption[];
};

export function ProductsCategoryFilter({
  categories,
}: ProductsCategoryFilterProps) {
  const [{ categoryId }, setParams] = useProductsParams();
  const options = [
    { value: "", label: "All categories" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  function handleValueChange(value: string | null) {
    void setParams({ categoryId: value ?? "", page: 1 });
  }

  return (
    <Select items={options} value={categoryId} onValueChange={handleValueChange}>
      <SelectTrigger aria-label="Filter products by category" className="w-full sm:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
