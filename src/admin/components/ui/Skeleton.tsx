export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`admin-skeleton ${className}`} />;
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="admin-card p-5">
      <Skeleton className="mb-3 h-3 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}
