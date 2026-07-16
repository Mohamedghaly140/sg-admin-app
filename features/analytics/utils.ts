import { format, isValid, parseISO, subDays } from "date-fns";

import { formatDayMonth, formatMonthYear } from "@/lib/format";

import type { AnalyticsGrouping } from "./types";

const DATE_PARAM_FORMAT = "yyyy-MM-dd";

export type AnalyticsPreset = "7" | "30" | "90";

export function computeRange(
  preset: AnalyticsPreset,
  today = new Date(),
): { from: string; to: string } {
  const days = Number(preset);

  return {
    from: format(subDays(today, days - 1), DATE_PARAM_FORMAT),
    to: format(today, DATE_PARAM_FORMAT),
  };
}

export function formatGroupingAxisLabel(
  value: string,
  grouping: AnalyticsGrouping,
): string {
  if (!isValid(parseISO(value))) {
    return value;
  }

  return grouping === "month" ? formatMonthYear(value) : formatDayMonth(value);
}
