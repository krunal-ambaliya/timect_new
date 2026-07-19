"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/Button";

interface ProductVariant {
  id: string;
  image: string;
  name: string;
}

interface ProductInfoProps {
  brand: string;
  title: string;
  subtitle: string;
  sizes: string[];
  price: string;
  priceSubtext: string;
  variants: ProductVariant[];
  selectedVariantId: string;
  onVariantSelect: (id: string) => void;
}

export default function ProductInfo({
  brand,
  title,
  subtitle,
  sizes,
  price,
  priceSubtext,
  variants,
  selectedVariantId,
  onVariantSelect,
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[1] || sizes[0]);

  const handleWhatsAppClick = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const msg = `Hi, I need help with ${title}${subtitle ? ` (${subtitle})` : ""} — ${price}\n${pageUrl}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Brand Badge */}
      <div>
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider border border-gray-200 text-gray-500">
          {brand}
        </span>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#0a1e36] tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-gray-600 text-sm">{subtitle}</p>
        <a
          href="#"
          className="text-sm underline mt-2 inline-block text-gray-500 hover:text-gray-900 transition-colors"
        >
          Read more
        </a>
      </div>

      {/* Case Size */}
      {sizes.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-3">Case size:</p>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  selectedSize === size
                    ? "border-[#009ceb] text-[#009ceb] bg-[#f0f8ff]"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="mt-4">
        <p className="text-xl font-bold text-[#0a1e36]">{price}</p>
        <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
          {priceSubtext}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-3">
        <Button
          onClick={handleWhatsAppClick}
          bgColor="#25D366"
          textColor="#ffffff"
          borderColor="#25D366"
          hoverBgColor="#128C7E"
          hoverTextColor="#ffffff"
          className="w-full py-4 font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Ask on WhatsApp
        </Button>
        <p className="text-xs text-gray-600 text-center mt-1">
          Available Exclusively at Corporate Boutiques and e-commerce
        </p>
      </div>

      {/* Variations */}
      {variants.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm font-medium mb-4">
            Available in {variants.length} variations
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => onVariantSelect(variant.id)}
                className={`relative w-14 h-16 border bg-white transition-all ${
                  selectedVariantId === variant.id
                    ? "border-gray-400 shadow-sm"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                <Image
                  src={variant.image}
                  alt={variant.name}
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </button>
            ))}
            {/* Show more variations placeholder */}
            <button className="w-14 h-16 border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <span className="text-xl leading-none font-light">+</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
