"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const displayImages = images && images.length > 0 ? images : ['/images/ethnic_kurta_set_1789624822973.jpg'];
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6 sticky top-24">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible hide-scrollbar order-2 md:order-1 w-full md:w-[100px] flex-none">
        {displayImages.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`relative w-20 md:w-full aspect-[3/4] flex-none overflow-hidden transition-all duration-300 ${
              activeImage === idx ? 'ring-1 ring-[#4e342e] ring-offset-2 opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              fill 
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-gray-50 overflow-hidden order-1 md:order-2">
        <Image 
          src={displayImages[activeImage] || displayImages[0]} 
          alt="Product Image" 
          fill 
          priority
          className="object-cover transition-opacity duration-500"
        />
      </div>
    </div>
  );
}
