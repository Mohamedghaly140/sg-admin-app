import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-8 w-full sm:w-72" />
          <Skeleton className="h-8 w-full sm:w-36" />
          <Skeleton className="h-8 w-full sm:w-44" />
          <Skeleton className="h-8 w-full sm:w-36" />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <div className="grid min-w-288 grid-cols-[5rem_1.5fr_1fr_1fr_5rem_4rem_6rem_5rem_9rem_4rem] gap-2 border-b p-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-12" />
          ))}
        </div>
        <div className="divide-y overflow-x-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid min-w-288 grid-cols-[5rem_1.5fr_1fr_1fr_5rem_4rem_6rem_5rem_9rem_4rem] items-center gap-2 p-2"
            >
              <Skeleton className="size-16" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              {Array.from({ length: 8 }).map((_, cellIndex) => (
                <Skeleton key={cellIndex} className="h-4 w-16" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
