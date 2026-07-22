"use client";

import { useState, useTransition } from "react";
import { LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { logoutAdmin } from "@/admin/actions/auth";
import type { AdminSession } from "@/admin/lib/session";
import ConfirmDialog from "@/admin/components/ui/ConfirmDialog";

export default function TopNavbar({
  user,
  dark,
  onToggleDark,
  onMenu,
  search,
  onSearch,
  searchPlaceholder = "Search…",
}: {
  user: AdminSession;
  dark: boolean;
  onToggleDark: () => void;
  onMenu: () => void;
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
}) {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdmin();
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--admin-line)] bg-[var(--admin-surface)]/90 px-4 backdrop-blur-md lg:px-6">
      <button
        type="button"
        className="admin-btn admin-btn-ghost px-2 lg:hidden"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {onSearch && (
        <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted)]" />
          <input
            type="search"
            value={search || ""}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="admin-input pl-9"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="admin-btn admin-btn-ghost px-2"
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-[var(--admin-line)] py-1 pl-1 pr-3 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--admin-accent)] text-xs font-semibold text-white">
            {(user.fullName || user.email).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-[var(--admin-ink)]">
              {user.fullName || "Admin"}
            </p>
            <p className="truncate text-[10px] uppercase tracking-wider text-[var(--admin-muted)]">
              {user.role.replace("_", " ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-ghost px-2"
          title="Log out"
          aria-label="Log out"
          onClick={() => setConfirmLogout(true)}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Log out?"
        description="Are you sure you want to log out of the Timect admin panel?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        danger
        loading={pending}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
}
