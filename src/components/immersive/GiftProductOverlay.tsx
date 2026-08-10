"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import type { GiftSample } from "@/data/giftSamples";

export type GiftOverlayProduct = Pick<
  GiftSample,
  | "id"
  | "slug"
  | "name"
  | "title"
  | "price"
  | "image"
  | "hoverImage"
  | "brand"
  | "collection"
  | "gender"
> & {
  accentColor?: string;
  subtitle?: string;
  caseSize?: string;
  specifications?: { label: string; value: string }[];
};

type GiftProductOverlayProps = {
  product: GiftOverlayProduct | null;
  open: boolean;
  onClose: () => void;
};

/** Derive a soft circle colour from collection / name when no accent is set. */
function resolveAccent(product: GiftOverlayProduct): string {
  if (product.accentColor) return product.accentColor;
  const t =
    `${product.name || ""} ${product.collection || ""} ${product.title || ""}`.toLowerCase();
  if (t.includes("rose") || t.includes("pink")) return "#8f6a5e";
  if (t.includes("gold") || t.includes("truton")) return "#8a7355";
  if (t.includes("blue") || t.includes("azure") || t.includes("heritage"))
    return "#4a5d6e";
  if (t.includes("green") || t.includes("forest")) return "#5a6b55";
  if (t.includes("black") || t.includes("noir") || t.includes("graphite"))
    return "#3a3a3a";
  if (t.includes("silver") || t.includes("steel") || t.includes("studio"))
    return "#7a7e86";
  if (t.includes("ladies")) return "#7d6b5e";
  return "#6b7168";
}

function defaultSpecs(product: GiftOverlayProduct) {
  if (product.specifications?.length) return product.specifications;
  const specs: { label: string; value: string }[] = [];
  if (product.collection) {
    specs.push({ label: "Collection", value: product.collection });
  }
  if (product.caseSize) {
    specs.push({ label: "Case", value: product.caseSize });
  }
  if (product.gender) {
    specs.push({ label: "Designed for", value: product.gender });
  }
  if (!specs.length) {
    specs.push({ label: "Finish", value: "Precision craftsmanship" });
  }
  return specs;
}

/**
 * Omega-style same-screen product reveal.
 * Opens as a full-viewport overlay — no route change, no full reload.
 */
export default function GiftProductOverlay({
  product,
  open,
  onClose,
}: GiftProductOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const openRef = useRef(open);
  openRef.current = open;

  const animateIn = useCallback(() => {
    const root = rootRef.current;
    if (!root || !product) return;
    const reduced = prefersReducedMotion();

    const backdrop = root.querySelector(".gpo-backdrop");
    const stage = root.querySelector(".gpo-stage");
    const circle = root.querySelector(".gpo-circle");
    const img = root.querySelector(".gpo-product-img");
    const left = root.querySelectorAll(".gpo-left > *");
    const right = root.querySelectorAll(".gpo-right > *");
    const chrome = root.querySelectorAll(".gpo-chrome > *");

    if (reduced) {
      gsap.set([backdrop, stage, circle, img, left, right, chrome], {
        clearProps: "all",
        autoAlpha: 1,
        scale: 1,
        y: 0,
        x: 0,
      });
      return;
    }

    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(circle, { scale: 0.72, autoAlpha: 0 });
    gsap.set(img, { scale: 0.88, autoAlpha: 0, y: 18 });
    gsap.set(left, { autoAlpha: 0, y: 22 });
    gsap.set(right, { autoAlpha: 0, y: 18 });
    gsap.set(chrome, { autoAlpha: 0, y: -10 });

    const tl = gsap.timeline({ defaults: { ease: EASE.out } });
    tl.to(backdrop, { autoAlpha: 1, duration: 0.45 }, 0)
      .to(stage, { autoAlpha: 1, duration: 0.2 }, 0.05)
      .to(chrome, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04 }, 0.12)
      .to(
        circle,
        { scale: 1, autoAlpha: 1, duration: 0.85, ease: EASE.expo },
        0.1
      )
      .to(
        img,
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.75, ease: EASE.expo },
        0.22
      )
      .to(left, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07 }, 0.32)
      .to(right, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06 }, 0.4);
  }, [product]);

  const animateOut = useCallback(
    (then?: () => void) => {
      const root = rootRef.current;
      if (!root) {
        then?.();
        return;
      }
      if (prefersReducedMotion()) {
        then?.();
        return;
      }
      const backdrop = root.querySelector(".gpo-backdrop");
      const content = root.querySelector(".gpo-inner");
      gsap
        .timeline({
          defaults: { ease: "power2.in" },
          onComplete: () => then?.(),
        })
        .to(content, { autoAlpha: 0, scale: 0.98, duration: 0.28 }, 0)
        .to(backdrop, { autoAlpha: 0, duration: 0.32 }, 0.05);
    },
    []
  );

  // Open / close body lock + enter animation
  useEffect(() => {
    if (!open || !product) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Double-rAF so DOM is painted before GSAP measures
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(animateIn);
    });

    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, product, animateIn]);

  const handleClose = useCallback(() => {
    animateOut(onClose);
  }, [animateOut, onClose]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open || !product) return null;

  const accent = resolveAccent(product);
  const label = product.name || product.title || "Timect watch";
  const subtitle =
    product.subtitle ||
    [product.caseSize, product.collection, product.gender]
      .filter(Boolean)
      .join(" · ");
  const specs = defaultSpecs(product);
  const href = product.slug ? `/product/${product.slug}` : "/watches";

  return (
    <div
      ref={rootRef}
      className="gpo-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="gpo-backdrop"
        aria-label="Close product view"
        onClick={handleClose}
      />

      <div className="gpo-inner">
        <div className="gpo-chrome">
          <div className="gpo-logo" aria-hidden="true">
            <img
              src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048492/timect/timect_logo.png"
              alt=""
              className="gpo-logo__img"
            />
          </div>
          <button
            type="button"
            className="gpo-close cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="gpo-stage">
          {/* Left — identity & CTA */}
          <div className="gpo-left">
            <h2 id={titleId} className="gpo-title serif">
              {label}
            </h2>
            {subtitle ? <p className="gpo-subtitle">{subtitle}</p> : null}
            <p className="gpo-price">{product.price}</p>
            <div className="gpo-actions">
              <Link href={href} className="gpo-discover cursor-pointer">
                Discover more
              </Link>
              <button
                type="button"
                className="gpo-heart cursor-pointer"
                aria-label="Save for later"
                title="Save for later"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden
                >
                  <path d="M12 21s-6.5-4.35-9.33-8.1C.5 10.1 1.1 6.5 4.2 5.1 6.4 4.1 8.7 4.9 12 8c3.3-3.1 5.6-3.9 7.8-2.9 3.1 1.4 3.7 5 1.53 7.8C18.5 16.65 12 21 12 21z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Center — hero circle */}
          <div className="gpo-center">
            <div
              className="gpo-circle"
              style={{ "--gpo-accent": accent } as CSSProperties}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={label}
                  fill
                  className="gpo-product-img"
                  sizes="(max-width: 768px) 78vw, min(42vw, 480px)"
                  priority
                />
              ) : null}
            </div>
          </div>

          {/* Right — sparse specs */}
          <div className="gpo-right">
            <p className="gpo-specs-label tracked">Specifications</p>
            <ul className="gpo-specs">
              {specs.map((s) => (
                <li key={`${s.label}-${s.value}`}>
                  <span className="gpo-spec-key">{s.label}</span>
                  <span className="gpo-spec-val">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
