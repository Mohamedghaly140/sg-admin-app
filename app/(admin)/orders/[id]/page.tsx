import { LucideShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function OrderDetailPage() {
  return (
    <EmptyState
      icon={<LucideShoppingCart className="size-6" />}
      title="Order detail"
      description="Coming soon."
    />
  );
}
