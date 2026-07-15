import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <Skeleton className="h-5 w-24" />
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <div key={sectionIndex} className="flex flex-col gap-3">
                <Skeleton className="h-4 w-32" />
                {Array.from({ length: sectionIndex === 0 ? 3 : 7 }).map(
                  (_, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-32 max-w-full" />
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <Skeleton className="h-5 w-16" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="p-4">
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="grid min-w-224 grid-cols-[minmax(16rem,1.5fr)_7rem_5rem_6rem_8rem_8rem] gap-2 border-b p-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-16" />
          ))}
        </div>
        <div className="divide-y overflow-x-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid min-w-224 grid-cols-[minmax(16rem,1.5fr)_7rem_5rem_6rem_8rem_8rem] items-center gap-2 p-2"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-32" />
      </div>
    </section>
  );
}
