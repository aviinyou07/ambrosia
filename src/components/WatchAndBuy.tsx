import React from 'react';
import Image from 'next/image';

export default function WatchAndBuy() {
  const items = [
    { id: 1, title: 'Sea Green Soft Crepe Shorts Co-...', price: 'Rs.1,499', video: '/videos/ethnic_00001.f616.mp4' },
    { id: 2, title: 'Rust Soft Crepe Pintuck Night...', price: 'Rs.2,200', video: '/videos/ethnic_00002.f399.mp4' },
    { id: 3, title: 'Sea Green Soft Crepe Shorts Co-...', price: 'Rs.1,499', video: '/videos/ethnic_00003.f399.mp4' },
    { id: 4, title: 'Blue Heritage Pure Cotton...', price: 'Rs.1,699', video: '/videos/ethnic_00004.f399.mp4' },
    { id: 5, title: 'Black Polka Dot V-Neck Night...', price: 'Rs.1,799', video: '/videos/ethnic_00001.f616.mp4' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-10 text-gray-800">
          Watch & Buy
        </h2>
        
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-4">
          {items.map((item) => (
            <div key={item.id} className="min-w-[260px] md:min-w-[280px] h-[450px] relative rounded-xl overflow-hidden shrink-0 snap-center group cursor-pointer">
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
              
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] pill-label py-2 px-4 flex items-center gap-3 z-10">
                <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0 overflow-hidden relative">
                   <div className="w-full h-full bg-brand-pink" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[11px] font-medium text-gray-800 truncate">{item.title}</span>
                  <span className="text-[12px] font-bold text-orange-600">{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
