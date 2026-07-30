"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Magnetic from "@/components/animations/Magnetic";
import FloatingGiftField from "@/components/immersive/FloatingGiftField";
import { signalPageReady } from "@/lib/page-ready";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";
import type { GiftSample } from "@/data/giftSamples";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  /** Static gift samples only — not loaded from the database. */
  products: GiftSample[];
};

const COLOURS = [
  { id: "all", label: "All", swatch: "#f5f2ec", border: true },
  { id: "silver", label: "Silver", swatch: "#c5c8ce" },
  { id: "gold", label: "Gold", swatch: "#c4a574" },
  { id: "black", label: "Black", swatch: "#1a1a1a" },
  { id: "blue", label: "Blue", swatch: "#2c4a6e" },
  { id: "green", label: "Green", swatch: "#3d5c4a" },
  { id: "rose", label: "Rose", swatch: "#c48b7a" },
] as const;

/**
 * Corporate gifting — Omega “my gifts” style:
 * full-viewport light floating product field, slow multi-row infinite slider.
 */
export default function CorporateGiftingExperience({ products }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [colour, setColour] = useState<string>("all");

  const giftProducts = useMemo(() => {
    const base = products
      .filter((p) => p.image)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        title: p.title,
        price: p.price,
        image: p.image,
        hoverImage: p.hoverImage,
      }));

    if (colour === "all") return base;

    // Soft client-side keyword filter by name / collection (sample data)
    const keywords: Record<string, string[]> = {
      silver: ["silver", "steel", "graphite", "line", "studio"],
      gold: ["gold", "truton", "two-tone"],
      black: ["black", "noir", "graphite"],
      blue: ["blue", "azure", "heritage"],
      green: ["green", "forest"],
      rose: ["rose", "pink", "ladies"],
    };
    const keys = keywords[colour] || [];
    if (!keys.length) return base;
    const full = products.filter((p) => p.image);
    const filtered = full.filter((p) => {
      const t =
        `${p.name || ""} ${p.title || ""} ${p.collection || ""}`.toLowerCase();
      return keys.some((k) => t.includes(k));
    });
    return filtered.length
      ? filtered.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          title: p.title,
          price: p.price,
          image: p.image,
          hoverImage: p.hoverImage,
        }))
      : base;
  }, [products, colour]);

  useEffect(() => {
    signalPageReady();
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = prefersReducedMotion();
      let lenis: Lenis | null = null;

      if (!reduced) {
        // Buttery page scroll — longer settle, softer exponential ease
        lenis = new Lenis({
          duration: 1.55,
          easing: (t: number) =>
            t === 1 ? 1 : 1 - Math.pow(2, -11 * t),
          smoothWheel: true,
          wheelMultiplier: 0.85,
          touchMultiplier: 1.35,
          syncTouch: false,
        } as ConstructorParameters<typeof Lenis>[0]);
        lenis.on("scroll", ScrollTrigger.update);
        const tickerFn = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
        (lenis as any).__tickerFn = tickerFn;
      }

      const header = root.querySelector("header");
      const field = root.querySelector(".cg-field-stage");
      const panel = root.querySelector(".cg-colour-panel");

      if (reduced) {
        gsap.set([header, field, panel], { autoAlpha: 1, y: 0 });
      } else {
        gsap.set(header, { yPercent: -100, opacity: 0 });
        gsap.set(field, { autoAlpha: 0 });
        gsap.set(panel, { autoAlpha: 0, y: 24 });

        gsap
          .timeline({ defaults: { ease: EASE.out } })
          .to(header, { yPercent: 0, opacity: 1, duration: 0.8 })
          .to(field, { autoAlpha: 1, duration: 1.1, ease: EASE.expo }, "-=0.4")
          .to(panel, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5");
      }

      if (!reduced) {
        gsap.set(".cg-reveal", { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(".cg-reveal", {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              stagger: 0.08,
              duration: DURATION.base,
              ease: EASE.out,
            }),
        });
      }

      const scrollProgress = root.querySelector(".scroll-progress");
      const backToTop = root.querySelector(".back-to-top");
      const onScroll = () => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        if (scrollProgress && winHeightPx > 0) {
          (scrollProgress as HTMLElement).style.width = `${(scrollPx / winHeightPx) * 100}%`;
        }
        if (scrollPx > 400) backToTop?.classList.add("visible");
        else backToTop?.classList.remove("visible");
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const onTop = () => {
        if (lenis) {
          lenis.scrollTo(0, {
            duration: 1.3,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      };
      backToTop?.addEventListener("click", onTop);

      return () => {
        window.removeEventListener("scroll", onScroll);
        backToTop?.removeEventListener("click", onTop);
        const tickerFn = (lenis as any)?.__tickerFn;
        if (tickerFn) gsap.ticker.remove(tickerFn);
        lenis?.destroy();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="cg-page cg-gifts-omega">
      <div className="scroll-progress" aria-hidden="true" />
      <button type="button" className="back-to-top" aria-label="Back to top">
        ↑
      </button>
      <Header />

      <main>
        {/* Full-viewport floating product field */}
        <section
          className="cg-field-stage"
          data-header-theme="light"
          aria-label="Find your gift"
        >
          <div className="cg-field-logo" aria-hidden="true">
            <img
              src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048492/timect/timect_logo.png"
              alt=""
              className="cg-field-logo__img"
            />
          </div>

          <FloatingGiftField
            products={giftProducts}
            baseDuration={130}
            className="cg-field-main"
          />

          {/* Bottom control panel — colour filter */}
          <div className="cg-colour-panel" role="region" aria-label="Filter gifts">
            <p className="cg-colour-panel__title tracked">Pick a colour</p>
            <div className="cg-colour-panel__swatches" role="listbox" aria-label="Colours">
              {COLOURS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={colour === c.id}
                  aria-label={c.label}
                  className={`cg-swatch${colour === c.id ? " is-active" : ""}${
                    "border" in c && c.border ? " cg-swatch--bordered" : ""
                  }`}
                  style={{ background: c.swatch }}
                  onClick={() => setColour(c.id)}
                />
              ))}
            </div>
            <div className="cg-colour-panel__meta">
              <Link href="/" className="cg-colour-panel__back">
                ‹ Back
              </Link>
              <span className="cg-colour-panel__count">
                {giftProducts.length} products
              </span>
            </div>
          </div>
        </section>

        {/* Supporting corporate copy below the field */}
        <section
          className="cg-omega-footer-band"
          data-header-theme="light"
          aria-label="Corporate programme"
        >
          <div className="cg-omega-footer-band__inner">
            <p className="cg-reveal tracked cg-kicker-dark">Corporate gifting</p>
            <h2 className="cg-reveal serif cg-omega-footer-band__title">
              Gifts that mark achievement
            </h2>
            <p className="cg-reveal cg-omega-footer-band__body">
              Drag the field to explore, move your cursor to focus a piece, then
              select it for details—or enquire for bulk programmes and
              engraving.
            </p>
            <div className="cg-reveal cg-omega-footer-band__actions">
              <Magnetic strength={8}>
                <Link href="/contact" className="btn-lux btn-lux--ink">
                  Enquire now
                </Link>
              </Magnetic>
              <Magnetic strength={8}>
                <Link href="/watches" className="btn-outline-ink">
                  Full catalog
                </Link>
              </Magnetic>
            </div>
          </div>
        </section>

        <div data-header-theme="light">
          <Footer />
        </div>
      </main>
    </div>
  );
}
