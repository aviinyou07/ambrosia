"use client";
import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchProducts, Product, PRODUCTS } from '@/data/products';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = use(searchParams);
  const initialQuery = resolvedParams.q || '';
  const router = useRouter();

  const [inputVal, setInputVal] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (initialQuery.trim()) {
      setResults(searchProducts(initialQuery));
      setInputVal(initialQuery);
    } else {
      setResults(PRODUCTS.slice(0, 8));
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  const handlePillClick = (term: string) => {
    setInputVal(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8">
        
        {/* Header Search Bar */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.25em] uppercase mb-2 block">
            Discover
          </span>
          <h1 className="text-[32px] md:text-[38px] font-serif text-gray-900 mb-8 tracking-wide">
            Search Collections
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search by silhouette, fabric, color, or style..."
              className="w-full py-4 pl-6 pr-14 border border-gray-300 text-sm outline-none focus:border-[#4e342e] shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4e342e] p-2 hover:opacity-75 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>

          {/* Quick pills */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs text-gray-400 self-center mr-1">Popular:</span>
            {['Cotton Kurta', 'Silk Saree', 'Lehenga', 'Anarkali', 'Sharara', 'Palazzo'].map((term) => (
              <button
                key={term}
                onClick={() => handlePillClick(term)}
                className="text-xs bg-[#faf9f8] border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-[#4e342e] hover:text-white transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="border-b border-gray-100 pb-4 mb-10 flex justify-between items-center text-xs text-gray-500">
          <span>
            {initialQuery.trim() ? (
              <>Showing results for: <strong className="text-gray-900 font-medium">"{initialQuery}"</strong></>
            ) : (
              <>Trending selections</>
            )}
          </span>
          <span>{results.length} items found</span>
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="text-center py-20 bg-[#faf9f8] max-w-xl mx-auto rounded-sm">
            <h3 className="font-serif text-xl text-gray-800 mb-2">No Matching Products</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              We couldn't find anything matching "{initialQuery}". Try searching with broader terms or browse our categories.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/collections/kurta-sets" 
                className="px-6 py-2.5 bg-[#4e342e] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3e2a25]"
              >
                Kurta Sets
              </Link>
              <Link 
                href="/collections/sarees" 
                className="px-6 py-2.5 border border-[#4e342e] text-[#4e342e] text-xs font-semibold uppercase tracking-wider hover:bg-gray-50"
              >
                Sarees
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {results.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group block">
                <div className="relative w-full aspect-[3/4] mb-4 bg-gray-50 overflow-hidden">
                  <Image
                    src={product.images[0] || '/images/ethnic_kurta_set_1789624822973.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
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
        )}

      </div>
    </main>
  );
}
