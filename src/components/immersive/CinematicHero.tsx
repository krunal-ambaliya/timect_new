"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import AmbientBackground from "@/components/animations/AmbientBackground";
import Magnetic from "@/components/animations/Magnetic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DURATION, EASE, splitWords } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_WATCH =
  "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048484/timect/right-main.png";

type CinematicHeroProps = {
  /** Called when entrance timeline finishes (preloader can sync). */
  onReady?: () => void;
  /** When true, play entrance (after preloader exit). */
  playEntrance?: boolean;
};

/**
 * Full-viewport cinematic hero — Timect original.
 * Layers: ambient light, orbital time rings, editorial type, floating watch.
 */
export default function CinematicHero({
  onReady,
  playEntrance = true,
}: CinematicHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const eyebrow = root.querySelector(".hero-eyebrow");
      const title = root.querySelector<HTMLElement>(".hero-title");
      const subtitle = root.querySelector(".hero-subtitle");
      const cta = root.querySelector(".hero-cta");
      const watch = root.querySelector(".hero-watch");
      const scrollCue = root.querySelector(".hero-scroll-cue");
      const meta = root.querySelectorAll(".hero-meta-item");

      if (reduced) {
        gsap.set(
          [eyebrow, subtitle, cta, watch, scrollCue, ...Array.from(meta)],
          { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" }
        );
        if (title) gsap.set(title, { autoAlpha: 1 });
        onReady?.();
        return;
      }

      // Initial states
      gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
      gsap.set(subtitle, { autoAlpha: 0, y: 24 });
      gsap.set(cta, { autoAlpha: 0, y: 20 });
      gsap.set(watch, { autoAlpha: 0, scale: 1.12, y: 40 });
      gsap.set(scrollCue, { autoAlpha: 0 });
      gsap.set(meta, { autoAlpha: 0, x: -12 });

      let wordInners: HTMLSpanElement[] = [];
      if (title) {
        wordInners = splitWords(title);
        gsap.set(wordInners, { yPercent: 110 });
      }

      const play = () => {
        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          onComplete: () => onReady?.(),
        });

        tl.to(watch, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: DURATION.cinematic,
          ease: EASE.expo,
        })
          .to(eyebrow, { autoAlpha: 1, y: 0, duration: DURATION.base }, "-=1")
          .to(
            wordInners,
            {
              yPercent: 0,
              duration: DURATION.slow,
              stagger: 0.06,
              ease: EASE.expo,
            },
            "-=0.9"
          )
          .to(subtitle, { autoAlpha: 1, y: 0, duration: DURATION.base }, "-=0.6")
          .to(cta, { autoAlpha: 1, y: 0, duration: DURATION.base }, "-=0.45")
          .to(
            meta,
            { autoAlpha: 1, x: 0, stagger: 0.08, duration: DURATION.fast },
            "-=0.4"
          )
          .to(scrollCue, { autoAlpha: 1, duration: DURATION.base }, "-=0.2");

        // Gentle float loop on watch
        gsap.to(watch, {
          y: -12,
          duration: 3.5,
          ease: EASE.soft,
          yoyo: true,
          repeat: -1,
          delay: DURATION.cinematic,
        });
      };

      if (playEntrance) {
        // Delay slightly so preloader can finish first when orchestrated from page
        // Page controls via data attribute
        const start = () => play();
        if (root.dataset.enter === "ready") {
          start();
        } else {
          const observer = new MutationObserver(() => {
            if (root.dataset.enter === "ready") {
              observer.disconnect();
              start();
            }
          });
          observer.observe(root, {
            attributes: true,
            attributeFilter: ["data-enter"],
          });
          // Fallback if page never sets enter
          const fallback = window.setTimeout(() => {
            if (root.dataset.enter !== "ready") {
              root.dataset.enter = "ready";
            }
          }, 4000);
          return () => {
            observer.disconnect();
            window.clearTimeout(fallback);
          };
        }
      } else {
        play();
      }

      // Parallax on scroll
      gsap.to(watch, {
        yPercent: 18,
        ease: EASE.none,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(root.querySelector(".hero-copy"), {
        yPercent: -8,
        opacity: 0.35,
        ease: EASE.none,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced, playEntrance] }
  );

  return (
    <section
      ref={sectionRef}
      className="cinematic-hero"
      data-enter="waiting"
      aria-label="Timect hero"
    >
      <AmbientBackground variant="hero" />

      <div className="cinematic-hero__inner">
        <div className="hero-copy">
          <p className="hero-eyebrow tracked">Since 1879 · Crafted for time</p>
          <h1 className="hero-title serif">
            Moments shaped in steel &amp; light
          </h1>
          <p className="hero-subtitle">
            Discover precision timepieces designed for those who measure life
            not in hours—but in meaning.
          </p>
          <div className="hero-cta">
            <Magnetic strength={10}>
              <Link href="/watches" className="btn-lux">
                Explore the collection
              </Link>
            </Magnetic>
            <Magnetic strength={8}>
              <Link href="/about" className="btn-lux-ghost">
                Our story
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-watch">
            <Image
              src={HERO_WATCH}
              alt="Featured Timect timepiece"
              width={720}
              height={720}
              priority
              className="hero-watch__img"
              sizes="(max-width: 768px) 80vw, 42vw"
            />
          </div>
          <ul className="hero-meta" aria-label="Highlights">
            <li className="hero-meta-item">
              <span>145</span>
              <em>Years of craft</em>
            </li>
            <li className="hero-meta-item">
              <span>42mm</span>
              <em>Signature case</em>
            </li>
            <li className="hero-meta-item">
              <span>30 bar</span>
              <em>Water resistant</em>
            </li>
          </ul>
        </div>
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="tracked-sm">Scroll</span>
        <div className="hero-scroll-cue__line" />
      </div>
    </section>
  );
}
