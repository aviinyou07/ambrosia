import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RelatedProducts() {
  const products = [
    { id: 2, title: 'Georgette Anarkali with Dupatta', image: '/images/ethnic_anarkali_1789624868513.jpg', originalPrice: '₹5,999', discountedPrice: '₹3,599', discount: '40% off' },
    { id: 3, title: 'Festive Palazzo Suit', image: '/images/ethnic_palazzo_suit_1789624892265.jpg', originalPrice: '₹4,999', discountedPrice: '₹2,999', discount: '40% off' },
    { id: 4, title: 'Silk Blend Sharara Set', image: '/images/ethnic_sharara_1789624905126.jpg', originalPrice: '₹6,499', discountedPrice: '₹3,899', discount: '40% off' },
    { id: 5, title: 'Classic Cotton Straight Kurta', image: '/images/ethnic_kurta_set_1789624822973.jpg', originalPrice: '₹3,499', discountedPrice: '₹2,099', discount: '40% off' },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#faf9f8] border-t border-gray-100">
      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-[24px] md:text-[28px] font-serif text-center mb-12 text-gray-800 tracking-wide uppercase">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
          {products.map((product) => (
            <Link href="/products/demo-product" key={product.id} className="group block">
              <div className="relative w-full aspect-[3/4] mb-4 bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-[#b52a5c] text-white text-[10px] md:text-[11px] font-semibold px-3 py-1 tracking-wider uppercase">
                  {product.discount}
                </div>
              </div>

              <div className="text-center px-2">
                <h3 className="text-[13px] md:text-[14px] text-gray-700 tracking-wide mb-2">
                  {product.title}
                </h3>
                <div className="flex justify-center items-center gap-3">
                  <span className="text-[#4e342e] font-semibold text-[14px]">
                    {product.discountedPrice}
                  </span>
                  <span className="text-gray-400 line-through text-[12px]">
                    {product.originalPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
