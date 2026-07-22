"use client";

import { useState, type ReactNode } from "react";
import AdminShell from "@/admin/components/layout/AdminShell";
import type { AdminSession } from "@/admin/lib/session";

export default function ProtectedShell({
  user,
  children,
}: {
  user: AdminSession;
  children: ReactNode;
}) {
  const [search, setSearch] = useState("");

  return (
    <AdminShell
      user={user}
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search products, media…"
    >
      {/* Pass search via context-like data attribute for client pages that need it */}
      <div data-admin-search={search}>{children}</div>
    </AdminShell>
  );
}
