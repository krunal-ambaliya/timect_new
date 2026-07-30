"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";
import type { GiftProduct } from "./InfiniteProductScroll";

type FloatingGiftFieldProps = {
  products: GiftProduct[];
  /** Base seconds for one full loop — higher = slower. */
  baseDuration?: number;
  className?: string;
};

type RowRuntime = {
  track: HTMLDivElement;
  half: number;
  pos: number;
  speed: number; // px per second (signed)
  baseSpeed: number;
  reverse: boolean;
};

/**
 * Timect “Orbital Time Field” — unique gift gallery:
 * - 3 infinite rows with independent base speeds
 * - Cursor gravity (field leans toward pointer)
 * - Soft focus spotlight that enlarges nearby pieces
 * - Drag-to-scrub then smooth auto-resume
 * - Scroll-velocity inertia on the marquee
 * - Subtle watch-hand tick micro-motion
 * Not a clone of other brand gift finders.
 */
export default function FloatingGiftField({
  products,
  baseDuration = 125,
  className = "",
}: FloatingGiftFieldProps) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const runtimesRef = useRef<RowRuntime[]>([]);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const draggingRef = useRef(false);
  const dragLastXRef = useRef(0);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });
  const scrollBoostRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  // note: no full-field pause — only soft-slow on product hover

  const rows = useMemo(() => {
    if (!products.length) return [[], [], []] as GiftProduct[][];
    const pad = (list: GiftProduct[], min = 10) => {
      if (!list.length) return list;
      const out = [...list];
      let i = 0;
      while (out.length < min) {
        out.push(list[i % list.length]);
        i++;
      }
      return out;
    };
    const a = pad([...products]);
    const b = pad([...products].reverse());
    const mid = Math.floor(products.length / 3);
    const c = pad([
      ...products.slice(mid),
      ...products.slice(0, mid),
    ]);
    return [a, b, c];
  }, [products]);

  const measureRuntimes = useCallback(() => {
    const next: RowRuntime[] = [];
    rowRefs.current.forEach((track, rowIndex) => {
      if (!track) return;
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      const reverse = rowIndex % 2 === 1;
      // px/sec — slow, unique per row
      const loopSec = baseDuration + rowIndex * 24;
      const baseSpeed = (half / loopSec) * (reverse ? 1 : -1);
      const prev = runtimesRef.current[rowIndex];
      next.push({
        track,
        half,
        pos: prev?.pos ?? (reverse ? -half * 0.25 : 0),
        speed: baseSpeed,
        baseSpeed,
        reverse,
      });
      gsap.set(track, { x: prev?.pos ?? 0, force3D: true });
    });
    runtimesRef.current = next;
  }, [baseDuration]);

  // rAF driver — smoother than GSAP repeat for multi-row + drag + inertia
  useEffect(() => {
    if (reduced) return;

    const tick = (ts: number) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      lastTsRef.current = ts;

      // Decay scroll boost
      scrollBoostRef.current *= 0.92;
      if (Math.abs(scrollBoostRef.current) < 0.05) scrollBoostRef.current = 0;

      const productHover =
        rootRef.current?.dataset.productHover === "1" && !draggingRef.current;
      const boost = scrollBoostRef.current;

      runtimesRef.current.forEach((rt) => {
        // Ease speed toward base; slow to a near-stop when inspecting a product
        const target = productHover
          ? rt.baseSpeed * 0.08
          : rt.baseSpeed + boost * Math.sign(rt.baseSpeed || 1) * 40;
        rt.speed += (target - rt.speed) * (draggingRef.current ? 0.08 : 0.055);

        if (!draggingRef.current) {
          rt.pos += rt.speed * dt;
        }

        // Wrap seamless within [-half, 0]
        const h = rt.half;
        if (h > 0) {
          while (rt.pos <= -h) rt.pos += h;
          while (rt.pos > 0) rt.pos -= h;
        }

        gsap.set(rt.track, { x: rt.pos, force3D: true });
      });

      // Cursor gravity — field tilt + spotlight
      const root = rootRef.current;
      const spot = spotlightRef.current;
      const p = pointerRef.current;
      if (root && p.active) {
        const gx = (p.x - 0.5) * 18;
        const gy = (p.y - 0.5) * 12;
        gsap.to(root.querySelector(".floating-gift-field__rows"), {
          x: gx,
          y: gy,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        });
        // Parallax depth on rows
        root.querySelectorAll<HTMLElement>(".floating-row").forEach((row, i) => {
          const depth = (i - 1) * 6;
          gsap.to(row, {
            y: gy * (0.35 + i * 0.15) + depth * (p.y - 0.5),
            duration: 1,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      }
      if (spot && p.active) {
        gsap.to(spot, {
          left: `${p.x * 100}%`,
          top: `${p.y * 100}%`,
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      // Focus scale on products near pointer (skip if product is actively hovered)
      if (root && p.active && !draggingRef.current) {
        const rect = root.getBoundingClientRect();
        const px = rect.left + p.x * rect.width;
        const py = rect.top + p.y * rect.height;
        root.querySelectorAll<HTMLElement>(".float-product").forEach((el) => {
          if (el.dataset.hover === "1") return;
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dist = Math.hypot(cx - px, cy - py);
          const influence = Math.max(0, 1 - dist / 240);
          if (influence > 0.04) {
            gsap.to(el, {
              scale: 1 + influence * 0.12,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else if (el.dataset.focus === "1") {
            el.dataset.focus = "0";
            gsap.to(el, {
              scale: 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
          if (influence > 0.04) el.dataset.focus = "1";
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Measure after layout
    const boot = requestAnimationFrame(() => {
      measureRuntimes();
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
      window.setTimeout(measureRuntimes, 400);
      window.setTimeout(measureRuntimes, 1000);
    });

    const onResize = () => measureRuntimes();
    window.addEventListener("resize", onResize);

    // Scroll velocity → temporary marquee boost (unique feel)
    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastScrollY;
      const dt = Math.max(1, now - lastScrollT);
      const v = dy / dt; // px/ms
      scrollBoostRef.current = gsap.utils.clamp(-2.5, 2.5, v * 18);
      lastScrollY = window.scrollY;
      lastScrollT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(boot);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, measureRuntimes, products.length]);

  useEffect(() => {
    measureRuntimes();
  }, [products, measureRuntimes]);

  const onPointerMove = (e: ReactPointerEvent) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    };

    if (draggingRef.current) {
      const dx = e.clientX - dragLastXRef.current;
      dragLastXRef.current = e.clientX;
      runtimesRef.current.forEach((rt) => {
        rt.pos += dx;
        rt.speed = dx * 18; // fling energy
      });
    }
  };

  const onPointerLeave = () => {
    pointerRef.current.active = false;
    const spot = spotlightRef.current;
    if (spot) {
      gsap.to(spot, { opacity: 0, duration: 0.5, overwrite: "auto" });
    }
    const rowsEl = rootRef.current?.querySelector(".floating-gift-field__rows");
    if (rowsEl) {
      gsap.to(rowsEl, { x: 0, y: 0, duration: 1.1, ease: EASE.out, overwrite: "auto" });
    }
    rootRef.current?.querySelectorAll<HTMLElement>(".floating-row").forEach((row) => {
      gsap.to(row, { y: 0, duration: 1.1, ease: EASE.out, overwrite: "auto" });
    });
    // Reset product scales
    rootRef.current?.querySelectorAll<HTMLElement>(".float-product").forEach((el) => {
      if (!el.matches(":hover")) {
        gsap.to(el, { scale: 1, y: 0, duration: 0.5, ease: EASE.out, overwrite: "auto" });
      }
    });
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    // Only drag on empty field / not on links — allow product clicks
    const t = e.target as HTMLElement;
    if (t.closest("a.float-product")) return;
    draggingRef.current = true;
    setDragging(true);
    dragLastXRef.current = e.clientX;
    rootRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    try {
      rootRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  if (!products.length) {
    return (
      <div className={`floating-gift-field ${className}`}>
        <p className="floating-gift-field__empty">Products loading…</p>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`floating-gift-field floating-gift-field--orbital ${className}${
        dragging ? " is-dragging" : ""
      }${reduced ? " is-reduced" : ""}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label="Timect orbital gift field"
    >
      {/* Soft ambient constellation */}
      <div className="orbital-ambient" aria-hidden="true">
        <div className="orbital-ring orbital-ring--a" />
        <div className="orbital-ring orbital-ring--b" />
        <div className="orbital-dust" />
      </div>

      {/* Cursor focus spotlight */}
      <div ref={spotlightRef} className="orbital-spotlight" aria-hidden="true" />

      <div className="floating-gift-field__rows">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`floating-row floating-row--${rowIndex}`}>
            <div
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
              className={`floating-row__track${reduced ? " is-static" : ""}`}
            >
              <div className="floating-row__half">
                {row.map((p, i) => (
                  <FloatProduct
                    key={`r${rowIndex}-a-${p.id}-${i}`}
                    product={p}
                    index={i + rowIndex * 3}
                    size={sizeFor(i, rowIndex)}
                    reduced={reduced}
                  />
                ))}
              </div>
              {!reduced && (
                <div className="floating-row__half" aria-hidden="true">
                  {row.map((p, i) => (
                    <FloatProduct
                      key={`r${rowIndex}-b-${p.id}-${i}`}
                      product={p}
                      index={i + rowIndex * 3}
                      size={sizeFor(i, rowIndex)}
                      reduced={reduced}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="orbital-hint tracked-sm" aria-hidden="true">
        Drag to explore · Hover to focus
      </p>
    </div>
  );
}

function sizeFor(i: number, row: number): "sm" | "md" | "lg" {
  const n = (i + row * 2) % 5;
  if (n === 0) return "lg";
  if (n === 2 || n === 4) return "sm";
  return "md";
}

function FloatProduct({
  product,
  index,
  size,
  reduced,
}: {
  product: GiftProduct;
  index: number;
  size: "sm" | "md" | "lg";
  reduced: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const href = product.slug ? `/product/${product.slug}` : "/watches";
  const label = product.name || product.title || "Timect watch";

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const img = ref.current.querySelector(".float-product__img");
      // Idle breath
      gsap.to(ref.current, {
        y: index % 2 === 0 ? -7 : 7,
        duration: 5 + (index % 5) * 0.55,
        ease: EASE.soft,
        yoyo: true,
        repeat: -1,
      });
      // Unique “watch tick” micro rotate on image only
      if (img) {
        gsap.to(img, {
          rotation: index % 2 === 0 ? 1.4 : -1.4,
          duration: 3.2 + (index % 3) * 0.4,
          ease: EASE.soft,
          yoyo: true,
          repeat: -1,
        });
      }
    },
    { dependencies: [index, reduced] }
  );

  const onEnter = () => {
    if (reduced || !ref.current) return;
    ref.current.dataset.hover = "1";
    // Soft-pause field while inspecting a piece
    const field = ref.current.closest(".floating-gift-field") as HTMLElement | null;
    if (field) field.dataset.productHover = "1";
    gsap.to(ref.current, {
      scale: 1.14,
      y: -14,
      duration: 0.5,
      ease: EASE.out,
      overwrite: "auto",
    });
    gsap.to(ref.current.querySelector(".float-product__label"), {
      autoAlpha: 1,
      y: 0,
      duration: 0.35,
      ease: EASE.out,
      overwrite: "auto",
    });
    gsap.to(ref.current.querySelector(".float-product__halo"), {
      autoAlpha: 1,
      scale: 1,
      duration: 0.45,
      ease: EASE.out,
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.dataset.hover = "0";
    const field = ref.current.closest(".floating-gift-field") as HTMLElement | null;
    if (field) field.dataset.productHover = "0";
    gsap.to(ref.current, {
      scale: 1,
      y: 0,
      duration: 0.55,
      ease: EASE.out,
      overwrite: "auto",
    });
    gsap.to(ref.current.querySelector(".float-product__label"), {
      autoAlpha: 0,
      y: 8,
      duration: 0.28,
      overwrite: "auto",
    });
    gsap.to(ref.current.querySelector(".float-product__halo"), {
      autoAlpha: 0,
      scale: 0.85,
      duration: 0.4,
      overwrite: "auto",
    });
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={`float-product float-product--${size}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      draggable={false}
      aria-label={`${label} — ${product.price}`}
    >
      <span className="float-product__halo" aria-hidden="true" />
      <div className="float-product__img-wrap">
        {product.image ? (
          <Image
            src={product.image}
            alt={label}
            width={320}
            height={320}
            className="float-product__img"
            sizes="(max-width: 768px) 28vw, 160px"
            loading="lazy"
            draggable={false}
          />
        ) : null}
      </div>
      <span className="float-product__label">
        <em>{label}</em>
        <span>{product.price}</span>
      </span>
    </Link>
  );
}
