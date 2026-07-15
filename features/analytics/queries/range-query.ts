import type { AnalyticsParams } from "../hooks/use-analytics-params";

export type AnalyticsRangeParams = Pick<AnalyticsParams, "from" | "to">;

export function toRangeQuery(params: AnalyticsRangeParams): string {
  const searchParams = new URLSearchParams();

  if (params.from) {
    searchParams.set("from", params.from);
  }
  if (params.to) {
    searchParams.set("to", params.to);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
