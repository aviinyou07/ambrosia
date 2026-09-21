import React from 'react';
import Link from 'next/link';

export default function EverydayEssentials() {
  return (
    <section className="w-full bg-[#dfdedc] py-24 md:py-32 flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <span className="text-[11px] font-semibold text-white tracking-[0.2em] uppercase mb-6 opacity-90">
          New Needs Now
        </span>
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-wide" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          ETHNIC ESSENTIALS
        </h2>
        <p className="text-white text-[15px] mb-10 opacity-90 tracking-wide font-light">
          Stay Ahead of the Curve with Our Freshly Added Collections!
        </p>
        <Link 
          href="#" 
          className="bg-[#1a1a1a] text-white px-10 py-3 text-[11px] font-semibold tracking-[0.2em] hover:bg-black transition-colors uppercase"
        >
          Explore
        </Link>
      </div>
    </section>
  );
}
