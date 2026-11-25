/**
 * Grey placeholder shapes shown while a page's first data loads, so the
 * layout appears at once and fills in instead of jumping from a
 * "Loading…" line to the full page.
 */

/** One pulsing block. Size and shape come from `className`. */
export function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

/** Wraps placeholders so screen readers hear `label` instead of nothing. */
export function SkeletonRegion({ label, className = "", children }) {
  return (
    <div role="status" aria-label={label} aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** A row of stat cards: a small label line over a large number. */
export function StatCardsSkeleton({ count = 4, label = "Loading figures", className = "" }) {
  return (
    <SkeletonRegion label={label} className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-7 w-16" />
        </div>
      ))}
    </SkeletonRegion>
  );
}

/** Lines of a list: a title line with a shorter detail line under it. */
export function ListSkeleton({ rows = 4, label = "Loading list", className = "" }) {
  return (
    <SkeletonRegion label={label} className={`divide-y ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="space-y-2 py-3">
          <Skeleton className={`h-4 ${i % 2 ? "w-1/2" : "w-2/3"}`} />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </SkeletonRegion>
  );
}

/** A grid of cards: a heading, two text lines and a footer strip each. */
export function CardGridSkeleton({ count = 6, label = "Loading cards", className = "" }) {
  return (
    <SkeletonRegion label={label} className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="mt-4 h-8 w-full" />
        </div>
      ))}
    </SkeletonRegion>
  );
}
