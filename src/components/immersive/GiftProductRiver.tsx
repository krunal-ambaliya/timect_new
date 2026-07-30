"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DURATION, EASE } from "@/lib/motion";
import type { GiftProduct } from "./InfiniteProductScroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type GiftProductRiverProps = {
  products: GiftProduct[];
  /** How many to show initially. */
  initialCount?: number;
  /** How many more each load. */
  pageSize?: number;
};

/**
 * Vertical infinite-feel product river — rounded discs in a masonry-like grid.
 * Loads more as you scroll (infinite scroll). Cards expand/scale on hover.
 */
export default function GiftProductRiver({
  products,
  initialCount = 9,
  pageSize = 6,
}: GiftProductRiverProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(initialCount);

  // Cycle products for a long “infinite” feel if catalog is small
  const stream = useMemo(() => {
    if (!products.length) return [];
    const need = Math.max(visible, products.length);
    const out: (GiftProduct & { key: string })[] = [];
    for (let i = 0; i < need; i++) {
      const p = products[i % products.length];
      out.push({ ...p, key: `${p.id}-${i}` });
    }
    return out;
  }, [products, visible]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => v + pageSize);
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pageSize]);

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const cards = rootRef.current.querySelectorAll(".river-card:not(.is-revealed)");
      cards.forEach((card) => {
        card.classList.add("is-revealed");
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 48, scale: 0.92 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: DURATION.slow,
            ease: EASE.expo,
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { dependencies: [stream.length, reduced], scope: rootRef }
  );

  if (!products.length) return null;

  return (
    <div ref={rootRef} className="gift-river">
      <div className="gift-river__grid">
        {stream.map((p, i) => (
          <RiverCard key={p.key} product={p} index={i} />
        ))}
      </div>
      <div ref={sentinelRef} className="gift-river__sentinel" aria-hidden="true" />
      <p className="gift-river__hint tracked-sm">Scroll for more gifts</p>
    </div>
  );
}

function RiverCard({
  product,
  index,
}: {
  product: GiftProduct;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();
  const href = product.slug ? `/product/${product.slug}` : "/watches";
  const label = product.name || product.title || "Timect watch";
  // Varied sizes for organic “constellation” layout
  const size = index % 7 === 0 ? "lg" : index % 3 === 0 ? "md" : "sm";

  const onEnter = () => {
    if (reduced || !ref.current) return;
    gsap.to(ref.current.querySelector(".river-card__disc"), {
      scale: 1.08,
      duration: 0.45,
      ease: EASE.out,
      overwrite: "auto",
    });
    gsap.to(ref.current.querySelector(".river-card__meta"), {
      y: -4,
      autoAlpha: 1,
      duration: 0.35,
      ease: EASE.out,
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current.querySelector(".river-card__disc"), {
      scale: 1,
      duration: 0.5,
      ease: EASE.out,
      overwrite: "auto",
    });
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={`river-card river-card--${size}`}
      data-cursor="view"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="river-card__disc">
        <div className="river-card__orbit" aria-hidden="true" />
        {product.image ? (
          <Image
            src={product.image}
            alt={label}
            width={420}
            height={420}
            className="river-card__img"
            sizes="(max-width: 768px) 45vw, 220px"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="river-card__meta">
        <span className="river-card__name">{label}</span>
        <span className="river-card__price">{product.price}</span>
      </div>
    </Link>
  );
}
