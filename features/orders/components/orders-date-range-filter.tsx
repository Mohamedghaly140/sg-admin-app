"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { LucideCalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useOrdersParams } from "../hooks/use-orders-params";

const DATE_PARAM_FORMAT = "yyyy-MM-dd";

export function OrdersDateRangeFilter() {
  const [{ from, to }, setParams] = useOrdersParams();
  const [open, setOpen] = React.useState(false);
  const [pendingRange, setPendingRange] = React.useState<DateRange>();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setPendingRange(toDateRange(from, to));
    }
  }

  function handleSelect(range: DateRange | undefined) {
    setPendingRange(range);

    if (range?.from && range.to) {
      void setParams({
        from: format(range.from, DATE_PARAM_FORMAT),
        to: format(range.to, DATE_PARAM_FORMAT),
        page: 1,
      });
      setOpen(false);
    }
  }

  function handleClear() {
    setPendingRange(undefined);
    void setParams({ from: "", to: "", page: 1 });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!from && !to}
            className="w-full justify-start font-normal data-[empty=true]:text-muted-foreground sm:w-64"
          />
        }
      >
        <LucideCalendarDays data-icon="inline-start" aria-hidden="true" />
        {formatDateRangeLabel(from, to)}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={pendingRange}
          defaultMonth={pendingRange?.from}
          onSelect={handleSelect}
          resetOnSelect
          autoFocus
        />
        <div className="flex justify-end px-3 pb-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!from && !to && !pendingRange?.from}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function toDateRange(from: string, to: string): DateRange | undefined {
  const fromDate = parseDateOnly(from);
  if (!fromDate) {
    return undefined;
  }

  return { from: fromDate, to: parseDateOnly(to) };
}

function formatDateRangeLabel(from: string, to: string): string {
  const fromDate = parseDateOnly(from);
  const toDate = parseDateOnly(to);

  if (fromDate && toDate) {
    return `${format(fromDate, "MMM d, yyyy")} – ${format(toDate, "MMM d, yyyy")}`;
  }
  if (fromDate) {
    return `From ${format(fromDate, "MMM d, yyyy")}`;
  }
  if (toDate) {
    return `Until ${format(toDate, "MMM d, yyyy")}`;
  }

  return "Date range";
}

function parseDateOnly(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = parse(value, DATE_PARAM_FORMAT, new Date());
  return isValid(date) && format(date, DATE_PARAM_FORMAT) === value
    ? date
    : undefined;
}
