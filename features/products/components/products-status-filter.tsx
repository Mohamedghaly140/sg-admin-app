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

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export function ProductsStatusFilter() {
  const [{ status }, setParams] = useProductsParams();

  function handleValueChange(value: string | null) {
    void setParams({
      status: value === "DRAFT" || value === "ACTIVE" || value === "ARCHIVED" ? value : "",
      page: 1,
    });
  }

  return (
    <Select items={statusOptions} value={status} onValueChange={handleValueChange}>
      <SelectTrigger aria-label="Filter products by status" className="w-full sm:w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statusOptions.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
