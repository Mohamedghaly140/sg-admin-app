import { debounce, useQueryStates } from "nuqs";
import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

const roleFilterValues = ["", "USER", "MANAGER", "ADMIN"] as const;
const activeFilterValues = ["", "true", "false"] as const;

export const staffUsersParams = {
  search: parseAsString.withDefault(""),
  role: parseAsStringLiteral(roleFilterValues).withDefault(""),
  active: parseAsStringLiteral(activeFilterValues).withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};

export const loadStaffUsersParams =
  createSearchParamsCache(staffUsersParams);
export const serializeStaffUsersParams = createSerializer(staffUsersParams);

export type StaffUsersParams = Awaited<
  ReturnType<typeof loadStaffUsersParams.parse>
>;

export function buildStaffUsersHref(params: StaffUsersParams): string {
  return `/staff-users${serializeStaffUsersParams(params)}`;
}

export function useStaffUsersParams() {
  return useQueryStates(staffUsersParams, {
    shallow: false,
    limitUrlUpdates: debounce(300),
  });
}
