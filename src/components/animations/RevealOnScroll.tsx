"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DURATION, EASE } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** y offset in px before reveal */
  y?: number;
  delay?: number;
  duration?: number;
  as?: ElementType;
  /** Start position for ScrollTrigger */
  start?: string;
};

/**
 * Fade + translateY reveal on scroll. Transform/opacity only.
 */
export default function RevealOnScroll({
  children,
  className = "",
  y = 40,
  delay = 0,
  duration = DURATION.base,
  as: Tag = "div",
  start = "top 88%",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reduced) {
        gsap.set(el, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: EASE.out,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    },
    { dependencies: [reduced, y, delay, duration, start] }
  );

  return (
    <Tag ref={ref} className={`reveal-on-scroll ${className}`}>
      {children}
    </Tag>
  );
}
