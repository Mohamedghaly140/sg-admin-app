import { LucideTruck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function ShippingZonesPage() {
  return (
    <EmptyState
      icon={<LucideTruck className="size-6" />}
      title="Shipping zones"
      description="Coming soon."
    />
  );
}
