import { Skeleton } from "@/components/ui/skeleton";

export default function StaffUsersLoading() {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Skeleton className="h-8 w-full sm:w-80" />
          <Skeleton className="h-8 w-full sm:w-36" />
          <Skeleton className="h-8 w-full sm:w-44" />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <div className="grid min-w-224 grid-cols-[1fr_1.5fr_1fr_6rem_6rem_9rem_6rem] gap-2 border-b p-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-16" />
          ))}
        </div>
        <div className="divide-y overflow-x-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid min-w-224 grid-cols-[1fr_1.5fr_1fr_6rem_6rem_9rem_6rem] items-center gap-2 p-2"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ml-auto size-8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
