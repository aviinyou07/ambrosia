"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCarousel({ category }: { category?: string }) {
  const categoryLower = (category || 'kurta sets').toLowerCase();
  const carouselRef = useRef<HTMLDivElement>(null);

  let categoryKey = 'kurta';
  if (categoryLower.includes('saree')) categoryKey = 'saree';
  else if (categoryLower.includes('lehenga')) categoryKey = 'lehenga';
  else if (categoryLower.includes('anarkali')) categoryKey = 'anarkali';
  else if (categoryLower.includes('palazzo')) categoryKey = 'palazzo';
  else if (categoryLower.includes('sharara')) categoryKey = 'sharara';
  else if (categoryLower.includes('gown')) categoryKey = 'gown';
  else if (categoryLower.includes('indo-western') || categoryLower.includes('fusion')) categoryKey = 'fusion';

  const allImages = Array.from({ length: 8 }).map((_, i) => `/images/generated_${categoryKey}_${i + 1}.svg`);

  const categories = [
    { title: `Designer ${category || 'Collection'}`, image: allImages[0] },
    { title: `Classic ${category || 'Collection'}`, image: allImages[1 % allImages.length] },
    { title: `Festive ${category || 'Collection'}`, image: allImages[2 % allImages.length] },
    { title: `Wedding ${category || 'Collection'}`, image: allImages[3 % allImages.length] },
    { title: `Modern ${category || 'Collection'}`, image: allImages[4 % allImages.length] },
  ];

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const targetCategorySlug = categoryLower.replace(/\s+/g, '-');

  return (
    <section className="pt-8 pb-16 bg-white overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-10">
          <button 
            onClick={scrollLeft}
            className="text-gray-400 hover:text-black p-2 transition-colors cursor-pointer"
            aria-label="Previous styles"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 className="text-[28px] md:text-[32px] font-serif text-gray-800 tracking-wide">
            {category || 'Collection'} styles
          </h2>
          <button 
            onClick={scrollRight}
            className="text-gray-400 hover:text-black p-2 transition-colors cursor-pointer"
            aria-label="Next styles"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        {/* Carousel Container */}
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar snap-x pb-4"
        >
          {categories.map((cat, index) => (
            <Link 
              href={`/collections/${targetCategorySlug}?style=${encodeURIComponent(cat.title)}`} 
              key={index} 
              className="relative flex-none w-[280px] md:w-[320px] aspect-square group snap-start block"
            >
              {/* Leaf Shape Container */}
              <div 
                className="w-full h-full relative overflow-hidden"
                style={{ borderTopLeftRadius: '120px', borderBottomRightRadius: '120px' }}
              >
                <Image 
                  src={cat.image} 
                  alt={cat.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <h3 className="text-white text-[18px] md:text-[20px] font-serif tracking-wide leading-snug">
                    {cat.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
