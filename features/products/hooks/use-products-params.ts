import { debounce, useQueryStates } from "nuqs";
import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const productStatusValues = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export const featuredFilterValues = ["true", "false"] as const;

const productStatusFilterValues = ["", ...productStatusValues] as const;
const optionalFeaturedFilterValues = ["", ...featuredFilterValues] as const;

export const productsParams = {
  search: parseAsString.withDefault(""),
  status: parseAsStringLiteral(productStatusFilterValues).withDefault(""),
  categoryId: parseAsString.withDefault(""),
  featured: parseAsStringLiteral(optionalFeaturedFilterValues).withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};

export const loadProductsParams = createSearchParamsCache(productsParams);
export const serializeProductsParams = createSerializer(productsParams);

export type ProductsParams = Awaited<
  ReturnType<typeof loadProductsParams.parse>
>;

export function buildProductsHref(params: ProductsParams): string {
  return `/products${serializeProductsParams(params)}`;
}

export function useProductsParams() {
  return useQueryStates(productsParams, {
    shallow: false,
    limitUrlUpdates: debounce(300),
  });
}
