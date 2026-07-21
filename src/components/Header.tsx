'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Call handler once on mount to capture initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`border-b border-[var(--line)] ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center cursor-pointer">
          <img
            src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048492/timect/timect_logo.png"
            alt="Timect Logo"
            className="h-12 w-12 object-contain"
          />
        </Link>
        <nav className="hidden md:flex gap-10 text-[12px] tracked-sm">
          <Link href="/watches" className="nav-link">
            Collections
          </Link>
          <Link href="/watches?category=new" className="nav-link">
            New Arrivals
          </Link>
          <Link href="/watches?category=recommended" className="nav-link">
            Best Sellers
          </Link>
          <Link href="/watches?category=related" className="nav-link">
            Technology
          </Link>
        </nav>
        
      </div>
    </header>
  );
}

