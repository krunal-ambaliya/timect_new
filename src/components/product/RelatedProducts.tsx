'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  image: string;
  collection: string;
  description: string;
  price: string;
}

const mockRelatedProducts: Product[] = [
  {
    id: 1,
    image: '/images/image_4.png',
    collection: 'HYDROCONQUEST',
    description: '39 mm - Quartz watch - Stainless steel',
    price: '₹114,000.00',
  },
  {
    id: 2,
    image: '/images/image_2.png',
    collection: 'HYDROCONQUEST',
    description: '44 mm - Quartz watch - Stainless steel',
    price: '₹120,000.00',
  },
  {
    id: 3,
    image: '/images/image_4.png',
    collection: 'HYDROCONQUEST',
    description: '44 mm - Quartz watch - Stainless steel',
    price: '₹120,000.00',
  },
  {
    id: 4,
    image: '/images/image_2.png',
    collection: 'HYDROCONQUEST',
    description: '41 mm - Quartz watch - Stainless steel and yellow PVD coating',
    price: '₹133,000.00',
  },
  {
    id: 5,
    image: '/images/image_4.png',
    collection: 'HYDROCONQUEST',
    description: '41 mm - Quartz watch - Stainless steel and red PVD coating',
    price: '₹133,000.00',
  },
  {
    id: 6,
    image: '/images/image_2.png',
    collection: 'HYDROCONQUEST',
    description: '39 mm - Automatic watch',
    price: '₹140,000.00',
  },
  {
    id: 7,
    image: '/images/image_4.png',
    collection: 'HYDROCONQUEST',
    description: '39 mm - Quartz watch - Stainless steel',
    price: '₹114,000.00',
  },
  {
    id: 8,
    image: '/images/image_4.png',
    collection: 'HYDROCONQUEST',
    description: '39 mm - Quartz watch - Stainless steel',
    price: '₹114,000.00',
  },
  {
    id: 9,
    image: '/images/image_4.png',
    collection: 'HYDROCONQUEST',
    description: '39 mm - Quartz watch - Stainless steel',
    price: '₹114,000.00',
  },
];

export default function RelatedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingScrollbar, setIsDraggingScrollbar] = useState(false);
  const [dragWidthPx, setDragWidthPx] = useState(0);
  const [dragLeftPx, setDragLeftPx] = useState(0);

  const dragInfo = useRef({
    startX: 0,
    scrollLeft: 0,
  });

  const updateScrollIndicator = () => {
    if (scrollRef.current && scrollbarRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const { clientWidth: trackWidth } = scrollbarRef.current;
      
      const dragWidth = (clientWidth / scrollWidth) * trackWidth;
      setDragWidthPx(dragWidth);
      
      const maxScrollLeft = scrollWidth - clientWidth;
      const maxDragLeft = trackWidth - dragWidth;
      const dragLeft = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * maxDragLeft : 0;
      setDragLeftPx(dragLeft);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      setIsDragging(true);
      dragInfo.current.startX = e.pageX - scrollRef.current.offsetLeft;
      dragInfo.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  };

  const handleScrollbarMouseDown = (e: React.MouseEvent) => {
    setIsDraggingScrollbar(true);
    if (scrollbarRef.current && scrollRef.current) {
      const { clientWidth: trackWidth } = scrollbarRef.current;
      const { scrollWidth, clientWidth: containerWidth } = scrollRef.current;
      
      const dragWidth = (containerWidth / scrollWidth) * trackWidth;
      const maxDragLeft = trackWidth - dragWidth;
      
      const rect = scrollbarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left - (dragWidth / 2);
      const dragPercent = Math.max(0, Math.min(1, clickX / maxDragLeft));
      
      const scrollAmount = dragPercent * (scrollWidth - containerWidth);
      scrollRef.current.scrollLeft = scrollAmount;
    }
  };

  useEffect(() => {
    updateScrollIndicator();
    window.addEventListener('resize', updateScrollIndicator);

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (isDragging && scrollRef.current) {
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - dragInfo.current.startX) * 1.5;
        scrollRef.current.scrollLeft = dragInfo.current.scrollLeft - walk;
      }

      if (isDraggingScrollbar && scrollbarRef.current && scrollRef.current) {
        e.preventDefault();
        const { clientWidth: trackWidth } = scrollbarRef.current;
        const { scrollWidth, clientWidth: containerWidth } = scrollRef.current;
        
        const dragWidth = (containerWidth / scrollWidth) * trackWidth;
        const maxDragLeft = trackWidth - dragWidth;
        
        const rect = scrollbarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left - (dragWidth / 2);
        const dragPercent = Math.max(0, Math.min(1, clickX / maxDragLeft));
        
        const scrollAmount = dragPercent * (scrollWidth - containerWidth);
        scrollRef.current.scrollLeft = scrollAmount;
      }
    };

    const handleMouseUpGlobal = () => {
      setIsDragging(false);
      setIsDraggingScrollbar(false);
    };

    if (isDragging || isDraggingScrollbar) {
      window.addEventListener('mousemove', handleMouseMoveGlobal, { passive: false });
      window.addEventListener('mouseup', handleMouseUpGlobal);
    }

    return () => {
      window.removeEventListener('resize', updateScrollIndicator);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, isDraggingScrollbar]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full mt-24 border-t border-gray-100 pt-16">
      <h2 className="text-xl font-bold text-[#0a1e36] tracking-wide mb-8 uppercase text-left">
        You may also like
      </h2>

      <div className="relative group/slider">


        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onScroll={updateScrollIndicator}
          className={`flex gap-6 overflow-x-auto pb-8 no-scrollbar select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollBehavior: (isDragging || isDraggingScrollbar) ? 'auto' : 'smooth' }}
        >
          {mockRelatedProducts.map((product) => (
            <div
              key={product.id}
              className="w-[280px] shrink-0 text-left cursor-pointer group"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square w-full bg-gray-50 mb-4 overflow-hidden flex items-center justify-center p-6">
                <Image
                  src={product.image}
                  alt={product.collection}
                  width={240}
                  height={240}
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 280px"
                  priority={product.id <= 3}
                />
              </div>
              
              {/* Product Metadata */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold tracking-widest text-[#0a1e36] uppercase">
                  {product.collection}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-light min-h-[32px] line-clamp-2">
                  {product.description}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Swiper Scrollbar Structure */}
        <div className="wrapper mt-4 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-grow">
              <div
                ref={scrollbarRef}
                onMouseDown={handleScrollbarMouseDown}
                className="py-4 cursor-pointer select-none"
              >
                <div className="swiper-scrollbar swiper-scrollbar-horizontal">
                  <div
                    className="swiper-scrollbar-drag"
                    style={{
                      width: `${dragWidthPx}px`,
                      transform: `translate3d(${dragLeftPx}px, 0px, 0px)`,
                      transitionDuration: isDraggingScrollbar ? '0ms' : '100ms',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shadow-sm text-gray-600 cursor-pointer pointer-events-auto text-sm"
              >
                ‹
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shadow-sm text-gray-600 cursor-pointer pointer-events-auto text-sm"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
