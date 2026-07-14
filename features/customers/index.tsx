import { LucideUsers } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { handleAuthError } from "@/lib/api/handle-auth-error";

import { CustomersActiveFilter } from "./components/customers-active-filter";
import { CustomersPagination } from "./components/customers-pagination";
import { CustomersSearch } from "./components/customers-search";
import { CustomersTable } from "./components/customers-table";
import type { CustomersParams } from "./hooks/use-customers-params";
import { getCustomers } from "./queries/get-customers";

type CustomersFeatureProps = {
  searchParams: CustomersParams;
};

export default async function CustomersFeature({
  searchParams,
}: CustomersFeatureProps) {
  let response: Awaited<ReturnType<typeof getCustomers>>;

  try {
    response = await getCustomers(searchParams);
  } catch (error) {
    handleAuthError(error);
  }

  const { data: customers, meta } = response;
  const hasFilters = Boolean(searchParams.search.trim() || searchParams.active);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-base font-medium">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage customer accounts.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <CustomersSearch />
          <CustomersActiveFilter />
        </div>
      </div>

      {customers.length > 0 ? (
        <>
          <CustomersTable customers={customers} />
          <CustomersPagination meta={meta} params={searchParams} />
        </>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucideUsers className="size-5" aria-hidden="true" />}
            title={
              hasFilters
                ? "No customers match your filters"
                : "No customers found"
            }
            description={
              hasFilters
                ? "Try adjusting your search or filters."
                : "Customer accounts will appear here after they register."
            }
          />
        </div>
      )}
    </section>
  );
}
