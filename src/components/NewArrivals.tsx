"use client";

import { useRef, useState, useEffect } from "react";
import Button from "@/components/Button";
import { getNewArrivals, Product } from "@/db/actions";
import { useRouter } from "next/navigation";

export default function NewArrivals() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getNewArrivals().then(setProducts);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingScrollbar, setIsDraggingScrollbar] = useState(false);
  const [dragWidthPx, setDragWidthPx] = useState(0);
  const [dragLeftPx, setDragLeftPx] = useState(0);

  const dragInfo = useRef({
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  const updateScrollIndicator = () => {
    if (scrollRef.current && scrollbarRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const { clientWidth: trackWidth } = scrollbarRef.current;

      const dragWidth = (clientWidth / scrollWidth) * trackWidth;
      setDragWidthPx(dragWidth);

      const maxScrollLeft = scrollWidth - clientWidth;
      const maxDragLeft = trackWidth - dragWidth;
      const dragLeft =
        maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * maxDragLeft : 0;
      setDragLeftPx(dragLeft);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      setIsDragging(true);
      dragInfo.current.startX = e.pageX - scrollRef.current.offsetLeft;
      dragInfo.current.scrollLeft = scrollRef.current.scrollLeft;
      dragInfo.current.hasMoved = false;
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
      const clickX = e.clientX - rect.left - dragWidth / 2;
      const dragPercent = Math.max(0, Math.min(1, clickX / maxDragLeft));

      const scrollAmount = dragPercent * (scrollWidth - containerWidth);
      scrollRef.current.scrollLeft = scrollAmount;
    }
  };

  useEffect(() => {
    updateScrollIndicator();
    window.addEventListener("resize", updateScrollIndicator);

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (isDragging && scrollRef.current) {
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - dragInfo.current.startX) * 1.5;
        scrollRef.current.scrollLeft = dragInfo.current.scrollLeft - walk;
        if (Math.abs(walk) > 5) {
          dragInfo.current.hasMoved = true;
        }
      }

      if (isDraggingScrollbar && scrollbarRef.current && scrollRef.current) {
        e.preventDefault();
        const { clientWidth: trackWidth } = scrollbarRef.current;
        const { scrollWidth, clientWidth: containerWidth } = scrollRef.current;

        const dragWidth = (containerWidth / scrollWidth) * trackWidth;
        const maxDragLeft = trackWidth - dragWidth;

        const rect = scrollbarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left - dragWidth / 2;
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
      window.addEventListener("mousemove", handleMouseMoveGlobal, {
        passive: false,
      });
      window.addEventListener("mouseup", handleMouseUpGlobal);
    }

    return () => {
      window.removeEventListener("resize", updateScrollIndicator);
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, [isDragging, isDraggingScrollbar, products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-8 py-16">
      <div className="flex justify-center gap-12 mb-12">
        <button className="text-[14px] tracking-widest border-b-2 border-black pb-2 font-medium">
          NEW ARRIVALS
        </button>
        <button className="text-[14px] tracking-widest text-gray-400 pb-2 hover:text-black transition-colors">
          BEST SELLER
        </button>
      </div>

      <div className="relative group/slider">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onScroll={updateScrollIndicator}
          className={`flex gap-8 overflow-x-auto pb-6 px-2 no-scrollbar select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            scrollBehavior:
              isDragging || isDraggingScrollbar ? "auto" : "smooth",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                if (!dragInfo.current.hasMoved) {
                  router.push(`/product/${product.slug}`);
                }
              }}
              className="text-center w-[280px] flex-shrink-0 group/card cursor-pointer"
            >
              <div className="watch-wrap relative transition mb-6 bg-white overflow-hidden">
                {product.tag && (
                  <span className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold px-2 py-1 tracking-wider z-10">
                    {product.tag}
                  </span>
                )}
                {product.hoverImage ? (
                  <>
                    <img
                      src={product.image || ""}
                      alt={product.name || ""}
                      className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 group-hover/card:opacity-0 pointer-events-none"
                    />
                    <img
                      src={product.hoverImage}
                      alt={`${product.name || ""} hover`}
                      className="absolute inset-0 rounded-lg  w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 pointer-events-none"
                    />
                  </>
                ) : (
                  <img
                    src={product.image || ""}
                    alt={product.name || ""}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                )}
                {product.emi && (
                  <span className="absolute bottom-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 tracking-wider z-10">
                    {product.emi}
                  </span>
                )}
              </div>
              <div className="space-y-2 px-2 pointer-events-none">
                <div className="text-[13px] text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">
                  {product.name || ""}
                </div>
                <div className="text-[13px] text-gray-900">{product.price}</div>
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
                      transitionDuration: isDraggingScrollbar ? "0ms" : "100ms",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shadow-sm text-gray-600 cursor-pointer pointer-events-auto text-sm"
              >
                ‹
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shadow-sm text-gray-600 cursor-pointer pointer-events-auto text-sm"
              >
                ›
              </button>
            </div>
          </div>
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
