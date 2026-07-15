import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDetailLoading() {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <Skeleton className="h-5 w-20" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-28 max-w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-32" />
      </div>

      <section className="flex flex-col gap-3">
        <Skeleton className="h-5 w-32" />
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, cardIndex) => (
            <div
              key={cardIndex}
              className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-28 max-w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="p-4">
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="grid min-w-176 grid-cols-[1fr_7rem_6rem_8rem_9rem] gap-2 border-b p-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-16" />
          ))}
        </div>
        <div className="divide-y overflow-x-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid min-w-176 grid-cols-[1fr_7rem_6rem_8rem_9rem] items-center gap-2 p-2"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
