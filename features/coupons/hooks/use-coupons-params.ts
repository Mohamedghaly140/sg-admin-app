import { debounce, useQueryStates } from "nuqs";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const couponStatusValues = [
  "active",
  "expired",
  "exhausted",
  "deactivated",
] as const;

const couponStatusFilterValues = ["", ...couponStatusValues] as const;

export const couponsParams = {
  search: parseAsString.withDefault(""),
  status: parseAsStringLiteral(couponStatusFilterValues).withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};

export const loadCouponsParams = createSearchParamsCache(couponsParams);

export type CouponsParams = Awaited<
  ReturnType<typeof loadCouponsParams.parse>
>;

export function useCouponsParams() {
  return useQueryStates(couponsParams, {
    shallow: false,
    limitUrlUpdates: debounce(300),
  });
}
