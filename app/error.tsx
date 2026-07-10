"use client";

import { LucideTriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-2 px-4">
      <EmptyState
        icon={<LucideTriangleAlert className="size-6" />}
        title="Something went wrong"
        description="An unexpected error occurred. Please try again."
        action={<Button onClick={() => reset()}>Try again</Button>}
      />
    </main>
  );
}
