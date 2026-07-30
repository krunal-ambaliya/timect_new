/**
 * Shared motion tokens and helpers for GPU-friendly Timect animations.
 * Prefer transform + opacity only; avoid layout thrashing.
 */

export const EASE = {
  /** Soft luxury settle */
  out: "power3.out",
  /** Cinematic entrance */
  expo: "expo.out",
  /** Snappy micro-interaction */
  snap: "power2.out",
  /** Smooth continuous scrub */
  none: "none",
  /** Gentle in-out for ambient loops */
  soft: "sine.inOut",
} as const;

export const DURATION = {
  instant: 0.15,
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  cinematic: 1.4,
} as const;

/** Detect prefers-reduced-motion (SSR-safe). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Safe will-change toggle — only during active animation. */
export function withWillChange(
  el: Element | Element[] | null | undefined,
  props: string,
  on: boolean
) {
  if (!el) return;
  const list = Array.isArray(el) ? el : [el];
  list.forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.willChange = on ? props : "auto";
    }
  });
}

/** Split text into word spans for staggered reveals (no layout shift after). */
export function splitWords(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  el.setAttribute("aria-label", text.trim());
  el.textContent = "";
  const words = text.split(/(\s+)/);
  const spans: HTMLSpanElement[] = [];

  words.forEach((word) => {
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(word));
      return;
    }
    const wrap = document.createElement("span");
    wrap.className = "motion-word";
    wrap.style.display = "inline-block";
    wrap.style.overflow = "hidden";
    wrap.style.verticalAlign = "top";
    const inner = document.createElement("span");
    inner.className = "motion-word-inner";
    inner.style.display = "inline-block";
    inner.textContent = word;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    spans.push(inner);
  });

  return spans;
}
