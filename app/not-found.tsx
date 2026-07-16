import Link from "next/link";
import { LucideFileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-2 px-4">
      <EmptyState
        icon={<LucideFileQuestion className="size-6" />}
        title="Page not found"
        description="The page you're looking for doesn't exist."
        action={
          <Link href="/" className={buttonVariants()}>
            Go home
          </Link>
        }
      />
    </main>
  );
}
