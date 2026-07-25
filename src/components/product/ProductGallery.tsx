'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  // Keep selection in sync when switching product variants
  useEffect(() => {
    setSelectedImage(images[0] || '');
  }, [images]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 h-full max-w-[560px] lg:max-w-none mx-auto lg:mx-0">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:w-16 shrink-0 py-1 lg:py-0">
        {images.map((img, index) => (
          <button
            key={`${img}-${index}`}
            onClick={() => setSelectedImage(img)}
            className={`relative w-14 h-16 lg:w-full lg:h-20 shrink-0 overflow-hidden bg-gray-50 border transition-colors ${
              selectedImage === img ? 'border-gray-800' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="56px"
              className="object-contain p-0.5"
            />
          </button>
        ))}
      </div>

      {/* Main Image — compact so it doesn’t dominate the product detail layout */}
      <div className="relative w-full aspect-[4/5] max-h-[420px] lg:max-h-[520px] lg:h-[min(520px,70vh)] bg-gray-50 overflow-hidden flex-grow">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Product Main Image"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-contain p-2"
            priority
          />
        )}
      </div>
    </div>
  );
}
