"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryProductGrid({ category }: { category?: string }) {
  const categoryLower = (category || 'kurta sets').toLowerCase();
  
  let defaultImage = '/images/ethnic_kurta_set_1789624822973.jpg';

  let categoryKey = 'kurta';
  if (categoryLower.includes('saree')) categoryKey = 'saree';
  else if (categoryLower.includes('lehenga')) categoryKey = 'lehenga';
  else if (categoryLower.includes('anarkali')) categoryKey = 'anarkali';
  else if (categoryLower.includes('palazzo')) categoryKey = 'palazzo';
  else if (categoryLower.includes('sharara')) categoryKey = 'sharara';
  else if (categoryLower.includes('gown')) categoryKey = 'gown';
  else if (categoryLower.includes('indo-western') || categoryLower.includes('fusion')) categoryKey = 'fusion';

  const allImages = Array.from({ length: 8 }).map((_, i) => `/images/generated_${categoryKey}_${i + 1}.svg`);

  const allProducts = Array.from({ length: 12 }).map((_, i) => {
    const basePrice = 3000 + (i * 500);
    const discountedPrice = Math.round(basePrice * 0.6);
    return {
      id: i + 1,
      title: `Premium ${category || 'Kurta Set'} - Style ${i + 1}`,
      image: allImages[i % allImages.length],
      originalPrice: `₹${basePrice.toLocaleString()}`,
      discountedPrice: `₹${discountedPrice.toLocaleString()}`,
      discount: '40% off'
    };
  });

  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };

  return (
    <section className="pb-24 bg-white">
      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-[28px] md:text-[32px] font-serif text-center mb-12 text-gray-800 tracking-wide uppercase">
          All {category || 'Kurta Sets'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 transition-all duration-500">
          {allProducts.slice(0, visibleCount).map((product) => (
            <Link href="/products/demo-product" key={product.id} className="group block animate-fade-in-up">
              <div className="relative w-full aspect-[3/4] mb-4 bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Discount Tag */}
                <div className="absolute top-4 right-4 bg-[#b52a5c] text-white text-[10px] md:text-[11px] font-semibold px-3 py-1 tracking-wider uppercase">
                  {product.discount}
                </div>
              </div>

              <div className="text-center px-2">
                <h3 className="text-[13px] md:text-[14px] text-gray-700 tracking-wide mb-2">
                  {product.title}
                </h3>
                <div className="flex justify-center items-center gap-3">
                  <span className="text-[#4e342e] font-semibold text-[14px]">
                    {product.discountedPrice}
                  </span>
                  <span className="text-gray-400 line-through text-[12px]">
                    {product.originalPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Load More Button */}
        {visibleCount < allProducts.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-10 py-3 bg-white border border-[#4e342e] text-[#4e342e] text-[13px] font-semibold tracking-[0.2em] uppercase hover:bg-[#4e342e] hover:text-white transition-colors duration-300"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
