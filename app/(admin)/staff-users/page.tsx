import { LucideUserCog } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function StaffUsersPage() {
  return (
    <EmptyState
      icon={<LucideUserCog className="size-6" />}
      title="Staff users"
      description="Coming soon."
    />
  );
}
