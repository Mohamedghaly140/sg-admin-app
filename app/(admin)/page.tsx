import { LucideLayoutDashboard } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function DashboardPage() {
  return (
    <EmptyState
      icon={<LucideLayoutDashboard className="size-6" />}
      title="Dashboard"
      description="Coming soon."
    />
  );
}
