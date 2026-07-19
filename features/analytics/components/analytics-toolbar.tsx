"use client";

import * as React from "react";
import { format, isValid, parse, subDays } from "date-fns";
import { LucideCalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/format";

import type {
  AnalyticsParamsState,
  SetAnalyticsParams,
} from "../hooks/use-analytics-params";
import { computeRange, type AnalyticsPreset } from "../utils";

const DATE_PARAM_FORMAT = "yyyy-MM-dd";

type AnalyticsToolbarProps = {
  asOf: string;
  params: AnalyticsParamsState;
  setParams: SetAnalyticsParams;
};

type PresetButtonProps = {
  isActive: boolean;
  onSelectPreset: (preset: AnalyticsPreset) => void;
  preset: AnalyticsPreset;
};

const analyticsPresets = ["7", "30", "90"] as const satisfies readonly AnalyticsPreset[];

export function AnalyticsToolbar({
  asOf,
  params,
  setParams,
}: AnalyticsToolbarProps) {
  const [open, setOpen] = React.useState(false);
  const [pendingRange, setPendingRange] = React.useState<DateRange>();
  const [presetAnchor, setPresetAnchor] = React.useState(asOf);
  const selectedPreset = activePreset(params, presetAnchor);

  function handlePresetSelect(preset: AnalyticsPreset) {
    const anchor = new Date();
    setPresetAnchor(format(anchor, DATE_PARAM_FORMAT));
    void setParams(computeRange(preset, anchor));
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setPendingRange(toDateRange(params.from, params.to));
    }
  }

  function handleSelect(range: DateRange | undefined) {
    setPendingRange(range);

    if (!range?.from || !range.to) {
      return;
    }

    const from = format(range.from, DATE_PARAM_FORMAT);
    const to = format(range.to, DATE_PARAM_FORMAT);
    if (!parseDateOnly(from) || !parseDateOnly(to)) {
      return;
    }

    void setParams({ from, to });
    setOpen(false);
  }

  function handleClear() {
    setPendingRange(undefined);
    void setParams({ from: "", to: "" });
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              data-empty={!params.from && !params.to}
              className="w-full justify-start font-normal data-[empty=true]:text-muted-foreground sm:w-64"
            />
          }
        >
          <LucideCalendarDays data-icon="inline-start" aria-hidden="true" />
          {formatDateRangeLabel(params.from, params.to, asOf)}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
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
              disabled={
                !params.from && !params.to && !pendingRange?.from
              }
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Date range presets</legend>
        {analyticsPresets.map((preset) => (
          <PresetButton
            key={preset}
            isActive={selectedPreset === preset}
            onSelectPreset={handlePresetSelect}
            preset={preset}
          />
        ))}
      </fieldset>
    </div>
  );
}

function PresetButton({
  isActive,
  onSelectPreset,
  preset,
}: PresetButtonProps) {
  function handleClick() {
    onSelectPreset(preset);
  }

  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="sm"
      aria-pressed={isActive}
      onClick={handleClick}
    >
      Last {preset} days
    </Button>
  );
}

function activePreset(
  params: Pick<AnalyticsParamsState, "from" | "to">,
  anchorValue: string,
): AnalyticsPreset | null {
  const anchor = parseDateOnly(anchorValue);
  if (!anchor) {
    return null;
  }

  return (
    analyticsPresets.find((preset) => {
      const range = computeRange(preset, anchor);
      return params.from === range.from && params.to === range.to;
    }) ?? null
  );
}

function toDateRange(from: string, to: string): DateRange | undefined {
  const fromDate = parseDateOnly(from);
  if (!fromDate) {
    return undefined;
  }

  return { from: fromDate, to: parseDateOnly(to) };
}

function formatDateRangeLabel(
  from: string,
  to: string,
  asOf: string,
): string {
  const hasFrom = Boolean(parseDateOnly(from));
  const hasTo = Boolean(parseDateOnly(to));

  if (hasFrom && hasTo) {
    return `${formatDate(from)} – ${formatDate(to)}`;
  }
  if (hasFrom) {
    return `From ${formatDate(from)}`;
  }
  if (hasTo) {
    return `Until ${formatDate(to)}`;
  }

  const anchor = parse(asOf, DATE_PARAM_FORMAT, new Date());
  const start = format(subDays(anchor, 30), DATE_PARAM_FORMAT);

  return `${formatDate(start)} – ${formatDate(asOf)}`;
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
