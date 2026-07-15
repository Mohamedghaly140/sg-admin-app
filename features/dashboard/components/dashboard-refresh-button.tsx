"use client";

import { LucideRefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function DashboardRefreshButton() {
  const router = useRouter();

  function handleRefresh() {
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleRefresh}>
      <LucideRefreshCw data-icon="inline-start" aria-hidden="true" />
      Refresh
    </Button>
  );
}
