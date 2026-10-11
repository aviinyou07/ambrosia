import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';

interface RelatedProductsProps {
  categorySlug?: string;
  currentProductId?: string;
}

export default function RelatedProducts({ categorySlug, currentProductId }: RelatedProductsProps) {
  let matched = PRODUCTS.filter(p => p.id !== currentProductId);
  if (categorySlug) {
    const byCategory = matched.filter(p => p.categorySlug === categorySlug);
    if (byCategory.length > 0) {
      matched = byCategory;
    }
  }

  const displayProducts = matched.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-[#faf9f8] border-t border-gray-100">
      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-[24px] md:text-[28px] font-serif text-center mb-12 text-gray-800 tracking-wide uppercase">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
          {displayProducts.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="group block">
              <div className="relative w-full aspect-[3/4] mb-4 bg-gray-50 overflow-hidden">
                <Image
                  src={product.images[0] || '/images/ethnic_kurta_set_1789624822973.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-[#b52a5c] text-white text-[10px] md:text-[11px] font-semibold px-3 py-1 tracking-wider uppercase">
                    {product.discountPercentage}% off
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
      </div>
    </section>
  );
}
