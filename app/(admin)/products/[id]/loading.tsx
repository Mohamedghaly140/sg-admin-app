import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductLoading() {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-72 max-w-full" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-96 max-w-full" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-52 w-full" />
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-52 max-w-full" />
                  </div>
                  <Skeleton className="h-5 w-8" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-36 max-w-full" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
