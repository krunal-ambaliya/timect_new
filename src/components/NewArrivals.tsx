"use client";

import { useRef, useState, useEffect } from 'react';
import Button from '@/components/Button';
import { getNewArrivals, Product } from '@/db/actions';

export default function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getNewArrivals().then(setProducts);
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-8 py-16">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #999; 
        }
      `}} />
      
      <div className="flex justify-center gap-12 mb-12">
        <button className="text-[14px] tracking-widest border-b-2 border-black pb-2 font-medium">NEW ARRIVALS</button>
        <button className="text-[14px] tracking-widest text-gray-400 pb-2 hover:text-black transition-colors">BEST SELLER</button>
      </div>

      <div className="relative group">
        <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 -translate-x-6 w-8 h-8 items-center justify-center border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition shadow-sm z-10 text-gray-500 opacity-0 group-hover:opacity-100 pointer-events-auto">‹</button>
        <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 translate-x-6 w-8 h-8 items-center justify-center border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition shadow-sm z-10 text-gray-500 opacity-0 group-hover:opacity-100 pointer-events-auto">›</button>

        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-8 overflow-x-auto pb-6 px-2 custom-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {products.map((product) => (
            <div key={product.id} className="text-center w-[280px] flex-shrink-0 group/card pointer-events-none">
              <div className="watch-wrap relative transition mb-6 bg-white flex items-center justify-center p-4">
                {product.tag && (
                  <span className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold px-2 py-1 tracking-wider z-10">{product.tag}</span>
                )}
                <img src={product.image || ''} alt={product.name || ''} className="w-full h-auto object-contain group-hover/card:scale-105 transition-transform duration-500 pointer-events-none" />
                {product.emi && (
                  <span className="absolute bottom-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 tracking-wider z-10">{product.emi}</span>
                )}
              </div>
              <div className="space-y-2 px-2 pointer-events-none">
                <div className="text-[13px] text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">{product.name || ''}</div>
                <div className="text-[13px] text-gray-900">{product.price}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button
            bgColor="#fff"
            textColor="#000"
            borderColor="#222"
            hoverBgColor="#000000"
            hoverTextColor="#ffffff"
            className="text-[12px] tracking-widest px-10 py-3 font-medium cursor-pointer"
          >
            VIEW ALL
          </Button>
        </div>
      </div>
    </section>
  );
}
