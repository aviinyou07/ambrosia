import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf9f8] px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-[120px] md:text-[150px] font-serif text-[#4e342e] leading-none tracking-tighter opacity-10">
          404
        </h1>
        
        <div className="relative -mt-16 md:-mt-20 z-10">
          <h2 className="text-[28px] md:text-[36px] font-serif text-gray-900 tracking-wide mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-light max-w-md mx-auto mb-10 leading-relaxed">
            We're sorry, the page you're looking for doesn't exist or has been moved. Let's get you back to discovering beautiful ethnic wear.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="px-8 py-3.5 bg-[#4e342e] text-white text-[12px] font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors duration-300"
            >
              Back to Home
            </Link>
            <Link 
              href="/collections/new-arrivals" 
              className="px-8 py-3.5 bg-white border border-[#4e342e] text-[#4e342e] text-[12px] font-semibold tracking-[0.2em] uppercase hover:bg-[#4e342e] hover:text-white transition-colors duration-300"
            >
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
