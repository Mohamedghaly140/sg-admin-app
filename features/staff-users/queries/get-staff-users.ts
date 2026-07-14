import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { StaffUsersParams } from "../hooks/use-staff-users-params";
import type { StaffUser } from "../types";

export const getStaffUsers = cache((params: StaffUsersParams) =>
  apiFetch<StaffUser[]>(`/admin/users?${toSearchParams(params)}`),
);

function toSearchParams(params: StaffUsersParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  const search = params.search.trim().slice(0, 100);
  if (search) {
    searchParams.set("search", search);
  }
  if (params.role) {
    searchParams.set("role", params.role);
  }
  if (params.active) {
    searchParams.set("active", params.active);
  }

  return searchParams.toString();
}
