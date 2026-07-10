import { debounce, useQueryStates } from "nuqs";
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";

export const categoriesParams = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};

export const loadCategoriesParams = createSearchParamsCache(categoriesParams);

export type CategoriesParams = Awaited<
  ReturnType<typeof loadCategoriesParams.parse>
>;

export function useCategoriesParams() {
  return useQueryStates(categoriesParams, {
    shallow: false,
    limitUrlUpdates: debounce(300),
  });
}
