// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// Sync Lenis with GSAP ScrollTrigger
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)


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

// Cursor Logic (Desktop Only)
let mouse = { x: 0, y: 0 };
let cursorOuterPos = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
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
});

if(cursorOuter) {
    gsap.ticker.add(() => {
        cursorOuterPos.x += (mouse.x - cursorOuterPos.x) * 0.2;
        cursorOuterPos.y += (mouse.y - cursorOuterPos.y) * 0.2;
        gsap.set(cursorOuter, { x: cursorOuterPos.x, y: cursorOuterPos.y });
    });
}


const hoverElements = document.querySelectorAll('a, button, .watch-wrap');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if(cursorOuter) cursorOuter.classList.add('hover');
    if(el.classList.contains('watch-wrap') && cursorInner) {
      cursorInner.classList.add('view');
    }
  });
  el.addEventListener('mouseleave', () => {
    if(cursorOuter) cursorOuter.classList.remove('hover');
    if(cursorInner) cursorInner.classList.remove('view');
  });
});

// Initial States for Animation
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
  // Page Load Sequence
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
  window.addEventListener('scroll', () => {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
    if(scrollProgress) scrollProgress.style.width = scrolled;
    
    // Back to top visibility
    if (scrollPx > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  if(backToTop) {
      backToTop.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.2, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
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
  productCards.forEach(card => card.classList.add('prod-item')); // Add class for selection
  
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
  
  // Parallax for Banners (For Him / For Her)
  gsap.utils.toArray('.h-\\[420px\\] img').forEach(img => {
      gsap.fromTo(img, 
          { yPercent: -10 },
          { yPercent: 10, ease: 'none', scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true
          }}
      );
  });
}

// Button Press Animation (Micro-interaction)
const allButtons = document.querySelectorAll('button');
allButtons.forEach(btn => {
  btn.addEventListener('mousedown', () => {
    gsap.to(btn, { scale: 0.98, duration: 0.1 });
  });
  btn.addEventListener('mouseup', () => {
    gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
  });
});
