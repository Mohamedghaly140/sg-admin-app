import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { handleAuthError } from "@/lib/api/handle-auth-error";
import { formatDateTime } from "@/lib/format";

import { OrderCustomerPanel } from "./components/order-customer-panel";
import { OrderItemsTable } from "./components/order-items-table";
import { MarkOrderPaidButton } from "./components/mark-order-paid-button";
import { OrderStatusControl } from "./components/order-status-control";
import { OrderTotalsCard } from "./components/order-totals-card";
import { getOrder } from "./queries/get-order";

type OrderDetailFeatureProps = {
  orderId: string;
};

export default async function OrderDetailFeature({
  orderId,
}: OrderDetailFeatureProps) {
  let response: Awaited<ReturnType<typeof getOrder>>;

  try {
    response = await getOrder(orderId);
  } catch (error) {
    handleAuthError(error);
  }

  const { data: order } = response;

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-base font-medium">{order.humanOrderId}</h1>
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge isPaid={order.isPaid} />
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Payment method</dt>
            <dd>{order.paymentMethod}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Created</dt>
            <dd>{formatDateTime(order.createdAt)}</dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <OrderCustomerPanel order={order} />
        <OrderTotalsCard order={order} />
      </div>

      <OrderItemsTable items={order.items} />

      <section aria-label="Order actions" className="flex flex-wrap gap-2">
        <OrderStatusControl
          orderId={order.id}
          currentStatus={order.status}
          isPaid={order.isPaid}
          paymentMethod={order.paymentMethod}
        />
        <MarkOrderPaidButton
          orderId={order.id}
          status={order.status}
          isPaid={order.isPaid}
          paymentMethod={order.paymentMethod}
        />
      </section>
    </section>
  );
}
