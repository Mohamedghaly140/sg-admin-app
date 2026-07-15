import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Skeleton className="h-8 w-full sm:w-80" />
          <Skeleton className="h-8 w-full sm:w-40" />
          <Skeleton className="h-8 w-full sm:w-44" />
          <Skeleton className="h-8 w-full sm:w-36" />
          <Skeleton className="h-8 w-full sm:w-64" />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <div className="grid min-w-256 grid-cols-[7rem_1fr_7rem_9rem_5rem_5rem_7rem_9rem] gap-2 border-b p-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-16" />
          ))}
        </div>
        <div className="divide-y overflow-x-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid min-w-256 grid-cols-[7rem_1fr_7rem_9rem_5rem_5rem_7rem_9rem] items-center gap-2 p-2"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
