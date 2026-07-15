import { Skeleton } from "@/components/ui/skeleton";

export default function ShippingZonesLoading() {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-8 w-full sm:w-80" />
          <Skeleton className="h-8 w-full sm:w-28" />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <div className="grid min-w-224 grid-cols-[7rem_1fr_1.25fr_7rem_6rem_9rem_4rem] gap-2 border-b p-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-16" />
          ))}
        </div>
        <div className="divide-y overflow-x-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid min-w-224 grid-cols-[7rem_1fr_1.25fr_7rem_6rem_9rem_4rem] items-center gap-2 p-2"
            >
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ml-auto size-8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
