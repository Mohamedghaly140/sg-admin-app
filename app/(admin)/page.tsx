import { Suspense } from "react";

import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import DashboardFeature from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardFeature />
    </Suspense>
  );
}
