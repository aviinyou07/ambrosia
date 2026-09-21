import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedCategories() {
  return (
    <section className="py-12 bg-white">
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          
          {/* Banner 1 */}
          <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-[16/10] overflow-hidden group">
            <Image 
              src="/images/ethnic_saree_1789624840596.jpg" 
              alt="Designer Sarees" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Overlay gradient to ensure text readability */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
              <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase mb-3 opacity-90">
                DESIGNER SAREES
              </span>
              <h3 className="text-[24px] md:text-[28px] font-serif leading-tight mb-6 max-w-md">
                Comfortable premium silk sarees designed for elegance and grace.
              </h3>
              <div>
                <Link 
                  href="#" 
                  className="bg-[#1a1a1a] text-white px-8 py-3 text-[11px] font-semibold tracking-[0.2em] hover:bg-white hover:text-black transition-colors uppercase inline-block"
                >
                  SHOP
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-[16/10] overflow-hidden group">
            <Image 
              src="/images/ethnic_lehenga_1789624855314.jpg" 
              alt="Luxury Lehengas" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Overlay gradient to ensure text readability */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
              <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase mb-3 opacity-90">
                LUXURY LEHENGAS
              </span>
              <h3 className="text-[24px] md:text-[28px] font-serif leading-tight mb-6 max-w-md">
                Discover breathtaking lehengas designed for unforgettable celebrations.
              </h3>
              <div>
                <Link 
                  href="#" 
                  className="bg-[#1a1a1a] text-white px-8 py-3 text-[11px] font-semibold tracking-[0.2em] hover:bg-white hover:text-black transition-colors uppercase inline-block"
                >
                  SHOP
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
