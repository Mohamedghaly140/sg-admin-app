import { LucideShoppingCart } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { handleAuthError } from "@/lib/api/handle-auth-error";

import { OrdersDateRangeFilter } from "./components/orders-date-range-filter";
import { OrdersPagination } from "./components/orders-pagination";
import { OrdersPaidFilter } from "./components/orders-paid-filter";
import { OrdersPaymentMethodFilter } from "./components/orders-payment-method-filter";
import { OrdersSearch } from "./components/orders-search";
import { OrdersStatusFilter } from "./components/orders-status-filter";
import { OrdersTable } from "./components/orders-table";
import type { OrdersParams } from "./hooks/use-orders-params";
import { getOrders } from "./queries/get-orders";

type OrdersFeatureProps = {
  searchParams: OrdersParams;
};

export default async function OrdersFeature({
  searchParams,
}: OrdersFeatureProps) {
  let response: Awaited<ReturnType<typeof getOrders>>;

  try {
    response = await getOrders(searchParams);
  } catch (error) {
    handleAuthError(error);
  }

  const { data: orders, meta } = response;
  const hasFilters = Boolean(
    searchParams.search.trim() ||
      searchParams.status ||
      searchParams.paymentMethod ||
      searchParams.isPaid ||
      searchParams.from ||
      searchParams.to,
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-base font-medium">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage customer orders.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <OrdersSearch />
          <OrdersStatusFilter />
          <OrdersPaidFilter />
          <OrdersPaymentMethodFilter />
          <OrdersDateRangeFilter />
        </div>
      </div>

      {orders.length > 0 ? (
        <>
          <OrdersTable orders={orders} />
          <OrdersPagination meta={meta} params={searchParams} />
        </>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucideShoppingCart className="size-5" aria-hidden="true" />}
            title={
              hasFilters ? "No orders match your filters" : "No orders found"
            }
            description={
              hasFilters
                ? "Try adjusting your search or filters."
                : "New orders will appear here after customers place them."
            }
          />
        </div>
      )}
    </section>
  );
}
