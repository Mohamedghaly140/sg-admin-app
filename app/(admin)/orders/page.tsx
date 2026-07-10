import { LucideShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function OrdersPage() {
  return (
    <EmptyState
      icon={<LucideShoppingCart className="size-6" />}
      title="Orders"
      description="Coming soon."
    />
  );
}
