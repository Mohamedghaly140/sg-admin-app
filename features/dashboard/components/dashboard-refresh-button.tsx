"use client";

import { LucideLoader2, LucideRefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type DashboardRefreshButtonProps = {
  isPending: boolean;
  onRefresh: () => void;
};

export function DashboardRefreshButton({
  isPending,
  onRefresh,
}: DashboardRefreshButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={onRefresh}
    >
      {isPending ? (
        <LucideLoader2
          data-icon="inline-start"
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        <LucideRefreshCw data-icon="inline-start" aria-hidden="true" />
      )}
      {isPending ? "Updating..." : "Refresh"}
    </Button>
  );
}
