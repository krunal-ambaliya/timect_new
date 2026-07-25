"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function scrollWindowToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  // Some layouts use a scrollable main
  const main = document.querySelector("main");
  if (main) main.scrollTop = 0;
}

/** Scroll window to top on every storefront navigation (path or query change). */
export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams?.toString() ?? "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Stop browser restoring previous scroll position
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    scrollWindowToTop();
    const raf = requestAnimationFrame(scrollWindowToTop);
    const t0 = setTimeout(scrollWindowToTop, 0);
    const t1 = setTimeout(scrollWindowToTop, 100);
    // After Timect preloader exit (~500ms+) pages can reflow mid-scroll
    const t2 = setTimeout(scrollWindowToTop, 450);
    const t3 = setTimeout(scrollWindowToTop, 800);

    try {
      if (sessionStorage.getItem("timect:scroll-top") === "1") {
        sessionStorage.removeItem("timect:scroll-top");
        scrollWindowToTop();
      }
    } catch {
      /* ignore */
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, qs]);

  return null;
}
