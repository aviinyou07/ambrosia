import React from 'react';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import CategoryCarousel from '@/components/CategoryCarousel';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Next.js 15 requires params to be awaited
  const resolvedParams = await params;
  const category = resolvedParams.category || '';
  
  // Format the category slug (e.g., 'new-arrivals' to 'New Arrivals')
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-white pt-24">
      {/* Category Header */}
      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-[32px] md:text-[40px] font-serif text-gray-800 tracking-wide uppercase">
          {formattedCategory}
        </h1>
        <div className="w-16 h-[2px] bg-[#4e342e] mx-auto mt-6"></div>
      </div>

      <CategoryCarousel category={formattedCategory} />
      <CategoryProductGrid category={formattedCategory} />
    </main>
  );
}
