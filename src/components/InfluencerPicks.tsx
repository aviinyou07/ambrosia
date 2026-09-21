import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function InfluencerPicks() {
  const influencers = [
    { id: 1, image: '/images/ethnic_kurta_set_1789624822973.jpg', link: '#' },
    { id: 2, image: '/images/ethnic_palazzo_suit_1789624892265.jpg', link: '#' },
    { id: 3, image: '/images/ethnic_sharara_1789624905126.jpg', link: '#' },
    { id: 4, image: '/images/ethnic_fusion_wear_1789624920412.jpg', link: '#' },
  ];

  return (
    <section className="py-12 bg-white mb-24">
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {influencers.map((item) => (
            <Link href={item.link} key={item.id} className="group relative block aspect-[3/4] md:aspect-[4/5] overflow-hidden">
              <Image 
                src={item.image} 
                alt="Influencer pick" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[#a8e6cf] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                  TRENDING NOW:
                </p>
                <h3 className="text-white text-[20px] md:text-[24px] font-serif">
                  Influencer Picks
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
