import { auth } from "@clerk/nextjs/server";
import { LucideUserCog } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { handleAuthError } from "@/lib/api/handle-auth-error";
import { redirectToLastPageIfOutOfRange } from "@/lib/pagination";

import { StaffUserCreateDialog } from "./components/staff-user-create-dialog";
import { StaffUsersActiveFilter } from "./components/staff-users-active-filter";
import { StaffUsersPagination } from "./components/staff-users-pagination";
import { StaffUsersRoleFilter } from "./components/staff-users-role-filter";
import { StaffUsersSearch } from "./components/staff-users-search";
import { StaffUsersTable } from "./components/staff-users-table";
import {
  buildStaffUsersHref,
  type StaffUsersParams,
} from "./hooks/use-staff-users-params";
import { getActiveAdminCount } from "./queries/get-active-admin-count";
import { getStaffUsers } from "./queries/get-staff-users";

type StaffUsersFeatureProps = {
  searchParams: StaffUsersParams;
};

export default async function StaffUsersFeature({
  searchParams,
}: StaffUsersFeatureProps) {
  const { userId } = await auth();
  const [response, activeAdminCount] = await Promise.all([
    loadStaffUsers(searchParams),
    loadActiveAdminCount(),
  ]);
  const { data: users, meta } = response;
  redirectToLastPageIfOutOfRange(meta, (page) =>
    buildStaffUsersHref({ ...searchParams, page }),
  );
  const hasFilters = Boolean(
    searchParams.search.trim() || searchParams.role || searchParams.active,
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-base font-medium">Staff users</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage accounts across all roles.
            </p>
          </div>
          <StaffUserCreateDialog />
        </header>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <StaffUsersSearch />
          <StaffUsersRoleFilter />
          <StaffUsersActiveFilter />
        </div>
      </div>

      {users.length > 0 ? (
        <>
          <StaffUsersTable
            users={users}
            currentUserId={userId}
            activeAdminCount={activeAdminCount}
          />
          <StaffUsersPagination meta={meta} params={searchParams} />
        </>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucideUserCog className="size-5" aria-hidden="true" />}
            title={
              hasFilters
                ? "No users match your filters"
                : "No users found"
            }
            description={
              hasFilters
                ? "Try adjusting your search or filters."
                : "User accounts will appear here after they are created."
            }
          />
        </div>
      )}
    </section>
  );
}

async function loadStaffUsers(searchParams: StaffUsersParams) {
  try {
    return await getStaffUsers(searchParams);
  } catch (error) {
    handleAuthError(error);
  }
}

async function loadActiveAdminCount() {
  try {
    return await getActiveAdminCount();
  } catch (error) {
    handleAuthError(error);
  }
}
