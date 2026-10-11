import React from 'react';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import CategoryCarousel from '@/components/CategoryCarousel';
import { getCategoryBySlug } from '@/data/categories';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ maxPrice?: string; style?: string; filter?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const categorySlug = resolvedParams.category || 'all';

  const categoryObj = getCategoryBySlug(categorySlug);

  // Format title (e.g. 'kurta-sets' to 'Kurta Sets')
  const formattedCategory = categoryObj 
    ? categoryObj.name 
    : categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  const maxPriceNum = resolvedSearchParams.maxPrice ? parseInt(resolvedSearchParams.maxPrice, 10) : undefined;
  const styleFilter = resolvedSearchParams.style || resolvedSearchParams.filter;

  return (
    <main className="min-h-screen bg-white pt-24">
      {/* Category Header */}
      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-[32px] md:text-[40px] font-serif text-gray-800 tracking-wide uppercase">
          {formattedCategory}
        </h1>
        {categoryObj?.description && (
          <p className="text-gray-500 text-sm max-w-xl mx-auto mt-2 font-light">
            {categoryObj.description}
          </p>
        )}
        <div className="w-16 h-[2px] bg-[#4e342e] mx-auto mt-6"></div>
      </div>

      <CategoryCarousel category={formattedCategory} />
      
      <CategoryProductGrid 
        category={formattedCategory} 
        categorySlug={categorySlug}
        maxPrice={maxPriceNum}
        styleFilter={styleFilter}
      />
    </main>
  );
}
