"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import AmbientBackground from "@/components/animations/AmbientBackground";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CHAPTERS = [
  {
    id: "origin",
    kicker: "01 — Origin",
    title: "Born from patience",
    body: "Every Timect movement begins with a quiet ritual: steel, light, and the steady hand of a craftsman who refuses haste.",
  },
  {
    id: "form",
    kicker: "02 — Form",
    title: "Silhouette of intention",
    body: "Cases are sculpted for balance on the wrist—proportioned so presence never becomes weight, and elegance never fades.",
  },
  {
    id: "legacy",
    kicker: "03 — Legacy",
    title: "Time you can pass on",
    body: "We design heirlooms for modern life: durable, refined, and ready to outlast trends—one precise second at a time.",
  },
] as const;

/**
 * Scroll-pinned storytelling chapter sequence with cross-fades and depth.
 */
export default function CraftStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const chapters = gsap.utils.toArray<HTMLElement>(".craft-chapter");
      const progress = root.querySelector<HTMLElement>(".craft-progress__fill");
      const mediaLayers = gsap.utils.toArray<HTMLElement>(".craft-media-layer");

      if (reduced) {
        chapters.forEach((ch, i) => {
          gsap.set(ch, {
            autoAlpha: 1,
            y: 0,
            position: "relative",
            marginBottom: i < chapters.length - 1 ? 48 : 0,
          });
        });
        gsap.set(mediaLayers, { autoAlpha: 0 });
        gsap.set(mediaLayers[0], { autoAlpha: 1, scale: 1 });
        return;
      }

      gsap.set(chapters, { autoAlpha: 0, y: 28 });
      gsap.set(chapters[0], { autoAlpha: 1, y: 0 });
      gsap.set(mediaLayers, { autoAlpha: 0, scale: 1.06 });
      gsap.set(mediaLayers[0], { autoAlpha: 1, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * (CHAPTERS.length + 0.4)}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      CHAPTERS.forEach((_, i) => {
        if (i === 0) return;
        const prev = i - 1;
        tl.to(
          chapters[prev],
          { autoAlpha: 0, y: -24, duration: 1, ease: EASE.none },
          i
        )
          .to(
            mediaLayers[prev],
            { autoAlpha: 0, scale: 0.96, duration: 1, ease: EASE.none },
            i
          )
          .fromTo(
            chapters[i],
            { autoAlpha: 0, y: 32 },
            { autoAlpha: 1, y: 0, duration: 1, ease: EASE.none },
            i
          )
          .fromTo(
            mediaLayers[i],
            { autoAlpha: 0, scale: 1.08 },
            { autoAlpha: 1, scale: 1, duration: 1, ease: EASE.none },
            i
          );
      });

      if (progress) {
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: EASE.none,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${window.innerHeight * (CHAPTERS.length + 0.4)}`,
              scrub: true,
            },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="craft-story"
      aria-label="Craftsmanship story"
    >
      <AmbientBackground variant="story" />
      <div className="craft-story__grid">
        <div className="craft-media" aria-hidden="true">
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.id}
              className={`craft-media-layer craft-media-layer--${i}`}
            />
          ))}
          <div className="craft-media__frame" />
        </div>

        <div className="craft-copy">
          <div className="craft-progress" aria-hidden="true">
            <div className="craft-progress__fill" />
          </div>
          {CHAPTERS.map((ch) => (
            <article key={ch.id} className="craft-chapter">
              <p className="craft-chapter__kicker tracked">{ch.kicker}</p>
              <h2 className="craft-chapter__title serif">{ch.title}</h2>
              <p className="craft-chapter__body">{ch.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
