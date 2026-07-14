import { debounce, useQueryStates } from "nuqs";
import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const orderStatusValues = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;
export const paymentMethodValues = ["CASH", "CARD"] as const;
export const paidFilterValues = ["true", "false"] as const;

const orderStatusFilterValues = ["", ...orderStatusValues] as const;
const paymentMethodFilterValues = ["", ...paymentMethodValues] as const;
const optionalPaidFilterValues = ["", ...paidFilterValues] as const;

export const ordersParams = {
  search: parseAsString.withDefault(""),
  status: parseAsStringLiteral(orderStatusFilterValues).withDefault(""),
  paymentMethod: parseAsStringLiteral(paymentMethodFilterValues).withDefault(""),
  isPaid: parseAsStringLiteral(optionalPaidFilterValues).withDefault(""),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};

export const loadOrdersParams = createSearchParamsCache(ordersParams);
export const serializeOrdersParams = createSerializer(ordersParams);

export type OrdersParams = Awaited<ReturnType<typeof loadOrdersParams.parse>>;

export function useOrdersParams() {
  return useQueryStates(ordersParams, {
    shallow: false,
    limitUrlUpdates: debounce(300),
  });
}
