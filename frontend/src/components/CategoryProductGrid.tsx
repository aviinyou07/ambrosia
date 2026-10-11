"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductsByCategory, PRODUCTS, Product } from '@/data/products';

interface CategoryProductGridProps {
  category?: string;
  categorySlug?: string;
  maxPrice?: number;
  styleFilter?: string;
}

export default function CategoryProductGrid({ 
  category, 
  categorySlug, 
  maxPrice, 
  styleFilter 
}: CategoryProductGridProps) {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [visibleCount, setVisibleCount] = useState(8);

  const rawProducts = useMemo(() => {
    let list: Product[] = [];
    if (categorySlug) {
      list = getProductsByCategory(categorySlug);
    } else if (category) {
      const slug = category.toLowerCase().replace(/\s+/g, '-');
      list = getProductsByCategory(slug);
    } else {
      list = PRODUCTS;
    }

    if (list.length === 0) {
      list = PRODUCTS;
    }

    if (maxPrice) {
      list = list.filter(p => p.price <= maxPrice);
    }

    if (styleFilter) {
      const s = styleFilter.toLowerCase();
      const styleFiltered = list.filter(p => p.style && p.style.toLowerCase().includes(s));
      if (styleFiltered.length > 0) list = styleFiltered;
    }

    return list;
  }, [category, categorySlug, maxPrice, styleFilter]);

  const sortedProducts = useMemo(() => {
    const copy = [...rawProducts];
    if (sortBy === 'price-asc') {
      return copy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return copy.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return copy.sort((a, b) => (b.tag === 'New arrival' ? 1 : 0) - (a.tag === 'New arrival' ? 1 : 0));
    }
    return copy;
  }, [rawProducts, sortBy]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const displayTitle = category || 'Collection';

  return (
    <section className="pb-24 bg-white">
      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Title and Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-serif text-gray-800 tracking-wide uppercase">
              All {displayTitle}
            </h2>
            <span className="text-xs text-gray-400 font-light">
              Showing {Math.min(visibleCount, sortedProducts.length)} of {sortedProducts.length} styles
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500 uppercase tracking-wider text-[11px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-200 px-3 py-2 outline-none text-gray-700 bg-white focus:border-[#4e342e] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 transition-all duration-500">
          {sortedProducts.slice(0, visibleCount).map((product) => (
            <Link 
              href={`/products/${product.slug}`} 
              key={product.id} 
              className="group block"
            >
              <div className="relative w-full aspect-[3/4] mb-4 bg-gray-50 overflow-hidden">
                <Image
                  src={product.images[0] || '/images/ethnic_kurta_set_1789624822973.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Discount Tag */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-[#b52a5c] text-white text-[10px] md:text-[11px] font-semibold px-2.5 py-1 tracking-wider uppercase">
                    {product.discountPercentage}% off
                  </div>
                )}
                {product.tag && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white text-[9px] font-medium px-2 py-0.5 tracking-wider uppercase">
                    {product.tag}
                  </div>
                )}
              </div>

              <div className="text-center px-2">
                <h3 className="text-[13px] md:text-[14px] text-gray-700 tracking-wide mb-2 line-clamp-1">
                  {product.title}
                </h3>
                <div className="flex justify-center items-center gap-3">
                  <span className="text-[#4e342e] font-semibold text-[14px]">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-gray-400 line-through text-[12px]">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Load More Button */}
        {visibleCount < sortedProducts.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-10 py-3 bg-white border border-[#4e342e] text-[#4e342e] text-[13px] font-semibold tracking-[0.2em] uppercase hover:bg-[#4e342e] hover:text-white transition-colors duration-300 cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
