import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AsSeenInVogue() {
  return (
    <section className="py-24 bg-white overflow-hidden border-b border-gray-100">
      <div className="w-full relative whitespace-nowrap mb-24 opacity-90 overflow-hidden flex items-center">
        <h3 className="text-[32px] md:text-[44px] font-serif text-gray-800 tracking-wide leading-none animate-[marquee_20s_linear_infinite]">
          100% Premium | Effortless | Luxe | Chic | Elegant | Serene | Timeless | 100% Premium | Effortless | Luxe | Chic | Elegant | Serene | Timeless | 100% Premium | Effortless | Luxe | Chic | Elegant | Serene | Timeless |
        </h3>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32">
          {/* Left Side - Image Collage/Mock */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
            {/* Main Editorial Image */}
            <div className="relative w-full max-w-[450px] aspect-[4/5] shadow-2xl bg-white p-4">
              <div className="relative w-full h-full border border-gray-100">
                <Image 
                  src="/images/indowestern_dress_1_1789625141642.jpg" 
                  alt="As seen in Vogue feature" 
                  fill 
                  className="object-cover"
                />
              </div>
              {/* Fake Vogue Header */}
              <div className="absolute top-0 left-0 w-full h-12 bg-white flex justify-center items-center border-b border-gray-100">
                <span className="font-serif text-lg tracking-[0.2em] font-bold">VOGUE</span>
              </div>
            </div>
            
            {/* Small Floating Image (Optional, recreating the multi-image look) */}
            <div className="absolute -left-4 md:-left-12 bottom-12 w-[200px] aspect-[3/4] shadow-xl bg-white p-2 hidden sm:block">
               <div className="relative w-full h-full">
                 <Image src="/images/ethnic_lehenga_1789624855314.jpg" alt="Vogue feature detail" fill className="object-cover" />
               </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <h2 className="text-[32px] md:text-[42px] font-serif text-gray-900 mb-6 tracking-wide leading-tight">
              As Seen In VOGUE
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed max-w-md mb-10 font-light tracking-wide">
              Avyara was proudly featured in VOGUE India for redefining ethnic wear with comfort, elevated design, and effortless style. Experience the collection that everyone is talking about.
            </p>
            <Link 
              href="/about" 
              className="bg-[#1a1a1a] text-white px-8 py-3.5 text-[11px] font-semibold tracking-[0.2em] hover:bg-black transition-colors uppercase flex items-center gap-3"
            >
              <span>-</span> READ THE FEATURE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
