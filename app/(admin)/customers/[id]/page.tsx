import { LucideUsers } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function CustomerDetailPage() {
  return (
    <EmptyState
      icon={<LucideUsers className="size-6" />}
      title="Customer detail"
      description="Coming soon."
    />
  );
}
