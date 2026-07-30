"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import AmbientBackground from "@/components/animations/AmbientBackground";
import Magnetic from "@/components/animations/Magnetic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DURATION, EASE } from "@/lib/motion";
import type { Product } from "@/db/actions";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type CuratedMomentProps = {
  products: Product[];
};

/**
 * Interactive curated gallery — expanding cards with soft 3D tilt.
 * Original Timect “find your moment” experience (not a gift quiz clone).
 */
export default function CuratedMoment({ products }: CuratedMomentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<number | null>(null);

  const picks = products.slice(0, 6);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root || reduced) return;

      const heading = root.querySelectorAll(".curated-heading > *");
      const cards = root.querySelectorAll(".moment-card");

      gsap.set(heading, { autoAlpha: 0, y: 28 });
      gsap.set(cards, { autoAlpha: 0, y: 48, rotateX: 8 });

      ScrollTrigger.batch(heading, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: DURATION.base,
            ease: EASE.out,
          }),
      });

      ScrollTrigger.batch(cards, {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.08,
            duration: DURATION.slow,
            ease: EASE.expo,
          }),
      });
    },
    { scope: sectionRef, dependencies: [reduced, picks.length] }
  );

  const onCardMove = useCallback(
    (e: React.MouseEvent<HTMLElement>, id: number) => {
      if (reduced) return;
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: px * 10,
        rotateX: -py * 8,
        transformPerspective: 900,
        duration: DURATION.fast,
        ease: EASE.snap,
        overwrite: "auto",
      });

      const shine = card.querySelector<HTMLElement>(".moment-card__shine");
      if (shine) {
        gsap.to(shine, {
          opacity: 0.55,
          backgroundPosition: `${50 + px * 40}% ${50 + py * 40}%`,
          duration: DURATION.fast,
          overwrite: "auto",
        });
      }

      setActiveId(id);
    },
    [reduced]
  );

  const onCardLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const card = e.currentTarget;
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: DURATION.base,
        ease: EASE.out,
        overwrite: "auto",
      });
      const shine = card.querySelector<HTMLElement>(".moment-card__shine");
      if (shine) {
        gsap.to(shine, { opacity: 0, duration: DURATION.base, overwrite: "auto" });
      }
      setActiveId(null);
    },
    []
  );

  const onCardEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      gsap.to(e.currentTarget, {
        y: -10,
        scale: 1.02,
        duration: DURATION.base,
        ease: EASE.out,
        overwrite: "auto",
      });
    },
    [reduced]
  );

  const onCardExitScale = useCallback((e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      duration: DURATION.base,
      ease: EASE.out,
      overwrite: "auto",
    });
  }, []);

  if (!picks.length) return null;

  return (
    <section
      ref={sectionRef}
      className="curated-moment"
      aria-label="Curated moments"
    >
      <AmbientBackground variant="gallery" />

      <div className="curated-moment__inner">
        <header className="curated-heading">
          <p className="tracked curated-kicker">Find your moment</p>
          <h2 className="serif curated-title">
            A quiet gallery of timepieces chosen for presence, not noise.
          </h2>
          <p className="curated-lead">
            Hover to feel the light. Select a piece to continue the journey.
          </p>
        </header>

        <div ref={cardsRef} className="moment-grid">
          {picks.map((product, index) => {
            const href = product.slug ? `/product/${product.slug}` : "/watches";
            const isActive = activeId === product.id;

            return (
              <article
                key={product.id}
                className={`moment-card ${isActive ? "is-active" : ""} moment-card--${index % 3}`}
                onMouseMove={(e) => onCardMove(e, product.id)}
                onMouseEnter={(e) => {
                  onCardEnter(e);
                  setActiveId(product.id);
                }}
                onMouseLeave={(e) => {
                  onCardLeave(e);
                  onCardExitScale(e);
                }}
              >
                <div className="moment-card__shine" aria-hidden="true" />
                <div className="moment-card__media">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name || "Timect watch"}
                      width={480}
                      height={480}
                      className="moment-card__img"
                      sizes="(max-width: 768px) 70vw, 280px"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="moment-card__body">
                  <span className="moment-card__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="moment-card__name">
                    {product.name || product.title || "Timect piece"}
                  </h3>
                  <p className="moment-card__price">{product.price}</p>
                  <Link
                    href={href}
                    className="moment-card__link"
                    data-cursor="view"
                  >
                    View details
                    <span aria-hidden="true"> →</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="curated-cta">
          <Magnetic strength={10}>
            <Link href="/watches" className="btn-lux btn-lux--light">
              Browse all watches
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
