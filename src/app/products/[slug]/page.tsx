import React from 'react';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import RelatedProducts from '@/components/RelatedProducts';
import Link from 'next/link';

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 py-6">
        <nav className="text-[11px] text-gray-500 tracking-[0.1em] uppercase flex gap-2">
          <Link href="/" className="hover:text-[#4e342e] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections/kurta-sets" className="hover:text-[#4e342e] transition-colors">Kurta Sets</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Floral Block Print Kurta Set</span>
        </nav>
      </div>

      {/* Main PDP Content */}
      <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Left: Gallery */}
          <div className="w-full md:w-3/5">
            <ProductGallery />
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-2/5">
            <ProductInfo />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts />
    </main>
  );
}
