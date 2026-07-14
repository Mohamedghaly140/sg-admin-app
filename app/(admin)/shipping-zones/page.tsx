import ShippingZonesFeature from "@/features/shipping-zones";
import { loadShippingZonesParams } from "@/features/shipping-zones/hooks/use-shipping-zones-params";

type ShippingZonesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShippingZonesPage({
  searchParams,
}: ShippingZonesPageProps) {
  const params = await loadShippingZonesParams.parse(searchParams);

  return <ShippingZonesFeature searchParams={params} />;
}
