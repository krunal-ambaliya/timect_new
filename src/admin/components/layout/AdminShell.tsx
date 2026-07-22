"use client";

import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import type { AdminSession } from "@/admin/lib/session";
import { ToastProvider } from "@/admin/hooks/useToast";

const THEME_KEY = "timect-admin-theme";

export default function AdminShell({
  user,
  children,
  search,
  onSearch,
  searchPlaceholder,
}: {
  user: AdminSession;
  children: ReactNode;
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark") setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <ToastProvider>
      <div className={`admin-root flex min-h-screen ${dark ? "admin-dark" : ""}`}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar
            user={user}
            dark={dark}
            onToggleDark={() => setDark((d) => !d)}
            onMenu={() => setSidebarOpen(true)}
            search={search}
            onSearch={onSearch}
            searchPlaceholder={searchPlaceholder}
          />
          <main className="admin-scrollbar flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
