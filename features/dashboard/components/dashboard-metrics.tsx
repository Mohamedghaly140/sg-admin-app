"use client";

import type { ReactNode } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { DashboardRefreshButton } from "./dashboard-refresh-button";

type DashboardMetricsProps = {
  asOf: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function DashboardMetrics({
  asOf,
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
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            As of {formatDate(asOf)}
          </p>
          <DashboardRefreshButton
            isPending={isPending}
            onRefresh={handleRefresh}
          />
        </div>
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
