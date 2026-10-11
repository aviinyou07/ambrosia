import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.25em] uppercase mb-3 block">
            Our Heritage
          </span>
          <h1 className="text-[36px] md:text-[50px] font-serif text-gray-900 mb-6 tracking-wide leading-tight">
            Elegance in Every Thread
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">
            Avyara was founded with a quiet promise: to celebrate the timeless poetry of Indian textiles while crafting silhouettes that breathe with modern ease, comfort, and quiet luxury.
          </p>
        </div>

        {/* Feature Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-24">
          <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden shadow-xl">
            <Image 
              src="/images/ethnic_kurta_set_1789624822973.jpg" 
              alt="Artisanal craftsmanship" 
              fill 
              className="object-cover" 
            />
          </div>

          <div className="space-y-6 text-gray-600 text-sm font-light leading-relaxed">
            <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase block">
              The Philosophy
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug">
              Ethnic wear created for women who live boldly and celebrate deeply.
            </h2>
            <p>
              Every ensemble begins at the loom. From pure Chanderi silks woven under the morning sun to hand-carved wooden block prints stamped in Sanganer, we partner directly with generational master artisans.
            </p>
            <p>
              We reject rigid, stiff occasionwear. Instead, we select fluid georgettes, breathable cambric cottons, and featherlight organzas so you never feel restricted whether dancing at a sangeet or hosting a festive dinner at home.
            </p>
          </div>
        </div>

        {/* Vogue Mention Section */}
        <div className="bg-[#faf9f8] p-10 md:p-16 border border-gray-100 text-center mb-24 rounded-sm">
          <span className="font-serif text-2xl tracking-[0.2em] text-gray-900 font-bold block mb-4">
            VOGUE INDIA
          </span>
          <blockquote className="font-serif text-lg md:text-xl text-gray-800 italic max-w-2xl mx-auto mb-6 leading-relaxed">
            "Avyara redefines modern ethnic luxury — bridging the gap between regal ceremonial grace and day-long effortless comfort."
          </blockquote>
          <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">
            — Vogue Fashion Feature
          </span>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8 border-t border-gray-100 mb-16">
          <div className="space-y-2">
            <h3 className="font-serif text-lg text-gray-900">100% Breathable Fabrics</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Tested for pure drape, breathability, and enduring softness across seasons.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg text-gray-900">Artisan Empowerment</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Ethically crafted with fair wages and sustainable textile practices.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg text-gray-900">Tailored Perfection</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Thoughtful seams, generous margins, and fits designed to flatter every body shape.
            </p>
          </div>
        </div>

        <div className="text-center pt-10">
          <Link
            href="/collections/new-arrivals"
            className="px-10 py-4 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors"
          >
            Explore The Collection
          </Link>
        </div>

      </div>
    </main>
  );
}
