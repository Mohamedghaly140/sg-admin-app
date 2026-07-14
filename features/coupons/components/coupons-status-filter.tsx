"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCouponsParams } from "../hooks/use-coupons-params";

const statusOptions = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "exhausted", label: "Exhausted" },
  { value: "deactivated", label: "Deactivated" },
] as const;

export function CouponsStatusFilter() {
  const [{ status }, setParams] = useCouponsParams();

  function handleValueChange(value: string | null) {
    void setParams({
      status:
        value === "active" ||
        value === "expired" ||
        value === "exhausted" ||
        value === "deactivated"
          ? value
          : "",
      page: 1,
    });
  }

  return (
    <Select
      items={statusOptions}
      value={status}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        aria-label="Filter coupons by status"
        className="w-full sm:w-40"
      >
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
