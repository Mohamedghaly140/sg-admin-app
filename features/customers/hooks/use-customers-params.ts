import { debounce, useQueryStates } from "nuqs";
import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

const activeFilterValues = ["", "true", "false"] as const;

export const customersParams = {
  search: parseAsString.withDefault(""),
  active: parseAsStringLiteral(activeFilterValues).withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};

export const loadCustomersParams = createSearchParamsCache(customersParams);
export const serializeCustomersParams = createSerializer(customersParams);

export type CustomersParams = Awaited<
  ReturnType<typeof loadCustomersParams.parse>
>;

export function buildCustomersHref(params: CustomersParams): string {
  return `/customers${serializeCustomersParams(params)}`;
}

export function useCustomersParams() {
  return useQueryStates(customersParams, {
    shallow: false,
    limitUrlUpdates: debounce(300),
  });
}
