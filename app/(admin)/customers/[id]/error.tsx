"use client";

import { useEffect } from "react";
import { LucideTriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function CustomerDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <EmptyState
        icon={<LucideTriangleAlert className="size-6" aria-hidden="true" />}
        title="Couldn't load this customer"
        description="An unexpected error occurred while loading this customer. Please try again."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </div>
  );
}
