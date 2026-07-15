"use client";

import { LucideLoaderCircle } from "lucide-react";
import { type ReactNode, useTransition } from "react";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import {
  analyticsTabValues,
  type AnalyticsTab,
  useAnalyticsParams,
} from "../hooks/use-analytics-params";
import { AnalyticsTabsNav } from "./analytics-tabs-nav";
import { AnalyticsToolbar } from "./analytics-toolbar";

type AnalyticsShellProps = {
  asOf: string;
  children: ReactNode;
};

export function AnalyticsShell({ asOf, children }: AnalyticsShellProps) {
  const [isPending, startTransition] = useTransition();
  const [params, setParams] = useAnalyticsParams({ startTransition });

  function handleValueChange(value: unknown) {
    if (isAnalyticsTab(value)) {
      void setParams({ tab: value });
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-base font-medium">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Explore sales, products, customers, coupons, and geography.
          </p>
        </div>
        <AnalyticsToolbar asOf={asOf} params={params} setParams={setParams} />
      </header>

      <Tabs
        value={params.tab}
        onValueChange={handleValueChange}
        className="gap-4"
      >
        <AnalyticsTabsNav />
        <TabsContent value={params.tab}>
          <div className="relative text-base" aria-busy={isPending}>
            {isPending ? (
              <div
                role="status"
                aria-label="Updating analytics"
                className="absolute top-2 right-2 rounded-full bg-background/80 p-2 shadow-sm ring-1 ring-foreground/10"
              >
                <LucideLoaderCircle
                  className="size-4 animate-spin text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            ) : null}
            <div
              className={cn(
                "transition-opacity",
                isPending && "pointer-events-none opacity-60",
              )}
            >
              {children}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function isAnalyticsTab(value: unknown): value is AnalyticsTab {
  return (
    typeof value === "string" &&
    analyticsTabValues.some((tab) => tab === value)
  );
}
