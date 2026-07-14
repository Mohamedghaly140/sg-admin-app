import { handleAuthError } from "@/lib/api/handle-auth-error";

import { CustomerActions } from "./components/customer-actions";
import { CustomerAddresses } from "./components/customer-addresses";
import { CustomerOrdersTable } from "./components/customer-orders-table";
import { CustomerProfileCard } from "./components/customer-profile-card";
import { getCustomer } from "./queries/get-customer";

type CustomerDetailFeatureProps = {
  customerId: string;
};

export default async function CustomerDetailFeature({
  customerId,
}: CustomerDetailFeatureProps) {
  let response: Awaited<ReturnType<typeof getCustomer>>;

  try {
    response = await getCustomer(customerId);
  } catch (error) {
    handleAuthError(error);
  }

  const { data: customer } = response;

  return (
    <section className="flex flex-col gap-4">
      <header>
        <h1 className="text-base font-medium">{customer.name}</h1>
        <p className="text-sm text-muted-foreground">
          Customer profile, saved addresses, and order history.
        </p>
      </header>

      <CustomerProfileCard customer={customer} />
      <CustomerActions
        customerId={customer.id}
        customerName={customer.name}
        active={customer.active}
      />
      <CustomerAddresses addresses={customer.addresses} />
      <CustomerOrdersTable orders={customer.orders} />
    </section>
  );
}
