"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCustomersParams } from "../hooks/use-customers-params";

const activeOptions = [
  { value: "", label: "All account states" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
] as const;

export function CustomersActiveFilter() {
  const [{ active }, setParams] = useCustomersParams();

  function handleValueChange(value: string | null) {
    void setParams({
      active: value === "true" || value === "false" ? value : "",
      page: 1,
    });
  }

  return (
    <Select
      items={activeOptions}
      value={active}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        aria-label="Filter customers by account state"
        className="w-full sm:w-44"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {activeOptions.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
