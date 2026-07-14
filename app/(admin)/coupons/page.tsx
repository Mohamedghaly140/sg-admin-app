import CouponsFeature from "@/features/coupons";
import { loadCouponsParams } from "@/features/coupons/hooks/use-coupons-params";

type CouponsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CouponsPage({
  searchParams,
}: CouponsPageProps) {
  const params = await loadCouponsParams.parse(searchParams);

  return <CouponsFeature searchParams={params} />;
}
