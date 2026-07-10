import { LucideUsers } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function CustomersPage() {
  return (
    <EmptyState
      icon={<LucideUsers className="size-6" />}
      title="Customers"
      description="Coming soon."
    />
  );
}
