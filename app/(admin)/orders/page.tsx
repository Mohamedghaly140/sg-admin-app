import OrdersFeature from "@/features/orders";
import { loadOrdersParams } from "@/features/orders/hooks/use-orders-params";

type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await loadOrdersParams.parse(searchParams);

  return <OrdersFeature searchParams={params} />;
}
