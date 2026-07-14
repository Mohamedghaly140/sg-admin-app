import OrderDetailFeature from "@/features/orders/order-detail-feature";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  return <OrderDetailFeature orderId={id} />;
}
