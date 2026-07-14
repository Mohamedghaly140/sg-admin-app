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

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
] as const;

export function OrdersStatusFilter() {
  const [{ status }, setParams] = useOrdersParams();

  function handleValueChange(value: string | null) {
    void setParams({ status: toOrderStatusFilter(value), page: 1 });
  }

  return (
    <Select items={statusOptions} value={status} onValueChange={handleValueChange}>
      <SelectTrigger aria-label="Filter orders by status" className="w-full sm:w-40">
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

function toOrderStatusFilter(value: string | null) {
  switch (value) {
    case "PENDING":
    case "PROCESSING":
    case "SHIPPED":
    case "DELIVERED":
    case "CANCELLED":
    case "REFUNDED":
      return value;
    default:
      return "";
  }
}
