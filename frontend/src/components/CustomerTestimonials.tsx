import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CustomerTestimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        {/* Header */}
        <div className="mb-16 md:mb-24 text-left md:ml-12">
          <h2 className="text-[32px] md:text-[40px] font-serif text-gray-900 mb-2 tracking-wide">
            Let customers speak for us
          </h2>
          <p className="text-gray-500 text-sm tracking-wide font-light">
            from 822 reviews
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
          {/* Left Side - Overlapping Images */}
          <div className="w-full md:w-[55%] relative h-[450px] md:h-[600px] flex justify-center items-center">
             {/* Back Image */}
             <div className="absolute left-[5%] md:left-[10%] top-0 w-[55%] h-[80%] z-10 shadow-sm">
                <Image 
                  src="/images/ethnic_saree_1789624840596.jpg" 
                  alt="Customer wearing saree" 
                  fill 
                  className="object-cover"
                />
             </div>
             
             {/* Front Image */}
             <div className="absolute right-[5%] md:right-[15%] bottom-0 w-[50%] h-[75%] z-20 shadow-xl bg-white p-2">
                <div className="relative w-full h-full">
                  <Image 
                    src="/images/ethnic_anarkali_1789624868513.jpg" 
                    alt="Customer wearing anarkali" 
                    fill 
                    className="object-cover"
                  />
                </div>
             </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full md:w-[40%] flex flex-col justify-center items-start text-left mt-10 md:mt-0 px-4 md:px-0 md:pr-12">
            <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-4">
              FESTIVE COLLECTION
            </span>
            <h3 className="text-[32px] md:text-[38px] font-serif text-gray-900 mb-6 leading-tight tracking-wide">
              Dream in Style,<br />Celebrate in Elegance
            </h3>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10 font-light tracking-wide">
              Our festive wear blends effortless grace with ultimate comfort, designed to make every celebration memorable. Crafted from premium, breathable fabrics and tailored with care, each piece feels like a dream you never want to take off. Discover ethnic wear that looks as good as it feels.
            </p>
            <Link 
              href="/collections/kurta-sets" 
              className="bg-[#1a1a1a] text-white px-10 py-3.5 text-[11px] font-semibold tracking-[0.2em] hover:bg-black transition-colors uppercase"
            >
              EXPLORE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
