"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  total,
  onChange,
}: {
  page: number;
  totalPages: number;
  total?: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return total != null ? (
      <p className="text-xs text-[var(--admin-muted)]">{total} items</p>
    ) : null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-[var(--admin-muted)]">
        Page {page} of {totalPages}
        {total != null ? ` · ${total} items` : ""}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="admin-btn admin-btn-secondary px-2"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          let p = i + 1;
          if (totalPages > 5) {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            p = start + i;
          }
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`admin-btn px-3 ${
                p === page ? "admin-btn-primary" : "admin-btn-secondary"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          type="button"
          className="admin-btn admin-btn-secondary px-2"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
