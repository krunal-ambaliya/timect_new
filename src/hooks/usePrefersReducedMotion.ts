"use client";

import { useEffect, useState } from "react";

/**
 * React hook for prefers-reduced-motion.
 * Defaults to false on SSR to avoid hydration mismatch flash of reduced state.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
