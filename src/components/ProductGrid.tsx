import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProductGrid() {
  const products = [
    { id: 1, name: 'Simple Everyday Cotton Kurti', price: 'Rs. 1,200.00', oldPrice: 'Rs. 1,900.00', image: '/images/silk_kurta_1789621596703.jpg', tag: 'New arrival', discount: '36% off' },
    { id: 2, name: 'Vibrant Punjabi Salwar Suit Set', price: 'Rs. 2,899.00', oldPrice: 'Rs. 3,500.00', image: '/images/coord_set_1789621584844.jpg', tag: 'Bestseller', discount: '17% off' },
    { id: 3, name: 'Modern Indo-Western Midi Gown', price: 'Rs. 3,199.00', oldPrice: 'Rs. 4,000.00', image: '/images/indowestern_dress_1_1789625141642.jpg', tag: 'Trending', discount: '20% off' },
    { id: 4, name: 'Casual Printed Cotton Suit with Dupatta', price: 'Rs. 1,499.00', oldPrice: 'Rs. 2,000.00', image: '/images/floral_nightwear_1789621619671.jpg', tag: 'New arrival', discount: '25% off' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 uppercase tracking-widest mb-2">
            Summer Essentials
          </h2>
          <Link href="#" className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-black transition-colors">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link href="/products/demo-product" key={product.id} className="group block">
              <div className="relative aspect-[3/4] mb-4 bg-gray-100 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                  {product.tag && (
                    <div className="bg-[#cc5555] text-white text-[10px] uppercase tracking-wider px-2 py-1 font-medium">
                      {product.tag}
                    </div>
                  )}
                  {product.discount && (
                    <div className="bg-[#990099] text-white text-[10px] uppercase tracking-wider px-2 py-1 font-medium">
                      {product.discount}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center px-2">
                <h3 className="text-xs text-gray-600 font-medium mb-2 line-clamp-2 leading-relaxed">
                  {product.name}
                </h3>
                <div className="flex justify-center items-center gap-2 text-[13px]">
                  <span className="text-gray-900 font-medium">{product.price}</span>
                  {product.oldPrice && (
                    <span className="text-gray-400 line-through text-[12px]">{product.oldPrice}</span>
                  )}
                  {product.oldPrice && <span className="text-gray-900 text-[12px]">Sale</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
