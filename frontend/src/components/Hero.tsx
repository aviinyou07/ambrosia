import Image from 'next/image';
import React from 'react';

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-end">
      <div className="absolute inset-0 z-[-1]">
        <Image 
          src="/images/hero_banner_1789621566715.jpg" 
          alt="Comfort You'll Live In" 
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 md:px-8 pb-12 w-full">
        <h1 className="text-white text-5xl md:text-7xl font-serif font-light tracking-wide max-w-3xl leading-tight">
          COMFORT YOU'LL LIVE IN
        </h1>
      </div>
    </section>
  );
}
