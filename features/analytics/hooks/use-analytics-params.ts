import type { TransitionStartFunction } from "react";
import { useQueryStates } from "nuqs";
import {
  createSearchParamsCache,
  createSerializer,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const analyticsTabValues = [
  "sales",
  "products",
  "customers",
  "coupons",
  "geography",
] as const;

export type AnalyticsTab = (typeof analyticsTabValues)[number];

export const analyticsParams = {
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  tab: parseAsStringLiteral(analyticsTabValues).withDefault("sales"),
};

export const loadAnalyticsParams = createSearchParamsCache(analyticsParams);
export const serializeAnalyticsParams = createSerializer(analyticsParams);

export type AnalyticsParams = Awaited<
  ReturnType<typeof loadAnalyticsParams.parse>
>;

type UseAnalyticsParamsOptions = {
  startTransition?: TransitionStartFunction;
};

export function useAnalyticsParams(options: UseAnalyticsParamsOptions = {}) {
  return useQueryStates(analyticsParams, {
    shallow: false,
    startTransition: options.startTransition,
  });
}

export type AnalyticsParamsState = ReturnType<typeof useAnalyticsParams>[0];
export type SetAnalyticsParams = ReturnType<typeof useAnalyticsParams>[1];
