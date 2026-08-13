"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { catalogThumbUrl } from "@/lib/catalog-image";
import type { GiftProduct } from "./InfiniteProductScroll";

type FloatingGiftFieldProps = {
  products: GiftProduct[];
  /** Seconds for one loop of the first row. Lower = faster. */
  baseDuration?: number;
  className?: string;
  onProductSelect?: (product: GiftProduct) => void;
  paused?: boolean;
};

type RowRuntime = {
  track: HTMLDivElement;
  half: number;
  pos: number;
  dir: 1 | -1;
};

const ITEM_ESTIMATE = 176;

function padRow(list: GiftProduct[], min: number) {
  if (!list.length) return list;
  if (list.length >= min) return list;
  const out = [...list];
  let i = 0;
  while (out.length < min) {
    out.push(list[i % list.length]);
    i += 1;
  }
  return out;
}

function wrap(pos: number, half: number) {
  if (half <= 0) return 0;
  let p = pos;
  while (p <= -half) p += half;
  while (p > 0) p -= half;
  return p;
}

/**
 * Infinite 3-row gift marquee. Direct transform + rAF — no per-item GSAP.
 * Each row is [half][half]; wrap uses the first half's width so the loop is seamless.
 */
export default function FloatingGiftField({
  products,
  baseDuration = 38,
  className = "",
  onProductSelect,
  paused = false,
}: FloatingGiftFieldProps) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const runtimesRef = useRef<RowRuntime[]>([]);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const draggingRef = useRef(false);
  const dragXRef = useRef(0);
  const wheelVelRef = useRef(0);
  const hoverRef = useRef(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const [minPerHalf, setMinPerHalf] = useState(14);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth || 1280;
      setMinPerHalf(Math.max(12, Math.ceil((vw * 1.85) / ITEM_ESTIMATE)));
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const rows = useMemo(() => {
    if (!products.length) return [[], [], []] as GiftProduct[][];
    const shifted = [
      ...products.slice(Math.floor(products.length / 3)),
      ...products.slice(0, Math.floor(products.length / 3)),
    ];
    return [
      padRow([...products], minPerHalf),
      padRow([...products].reverse(), minPerHalf),
      padRow(shifted, minPerHalf),
    ];
  }, [products, minPerHalf]);

  const measure = useCallback(() => {
    const next: RowRuntime[] = [];
    rowRefs.current.forEach((track, i) => {
      if (!track) return;
      const halfEl = track.querySelector<HTMLElement>(".floating-row__half");
      const half = halfEl?.offsetWidth || track.scrollWidth / 2;
      if (half <= 1) return;
      const prev = runtimesRef.current[i];
      const dir: 1 | -1 = i % 2 === 0 ? -1 : 1;
      const pos = wrap(prev?.pos ?? 0, half);
      next.push({ track, half, pos, dir });
      track.style.transform = `translate3d(${pos}px,0,0)`;
    });
    runtimesRef.current = next;
  }, []);

  useEffect(() => {
    if (reduced) return;

    let running = true;
    const speeds = [1, 0.82, 1.12];

    const tick = (ts: number) => {
      if (!running) return;
      const last = lastTsRef.current || ts;
      const dt = Math.min(0.048, (ts - last) / 1000);
      lastTsRef.current = ts;

      wheelVelRef.current *= Math.pow(0.9, dt * 60);
      if (Math.abs(wheelVelRef.current) < 0.3) wheelVelRef.current = 0;

      const fieldPaused = pausedRef.current;
      const hoverSlow = hoverRef.current ? 0.22 : 1;
      const wheel = wheelVelRef.current;

      runtimesRef.current.forEach((rt, i) => {
        if (!draggingRef.current && !fieldPaused) {
          const loopSec = Math.max(16, baseDuration * speeds[i] || baseDuration);
          const auto = (rt.half / loopSec) * rt.dir * hoverSlow;
          // Wheel always steers the same visual way (down → left) on every row
          rt.pos += (auto - wheel) * dt;
          rt.pos = wrap(rt.pos, rt.half);
          rt.track.style.transform = `translate3d(${rt.pos}px,0,0)`;
        } else if (fieldPaused && !draggingRef.current) {
          // freeze
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    const boot = requestAnimationFrame(() => {
      measure();
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    });

    const ro = new ResizeObserver(() => measure());
    rowRefs.current.forEach((track) => {
      if (!track) return;
      ro.observe(track);
      const half = track.querySelector(".floating-row__half");
      if (half) ro.observe(half);
    });

    const onWinResize = () => measure();
    window.addEventListener("resize", onWinResize, { passive: true });

    const onNativeWheel = (e: WheelEvent) => {
      if (pausedRef.current) return;
      e.preventDefault();
      let delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      if (!delta) return;
      if (e.deltaMode === 1) delta *= 16;
      if (e.deltaMode === 2) delta *= 400;
      wheelVelRef.current = Math.max(
        -1400,
        Math.min(1400, wheelVelRef.current + delta * 2.4),
      );
    };
    window.addEventListener("wheel", onNativeWheel, { passive: false });

    return () => {
      running = false;
      cancelAnimationFrame(boot);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("resize", onWinResize);
      window.removeEventListener("wheel", onNativeWheel);
    };
  }, [reduced, measure, baseDuration, rows]);

  useEffect(() => {
    measure();
  }, [rows, measure]);

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragXRef.current;
    dragXRef.current = e.clientX;
    runtimesRef.current.forEach((rt) => {
      rt.pos = wrap(rt.pos + dx, rt.half);
      rt.track.style.transform = `translate3d(${rt.pos}px,0,0)`;
    });
    wheelVelRef.current = Math.max(-1400, Math.min(1400, -dx * 42));
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("button.float-product")) return;
    if (pausedRef.current) return;
    draggingRef.current = true;
    dragXRef.current = e.clientX;
    rootRef.current?.setPointerCapture(e.pointerId);
    rootRef.current?.classList.add("is-dragging");
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    rootRef.current?.classList.remove("is-dragging");
    try {
      rootRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onProductEnter = () => {
    hoverRef.current = true;
  };
  const onProductLeave = () => {
    hoverRef.current = false;
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
        reduced ? " is-reduced" : ""
      }`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label="Timect gift field"
    >
      <div className="orbital-ambient" aria-hidden="true">
        <div className="orbital-ring orbital-ring--a" />
        <div className="orbital-ring orbital-ring--b" />
      </div>

      <div className="floating-gift-field__rows">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`floating-row floating-row--${rowIndex}`}
          >
            <div
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
              className={`floating-row__track${reduced ? " is-static" : ""}`}
            >
              <div className="floating-row__half">
                {row.map((p, i) => (
                  <FloatProduct
                    key={`a-${rowIndex}-${p.id}-${i}`}
                    product={p}
                    size={sizeFor(i, rowIndex)}
                    reduced={reduced}
                    interactive
                    onSelect={onProductSelect}
                    onEnter={onProductEnter}
                    onLeave={onProductLeave}
                  />
                ))}
              </div>
              {!reduced ? (
                <div className="floating-row__half" aria-hidden="true">
                  {row.map((p, i) => (
                    <FloatProduct
                      key={`b-${rowIndex}-${p.id}-${i}`}
                      product={p}
                      size={sizeFor(i, rowIndex)}
                      reduced
                      interactive={false}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
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
  size,
  reduced,
  interactive,
  onSelect,
  onEnter,
  onLeave,
}: {
  product: GiftProduct;
  size: "sm" | "md" | "lg";
  reduced: boolean;
  interactive: boolean;
  onSelect?: (product: GiftProduct) => void;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  const label = product.name || product.title || "Timect watch";
  const src = catalogThumbUrl(product.image, 280);

  return (
    <button
      type="button"
      className={`float-product float-product--${size}${
        reduced ? "" : " float-product--live"
      }${interactive ? "" : " float-product--clone"}`}
      tabIndex={interactive ? 0 : -1}
      onMouseEnter={interactive ? onEnter : undefined}
      onMouseLeave={interactive ? onLeave : undefined}
      onClick={() => interactive && onSelect?.(product)}
      draggable={false}
      aria-hidden={!interactive}
      aria-label={interactive ? `${label} — ${product.price}` : undefined}
    >
      <span className="float-product__halo" aria-hidden="true" />
      <div className="float-product__img-wrap">
        {src ? (
          <img
            src={src}
            alt={interactive ? label : ""}
            width={160}
            height={160}
            className="float-product__img"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        ) : null}
      </div>
      {interactive ? (
        <span className="float-product__label">
          <em>{label}</em>
          <span>{product.price}</span>
        </span>
      ) : null}
    </button>
  );
}
