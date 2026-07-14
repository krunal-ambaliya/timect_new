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
          bgColor="#0a1e36"
          textColor="#ffffff"
          borderColor="#0a1e36"
          hoverBgColor="#fff"
          hoverTextColor="#000 "
          className="w-full py-4 font-semibold text-sm tracking-wide"
        >
          Enquire About Availability
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
