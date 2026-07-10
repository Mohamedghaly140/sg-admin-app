import { LucideShirt } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function NewProductPage() {
  return (
    <EmptyState
      icon={<LucideShirt className="size-6" />}
      title="New product"
      description="Coming soon."
    />
  );
}
