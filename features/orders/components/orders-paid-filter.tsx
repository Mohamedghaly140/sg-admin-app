"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useOrdersParams } from "../hooks/use-orders-params";

const paidOptions = [
  { value: "", label: "All payment states" },
  { value: "true", label: "Paid" },
  { value: "false", label: "Unpaid" },
] as const;

export function OrdersPaidFilter() {
  const [{ isPaid }, setParams] = useOrdersParams();

  function handleValueChange(value: string | null) {
    void setParams({
      isPaid: value === "true" || value === "false" ? value : "",
      page: 1,
    });
  }

  return (
    <Select items={paidOptions} value={isPaid} onValueChange={handleValueChange}>
      <SelectTrigger aria-label="Filter orders by paid state" className="w-full sm:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {paidOptions.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
