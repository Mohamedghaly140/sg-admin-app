import { debounce, useQueryStates } from "nuqs";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const shippingZonesParams = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};

export const loadShippingZonesParams =
  createSearchParamsCache(shippingZonesParams);

export type ShippingZonesParams = Awaited<
  ReturnType<typeof loadShippingZonesParams.parse>
>;

export function useShippingZonesParams() {
  return useQueryStates(shippingZonesParams, {
    shallow: false,
    limitUrlUpdates: debounce(300),
  });
}
