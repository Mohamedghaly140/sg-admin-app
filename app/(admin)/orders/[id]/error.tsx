"use client";

import { useEffect } from "react";
import { LucideTriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function OrderDetailError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <EmptyState
        icon={<LucideTriangleAlert className="size-6" aria-hidden="true" />}
        title="Couldn't load this order"
        description="An unexpected error occurred while loading this order. Please try again."
        action={<Button onClick={() => unstable_retry()}>Try again</Button>}
      />
    </div>
  );
}
