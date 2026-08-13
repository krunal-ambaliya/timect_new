"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  applyScroll,
  applyScrollTop,
  consumePopNav,
  getSavedScroll,
  routeKey,
  saveScrollForCurrent,
} from "@/lib/scroll-memory";

function pinScroll(y: number) {
  applyScroll(y);
  const main = document.querySelector("main");
  if (main) main.scrollTop = y === 0 ? 0 : main.scrollTop;
}

/**
 * Forward nav (For Him / For Her, etc.) always lands at the top.
 * Browser back/forward restores the scroll where the user last was.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams?.toString() ?? "";

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.origin !== window.location.origin) return;
      saveScrollForCurrent();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const popped = consumePopNav();
    const key = routeKey(pathname, qs ? `?${qs}` : "");
    const restored = popped ? (getSavedScroll(key) ?? 0) : 0;

    const apply = () => pinScroll(restored);

    apply();
    const raf = requestAnimationFrame(apply);
    const delays = popped ? [50, 160] : [50, 200, 420];
    const timers = delays.map((ms) => setTimeout(apply, ms));

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [pathname, qs]);

  return null;
}
