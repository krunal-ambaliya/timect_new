"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Vertical travel as percentage of element height (scrub). */
  speed?: number;
  /** Optional scale scrub end value */
  scale?: number;
};

/**
 * Scroll-scrubbed parallax layer (transform only).
 */
export default function Parallax({
  children,
  className = "",
  speed = 20,
  scale,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;

      const vars: gsap.TweenVars = {
        yPercent: speed,
        ease: EASE.none,
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      };

      if (typeof scale === "number") {
        vars.scale = scale;
      }

      gsap.to(el, vars);
    },
    { dependencies: [reduced, speed, scale] }
  );

  return (
    <div ref={ref} className={`parallax-layer ${className}`}>
      {children}
    </div>
  );
}
