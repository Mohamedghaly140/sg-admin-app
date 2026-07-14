import "server-only";

import { cache } from "react";

import { apiFetch } from "@/lib/api/http";

import type { StaffUser } from "../types";

export const getActiveAdminCount = cache(async (): Promise<number> => {
  const { meta } = await apiFetch<StaffUser[]>(
    "/admin/users?role=ADMIN&active=true&limit=1",
  );

  if (!meta) {
    throw new Error("expected pagination meta");
  }

  return meta.totalItems;
});
