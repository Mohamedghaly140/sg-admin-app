import CustomersFeature from "@/features/customers";
import { loadCustomersParams } from "@/features/customers/hooks/use-customers-params";

type CustomersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const params = await loadCustomersParams.parse(searchParams);

  return <CustomersFeature searchParams={params} />;
}
