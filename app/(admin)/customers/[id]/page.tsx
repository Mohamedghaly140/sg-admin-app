import CustomerDetailFeature from "@/features/customers/customer-detail-feature";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;

  return <CustomerDetailFeature customerId={id} />;
}
