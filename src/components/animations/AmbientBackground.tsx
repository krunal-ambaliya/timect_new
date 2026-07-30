"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";

type AmbientBackgroundProps = {
  variant?: "hero" | "story" | "gallery";
  className?: string;
};

/**
 * Soft luminous orbs + grain — pure CSS/DOM, GPU-friendly opacity/transform loops.
 * No canvas (lighter on mobile).
 */
export default function AmbientBackground({
  variant = "hero",
  className = "",
}: AmbientBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const orbs = root.querySelectorAll<HTMLElement>(".ambient-orb");
      orbs.forEach((orb, i) => {
        const dur = 14 + i * 3;
        gsap.to(orb, {
          x: i % 2 === 0 ? 40 : -30,
          y: i % 2 === 0 ? -50 : 35,
          scale: 1.08 + i * 0.02,
          duration: dur,
          ease: EASE.soft,
          yoyo: true,
          repeat: -1,
        });
      });

      const rings = root.querySelectorAll<HTMLElement>(".ambient-ring");
      rings.forEach((ring, i) => {
        gsap.to(ring, {
          rotation: i % 2 === 0 ? 360 : -360,
          duration: 80 + i * 20,
          ease: EASE.none,
          repeat: -1,
        });
      });
    },
    { dependencies: [reduced, variant] }
  );

  return (
    <div
      ref={rootRef}
      className={`ambient-bg ambient-bg--${variant} ${className}`}
      aria-hidden="true"
    >
      <div className="ambient-orb ambient-orb--a" />
      <div className="ambient-orb ambient-orb--b" />
      <div className="ambient-orb ambient-orb--c" />
      {variant === "hero" && (
        <>
          <div className="ambient-ring ambient-ring--outer" />
          <div className="ambient-ring ambient-ring--inner" />
        </>
      )}
      <div className="ambient-grain" />
      <div className="ambient-vignette" />
    </div>
  );
}
