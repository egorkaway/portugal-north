export function StationGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <div className="aspect-[2/1] animate-pulse bg-muted sm:aspect-[16/9]" />
          <div className="space-y-3 p-4 md:p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
