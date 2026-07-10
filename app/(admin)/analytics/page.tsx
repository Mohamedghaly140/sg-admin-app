import { LucideBarChart3 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function AnalyticsPage() {
  return (
    <EmptyState
      icon={<LucideBarChart3 className="size-6" />}
      title="Analytics"
      description="Coming soon."
    />
  );
}
