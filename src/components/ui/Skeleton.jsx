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

/** A table: header strip and `rows` lines of `columns` cells. */
export function TableSkeleton({ rows = 6, columns = 5, label = "Loading table", className = "" }) {
  return (
    <SkeletonRegion label={label} className={`overflow-hidden ${className}`}>
      <div className="flex gap-4 border-b bg-gray-50 px-5 py-3">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} className={`h-3 ${i === 0 ? "w-1/4" : "w-16"}`} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-gray-100 px-5 py-4 last:border-0">
          <div className="w-1/4 space-y-2">
            <Skeleton className={`h-4 ${r % 2 ? "w-2/3" : "w-4/5"}`} />
            <Skeleton className="h-3 w-1/2" />
          </div>
          {Array.from({ length: columns - 1 }, (_, c) => (
            <Skeleton key={c} className={`h-4 ${c % 2 ? "w-12" : "w-20"}`} />
          ))}
        </div>
      ))}
    </SkeletonRegion>
  );
}

/** A form: label lines over input boxes, two per row. */
export function FormSkeleton({ fields = 6, label = "Loading form", className = "" }) {
  return (
    <SkeletonRegion label={label} className={`grid gap-5 sm:grid-cols-2 ${className}`}>
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </SkeletonRegion>
  );
}
