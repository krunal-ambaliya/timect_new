"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PAGE_READY_EVENT } from "@/lib/page-ready";

function shouldShowPreloader(pathname: string | null) {
  if (!pathname) return false;
  if (pathname.startsWith("/admin")) return false;
  // Home has its own GSAP Timect preloader
  if (pathname === "/") return false;
  return true;
}

/**
 * Timect logo preloader — visible on first paint for storefront routes.
 * Does NOT use useSearchParams (that suspends and lets content flash first).
 * Exits only after the page signals data-ready (or max timeout).
 */
export default function RoutePreloader() {
  const pathname = usePathname();
  const active = shouldShowPreloader(pathname);

  // Start visible immediately so hard reload never paints page content first
  const [visible, setVisible] = useState(active);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      setExiting(false);
      return;
    }

    setExiting(false);
    setVisible(true);

    const minMs = 500;
    const maxMs = 4000;
    const started = Date.now();
    let pageReady = false;
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    let hardTimer: ReturnType<typeof setTimeout> | null = null;
    let minTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;

    const hide = () => {
      if (closed) return;
      closed = true;
      setExiting(true);
      exitTimer = setTimeout(() => {
        setVisible(false);
        setExiting(false);
      }, 420);
    };

    const tryHide = () => {
      if (!pageReady) return;
      const elapsed = Date.now() - started;
      if (elapsed >= minMs) hide();
      else minTimer = setTimeout(hide, minMs - elapsed);
    };

    const onReady = () => {
      pageReady = true;
      tryHide();
    };

    window.addEventListener(PAGE_READY_EVENT, onReady);

    // Fallback if a page forgets to signal
    hardTimer = setTimeout(() => {
      pageReady = true;
      hide();
    }, maxMs);

    return () => {
      window.removeEventListener(PAGE_READY_EVENT, onReady);
      if (exitTimer) clearTimeout(exitTimer);
      if (hardTimer) clearTimeout(hardTimer);
      if (minTimer) clearTimeout(minTimer);
    };
  }, [pathname, active]);

  if (!active || !visible) return null;

  return (
    <div
      className={`route-preloader fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white ${
        exiting ? "route-preloader--exit" : "route-preloader--enter"
      }`}
      aria-busy="true"
      aria-live="polite"
    >
      <img
        src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048492/timect/timect_logo.png"
        alt="Timect"
        className="route-preloader-logo w-24 h-24 rounded-full object-contain mb-2"
      />
      <div className="tracked-sm text-[12px] mb-1.5 text-gray-700">Loading...</div>
      <div className="route-preloader-track w-48 h-[2px] bg-gray-200 overflow-hidden">
        <div className="route-preloader-line h-full bg-black origin-left" />
      </div>
    </div>
  );
}
