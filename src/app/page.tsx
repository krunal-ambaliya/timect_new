"use client";

import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "@studio-freight/lenis";

import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import TopStrip from "@/components/TopStrip";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import Recommended from "@/components/Recommended";
import ShopByCategory from "@/components/ShopByCategory";
import CollectionBanners from "@/components/CollectionBanners";
import ForHimHer from "@/components/ForHimHer";
import Quote from "@/components/Quote";
import Footer from "@/components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Lenis setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    } as any);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Elements
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    const preloader = document.querySelector('.preloader');
    const preloaderLine = document.querySelector('.preloader-line');
    const preloaderLogo = document.querySelector('.preloader-logo');
    const header = document.querySelector('header');
    const heroHeading = document.querySelector('.hero .serif');
    const heroText = document.querySelector('.hero p');
    const heroBtn = document.querySelector('.hero .btn-dark');
    const heroImg = document.querySelector('.hero img');
    const scrollProgress = document.querySelector('.scroll-progress');
    const backToTop = document.querySelector('.back-to-top');

    // Cursor Logic
    let mouse = { x: 0, y: 0 };
    let cursorOuterPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      if(cursorInner) {
          gsap.to(cursorInner, {
              x: mouse.x,
              y: mouse.y,
              duration: 0.1,
              ease: "power2.out"
          });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const tickerCursor = () => {
      if(cursorOuter) {
        cursorOuterPos.x += (mouse.x - cursorOuterPos.x) * 0.2;
        cursorOuterPos.y += (mouse.y - cursorOuterPos.y) * 0.2;
        gsap.set(cursorOuter, { x: cursorOuterPos.x, y: cursorOuterPos.y });
      }
    };
    gsap.ticker.add(tickerCursor);

    const hoverElements = document.querySelectorAll('a, button, .watch-wrap');
    
    const onEnter = (e: Event) => {
      if(cursorOuter) cursorOuter.classList.add('hover');
      if((e.currentTarget as HTMLElement).classList.contains('watch-wrap') && cursorInner) {
        cursorInner.classList.add('view');
      }
    };
    const onLeave = () => {
      if(cursorOuter) cursorOuter.classList.remove('hover');
      if(cursorInner) cursorInner.classList.remove('view');
    };

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // Initial States
    gsap.set(header, { yPercent: -100, opacity: 0 });
    gsap.set(heroHeading, { autoAlpha: 0, y: 30 });
    gsap.set(heroText, { autoAlpha: 0, y: 30 });
    gsap.set(heroBtn, { autoAlpha: 0, y: 30 });
    gsap.set(heroImg, { scale: 1.08, opacity: 0 });
    gsap.set('.heroDot', { autoAlpha: 0, x: -20 });

    gsap.set('.prod-item', { opacity: 0, y: 40 });
    gsap.set('.cat-tile', { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' });
    gsap.set('.collection-tile', { opacity: 0, y: 30 });
    gsap.set('footer .footer-col', { opacity: 0, y: 20 });
    document.querySelectorAll('.bg-\\[\\#f4f4f2\\] *').forEach(el => {
        if(el.tagName !== 'IMG') gsap.set(el, { opacity: 0, y: 20 });
    });

    // Preloader Timeline
    const tlPreload = gsap.timeline();

    tlPreload.to(preloaderLogo, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' })
      .to(preloaderLine, { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, "-=0.3")
      .to('.preloader-text', { autoAlpha: 0, duration: 0.3 }, "-=0.2")
      .to(preloaderLogo, { autoAlpha: 0, duration: 0.4, y: -20 }, "+=0.2")
      .to(preloaderLine, { autoAlpha: 0, duration: 0.3 }, "-=0.3")
      .to(preloader, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' })
      .call(initPageAnimations);

    function initPageAnimations() {
      const tlLoad = gsap.timeline();
      
      tlLoad.to(header, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .to(heroImg, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }, "-=0.5")
        .to(heroHeading, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=1")
        .to(heroText, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.6")
        .to(heroBtn, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "-=0.6")
        .to('.heroDot', { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, "-=0.6");

      initScrollAnimations();
    }

    function initScrollAnimations() {
      // Scroll Progress
      const handleScroll = () => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
        if(scrollProgress) (scrollProgress as HTMLElement).style.width = scrolled;
        
        if (scrollPx > 500) {
          backToTop?.classList.add('visible');
        } else {
          backToTop?.classList.remove('visible');
        }
      };
      window.addEventListener('scroll', handleScroll);

      if(backToTop) {
          backToTop.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          });
      }

      // Navbar Effects
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: {className: 'scrolled', targets: 'header'}
      });

      // Hero Parallax
      gsap.to('.hero .swirl', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
      
      gsap.to(heroImg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Product Carousel Reveal
      const productCards = document.querySelectorAll('.group.cursor-pointer');
      productCards.forEach(card => card.classList.add('prod-item'));
      
      ScrollTrigger.batch('.prod-item', {
        onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out'}),
        start: "top 85%"
      });

      // Category Grid Reveal
      ScrollTrigger.batch('.cat-tile', {
        onEnter: batch => gsap.to(batch, {clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', stagger: 0.1, duration: 1, ease: 'power3.out'}),
        start: "top 80%"
      });

      // Collection Grid Reveal
      ScrollTrigger.batch('.collection-tile', {
        onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out'}),
        start: "top 85%"
      });
      
      // Featured Watch Reveal
      gsap.fromTo('.grid.md\\:grid-cols-2 .watch-wrap', 
        { clipPath: 'inset(10% 10% 10% 10%)', opacity: 0 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: {
          trigger: '.grid.md\\:grid-cols-2',
          start: "top 75%"
        }}
      );

      // Quote Section
      ScrollTrigger.batch('.bg-\\[\\#f4f4f2\\] *:not(img)', {
        onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out'}),
        start: "top 85%"
      });

      // Footer
      ScrollTrigger.batch('footer .footer-col', {
        onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out'}),
        start: "top 95%"
      });
    }

    // Button Press Animation
    const allButtons = document.querySelectorAll('button');
    const onMouseDown = (e: Event) => gsap.to(e.currentTarget, { scale: 0.98, duration: 0.1 });
    const onMouseUp = (e: Event) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'power2.out' });
    
    allButtons.forEach(btn => {
      btn.addEventListener('mousedown', onMouseDown);
      btn.addEventListener('mouseup', onMouseUp);
      btn.addEventListener('mouseleave', onMouseUp);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(tickerCursor);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      allButtons.forEach(btn => {
        btn.removeEventListener('mousedown', onMouseDown);
        btn.removeEventListener('mouseup', onMouseUp);
        btn.removeEventListener('mouseleave', onMouseUp);
      });
      lenis.destroy();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <CustomCursor />
      <div className="scroll-progress"></div>
      <Preloader />
      <div className="back-to-top">↑</div>
      <TopStrip />
      <Header />
      <Hero />
      <NewArrivals />
      <Recommended />
      <ShopByCategory />
      <CollectionBanners />
      <ForHimHer />
      <Quote />
      <Footer />
    </div>
  );
}
