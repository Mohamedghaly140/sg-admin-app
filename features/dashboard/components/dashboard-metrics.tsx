"use client";

import type { ReactNode } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { DashboardRefreshButton } from "./dashboard-refresh-button";

type DashboardMetricsProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function DashboardMetrics({
  title,
  subtitle,
  children,
}: DashboardMetricsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-medium">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <DashboardRefreshButton
          isPending={isPending}
          onRefresh={handleRefresh}
        />
      </header>

      <div
        role="region"
        aria-label="Dashboard metrics"
        aria-busy={isPending}
        className={cn(
          "flex flex-col gap-4 transition-opacity",
          isPending && "pointer-events-none opacity-60",
        )}
      >
        {children}
      </div>
    </section>
  );
}
