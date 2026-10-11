"use client";
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function WatchAndBuy() {
  const { addToCart } = useCart();

  const items = [
    { 
      id: 'wb-1', 
      title: 'Simple Everyday Cotton Kurti', 
      slug: 'simple-everyday-cotton-kurti',
      priceNum: 999,
      price: 'Rs. 999', 
      image: '/images/silk_kurta_1789621596703.jpg',
      video: '/videos/ethnic_00001.f616.mp4' 
    },
    { 
      id: 'wb-2', 
      title: 'Vibrant Punjabi Salwar Suit Set', 
      slug: 'vibrant-punjabi-salwar-suit-set',
      priceNum: 1699,
      price: 'Rs. 1,699', 
      image: '/images/coord_set_1789621584844.jpg',
      video: '/videos/ethnic_00002.f399.mp4' 
    },
    { 
      id: 'wb-3', 
      title: 'Floral Block Print Cotton Kurta Set', 
      slug: 'floral-block-print-cotton-kurta-set',
      priceNum: 2699,
      price: 'Rs. 2,699', 
      image: '/images/ethnic_kurta_set_1789624822973.jpg',
      video: '/videos/ethnic_00003.f399.mp4' 
    },
    { 
      id: 'wb-4', 
      title: 'Casual Printed Cotton Suit with Dupatta', 
      slug: 'casual-printed-cotton-suit-with-dupatta',
      priceNum: 1499,
      price: 'Rs. 1,499', 
      image: '/images/floral_nightwear_1789621619671.jpg',
      video: '/videos/ethnic_00004.f399.mp4' 
    },
    { 
      id: 'wb-5', 
      title: 'Modern Indo-Western Fusion Dress', 
      slug: 'modern-indo-western-fusion-dress',
      priceNum: 2499,
      price: 'Rs. 2,499', 
      image: '/images/indowestern_dress_1_1789625141642.jpg',
      video: '/videos/ethnic_00001.f616.mp4' 
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-10 text-gray-800">
          Watch & Buy
        </h2>
        
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-4">
          {items.map((item) => (
            <Link 
              href={`/products/${item.slug}`} 
              key={item.id} 
              className="min-w-[260px] md:min-w-[280px] h-[450px] relative rounded-xl overflow-hidden shrink-0 snap-center group cursor-pointer block"
            >
              <div className="absolute inset-0 bg-gray-200">
                <video 
                  src={item.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] pill-label py-2.5 px-4 flex items-center justify-between gap-3 z-10 transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-brand-pink shrink-0 overflow-hidden relative flex items-center justify-center text-xs font-bold text-[#4e342e]">
                    ✨
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-[11px] font-medium text-gray-800 truncate">{item.title}</span>
                    <span className="text-[12px] font-bold text-[#4e342e]">{item.price}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart({
                      id: item.id,
                      title: item.title,
                      slug: item.slug,
                      price: item.priceNum,
                      originalPrice: item.priceNum * 1.5,
                      image: item.image,
                      size: 'M',
                    });
                  }}
                  className="px-2.5 py-1 bg-[#4e342e] text-white text-[10px] font-semibold uppercase tracking-wider rounded-sm shrink-0 hover:bg-[#3e2a25] transition-colors"
                  title="Quick add to bag"
                >
                  + Add
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
