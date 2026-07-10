import { LucideShirt } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function ProductsPage() {
  return (
    <EmptyState
      icon={<LucideShirt className="size-6" />}
      title="Products"
      description="Coming soon."
    />
  );
}
