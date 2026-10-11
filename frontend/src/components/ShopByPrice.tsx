import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ShopByPrice() {
  const pricePoints = [
    { 
      id: 1, 
      price: '999/-', 
      backImage: '/images/ethnic_kurta_set_1789624822973.jpg',
      frontImage: '/images/ethnic_saree_1789624840596.jpg' 
    },
    { 
      id: 2, 
      price: '1699/-', 
      backImage: '/images/ethnic_lehenga_1789624855314.jpg',
      frontImage: '/images/ethnic_anarkali_1789624868513.jpg'
    },
    { 
      id: 3, 
      price: '2599/-', 
      backImage: '/images/ethnic_palazzo_suit_1789624892265.jpg',
      frontImage: '/images/ethnic_sharara_1789624905126.jpg' 
    },
    { 
      id: 4, 
      price: '2999/-', 
      backImage: '/images/ethnic_fusion_wear_1789624920412.jpg',
      frontImage: '/images/indowestern_dress_1_1789625141642.jpg' 
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16">
        <h2 className="text-[32px] md:text-[36px] font-serif text-center mb-16 text-gray-800 tracking-wide">
          Shop By Price
        </h2>
        
        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          {pricePoints.map((item) => (
            <Link 
              href={`/collections/all?maxPrice=${item.price.replace('/-', '')}`} 
              key={item.id} 
              className="group relative block w-[260px] h-[300px] cursor-pointer"
            >
              {/* Background Pink Block */}
              <div className="absolute top-0 right-0 w-[130px] h-[130px] bg-[#f8e1e7] z-0 transition-transform duration-500 group-hover:scale-105" />
              
              {/* Back Image (Square-ish) */}
              <div className="absolute top-[40px] left-0 w-[150px] aspect-square z-10 overflow-hidden shadow-sm">
                 <Image 
                   src={item.backImage} 
                   alt={`Styles under ${item.price}`} 
                   fill 
                   className="object-cover transition-transform duration-700 group-hover:scale-105"
                 />
              </div>
              
              {/* Front Image (Portrait) */}
              <div className="absolute top-[20px] right-[10px] w-[140px] h-[200px] z-20 overflow-hidden shadow-md">
                 <Image 
                   src={item.frontImage} 
                   alt={`Styles under ${item.price}`} 
                   fill 
                   className="object-cover transition-transform duration-700 group-hover:scale-110"
                 />
              </div>
              
              {/* Text Information */}
              <div className="absolute bottom-[20px] left-0 z-30 text-left">
                 <div className="text-[10px] md:text-[11px] text-gray-500 uppercase tracking-widest leading-none mb-1.5">
                   Styles under
                 </div>
                 <div className="text-[26px] md:text-[28px] text-gray-900 leading-none">
                   {item.price}
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
