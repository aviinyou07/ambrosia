import React from 'react';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import RelatedProducts from '@/components/RelatedProducts';
import Link from 'next/link';
import { getProductBySlug, PRODUCTS } from '@/data/products';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  const product = getProductBySlug(slug) || PRODUCTS[0];

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 py-6">
        <nav className="text-[11px] text-gray-500 tracking-[0.1em] uppercase flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#4e342e] transition-colors">Home</Link>
          <span>/</span>
          <Link 
            href={`/collections/${product.categorySlug}`} 
            className="hover:text-[#4e342e] transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[280px] sm:max-w-none">
            {product.title}
          </span>
        </nav>
      </div>

      {/* Main PDP Content */}
      <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Left: Gallery */}
          <div className="w-full md:w-3/5">
            <ProductGallery images={product.images} />
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-2/5">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts 
        categorySlug={product.categorySlug} 
        currentProductId={product.id} 
      />
    </main>
  );
}
