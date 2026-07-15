import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Skeleton className="h-8 w-full sm:w-80" />
          <Skeleton className="h-8 w-full sm:w-44" />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <div className="grid min-w-208 grid-cols-[1fr_1.5fr_1fr_6rem_5rem_9rem] gap-2 border-b p-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-16" />
          ))}
        </div>
        <div className="divide-y overflow-x-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid min-w-208 grid-cols-[1fr_1.5fr_1fr_6rem_5rem_9rem] items-center gap-2 p-2"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
