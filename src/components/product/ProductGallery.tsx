'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:w-24 shrink-0 py-2 lg:py-0">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`relative w-20 h-24 lg:w-full lg:h-32 shrink-0 overflow-hidden bg-gray-50 border transition-colors ${
              selectedImage === img ? 'border-gray-800' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[800px] bg-gray-50 overflow-hidden flex-grow">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Product Main Image"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}
      </div>
    </div>
  );
}
