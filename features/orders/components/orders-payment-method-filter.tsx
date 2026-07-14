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

const paymentMethodOptions = [
  { value: "", label: "All methods" },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
] as const;

export function OrdersPaymentMethodFilter() {
  const [{ paymentMethod }, setParams] = useOrdersParams();

  function handleValueChange(value: string | null) {
    void setParams({
      paymentMethod: value === "CASH" || value === "CARD" ? value : "",
      page: 1,
    });
  }

  return (
    <Select
      items={paymentMethodOptions}
      value={paymentMethod}
      onValueChange={handleValueChange}
    >
      <SelectTrigger aria-label="Filter orders by payment method" className="w-full sm:w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {paymentMethodOptions.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
