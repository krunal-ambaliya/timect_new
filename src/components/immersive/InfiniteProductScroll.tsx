"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";
import type { Product } from "@/db/actions";

export type GiftProduct = Pick<
  Product,
  "id" | "slug" | "name" | "title" | "price" | "image" | "hoverImage"
>;

type InfiniteProductScrollProps = {
  products: GiftProduct[];
  /** Seconds for one full loop (lower = faster). */
  duration?: number;
  /** Reverse direction. */
  reverse?: boolean;
  /** Extra class on the section shell. */
  className?: string;
  /** Pause auto-scroll when hovering any card. */
  pauseOnHover?: boolean;
};

/**
 * Seamless infinite horizontal marquee of rounded (circular) product cards.
 * GPU-friendly: transform translateX only. Duplicated track for seamless loop.
 */
export default function InfiniteProductScroll({
  products,
  duration = 48,
  reverse = false,
  className = "",
  pauseOnHover = true,
}: InfiniteProductScrollProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  // Duplicate list so the loop never shows a gap
  const loopItems = useMemo(() => {
    if (!products.length) return [];
    // Enough copies for wide screens
    const copies = products.length < 6 ? 4 : products.length < 10 ? 3 : 2;
    return Array.from({ length: copies }, () => products).flat();
  }, [products]);

  const buildTween = useCallback(() => {
    const track = trackRef.current;
    if (!track || reduced || !loopItems.length) return;

    tweenRef.current?.kill();

    // Measure one half (two identical halves side-by-side)
    const half = track.scrollWidth / 2;
    if (half <= 0) return;

    gsap.set(track, { x: reverse ? -half : 0 });
    tweenRef.current = gsap.to(track, {
      x: reverse ? 0 : -half,
      duration,
      ease: "none",
      repeat: -1,
    });
  }, [duration, reverse, reduced, loopItems.length]);

  useGSAP(
    () => {
      if (reduced) return;
      // Wait a frame for layout / images
      const id = requestAnimationFrame(() => {
        buildTween();
        // Rebuild after images may load
        const t = window.setTimeout(buildTween, 400);
        return () => window.clearTimeout(t);
      });

      const onResize = () => buildTween();
      window.addEventListener("resize", onResize);

      return () => {
        cancelAnimationFrame(id);
        window.removeEventListener("resize", onResize);
        tweenRef.current?.kill();
      };
    },
    { dependencies: [buildTween, reduced] }
  );

  useEffect(() => {
    if (!tweenRef.current) return;
    if (paused) tweenRef.current.pause();
    else tweenRef.current.resume();
  }, [paused]);

  if (!products.length) return null;

  // Two identical halves side-by-side for seamless loop
  const half = loopItems;

  return (
    <div
      className={`infinite-product-scroll ${className}`}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        ref={trackRef}
        className={`infinite-product-scroll__track${reduced ? " is-static" : ""}`}
      >
        <div className="infinite-product-scroll__half">
          {half.map((p, i) => (
            <RoundProductCard key={`a-${p.id}-${i}`} product={p} index={i} />
          ))}
        </div>
        {!reduced ? (
          <div className="infinite-product-scroll__half" aria-hidden="true">
            {half.map((p, i) => (
              <RoundProductCard key={`b-${p.id}-${i}`} product={p} index={i} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RoundProductCard({
  product,
  index,
}: {
  product: GiftProduct;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();
  const href = product.slug ? `/product/${product.slug}` : "/watches";
  const label = product.name || product.title || "Timect watch";

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !cardRef.current) return;
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el.querySelector(".round-card__disc"), {
      rotateY: px * 12,
      rotateX: -py * 10,
      scale: 1.06,
      duration: 0.35,
      ease: EASE.snap,
      overwrite: "auto",
    });
    gsap.to(el.querySelector(".round-card__glow"), {
      opacity: 0.9,
      duration: 0.3,
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current.querySelector(".round-card__disc"), {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.55,
      ease: EASE.out,
      overwrite: "auto",
    });
    gsap.to(cardRef.current.querySelector(".round-card__glow"), {
      opacity: 0,
      duration: 0.4,
      overwrite: "auto",
    });
  };

  // Subtle idle float (staggered by index)
  useGSAP(
    () => {
      if (reduced || !cardRef.current) return;
      const disc = cardRef.current.querySelector(".round-card__disc");
      if (!disc) return;
      gsap.to(disc, {
        y: index % 2 === 0 ? -6 : 6,
        duration: 2.8 + (index % 5) * 0.25,
        ease: EASE.soft,
        yoyo: true,
        repeat: -1,
      });
    },
    { dependencies: [index, reduced] }
  );

  return (
    <Link
      ref={cardRef}
      href={href}
      className="round-card"
      data-cursor="view"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={`${label} — ${product.price}`}
    >
      <div className="round-card__glow" aria-hidden="true" />
      <div className="round-card__disc">
        <div className="round-card__ring" aria-hidden="true" />
        <div className="round-card__ring round-card__ring--inner" aria-hidden="true" />
        <div className="round-card__media">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              width={360}
              height={360}
              className="round-card__img"
              sizes="200px"
              loading="lazy"
            />
          ) : null}
        </div>
      </div>
      <div className="round-card__meta">
        <span className="round-card__name">{label}</span>
        <span className="round-card__price">{product.price}</span>
      </div>
    </Link>
  );
}
