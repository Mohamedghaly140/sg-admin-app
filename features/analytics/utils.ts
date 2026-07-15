import { format, isValid, parseISO, subDays } from "date-fns";

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
  const date = parseISO(value);

  if (!isValid(date)) {
    return value;
  }

  return format(date, grouping === "month" ? "MMM yyyy" : "MMM d");
}
