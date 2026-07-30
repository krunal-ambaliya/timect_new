"use client";

import {
  useRef,
  type ReactNode,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DURATION, EASE } from "@/lib/motion";

type MagneticProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Max pixel pull toward cursor (default 12). */
  strength?: number;
  /** Disable magnetic pull while keeping the wrapper. */
  disabled?: boolean;
};

/**
 * Subtle magnetic pull toward the cursor — luxury micro-interaction.
 * Uses transform only; no layout reflow.
 */
export default function Magnetic({
  children,
  strength = 12,
  disabled = false,
  className = "",
  onMouseMove,
  onMouseLeave,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    if (disabled || reduced || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dist = Math.hypot(x, y);
    const max = Math.max(rect.width, rect.height) * 0.6;
    const factor = Math.min(1, dist / max);

    gsap.to(ref.current, {
      x: (x / rect.width) * strength * factor,
      y: (y / rect.height) * strength * factor,
      duration: DURATION.fast,
      ease: EASE.snap,
      overwrite: "auto",
    });
  };

  const handleLeave = (e: MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: DURATION.base,
      ease: EASE.out,
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={ref}
      className={`magnetic-wrap ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </div>
  );
}
