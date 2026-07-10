import { LucideTicket } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function CouponsPage() {
  return (
    <EmptyState
      icon={<LucideTicket className="size-6" />}
      title="Coupons"
      description="Coming soon."
    />
  );
}
