import { LucideShirt } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function ProductDetailPage() {
  return (
    <EmptyState
      icon={<LucideShirt className="size-6" />}
      title="Product detail"
      description="Coming soon."
    />
  );
}
