"use client";
import React, { useState } from 'react';

export default function ProductInfo() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const accordions = [
    {
      title: 'Product Description',
      content: 'Elegant floral block print kurta set crafted in premium breathable cotton. The set includes a straight fit kurta with delicate embroidery on the neckline, paired with comfortable matching trousers and a lightweight mulmul dupatta.'
    },
    {
      title: 'Material & Care',
      content: '100% Premium Cotton. Hand wash cold separately. Do not bleach. Dry in shade. Iron on low heat.'
    },
    {
      title: 'Shipping & Returns',
      content: 'Free standard shipping on all orders over ₹2000. Easy 7-day returns and exchanges from the date of delivery. Custom-stitched items are non-returnable.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header Info */}
      <div>
        <h1 className="text-[28px] md:text-[34px] font-serif text-gray-900 tracking-wide mb-3 leading-snug">
          Floral Block Print Kurta Set
        </h1>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[#4e342e] text-[22px] font-medium tracking-wide">₹2,699</span>
          <span className="text-gray-400 line-through text-[16px]">₹4,499</span>
          <span className="bg-[#b52a5c] text-white text-[10px] font-semibold px-2 py-1 uppercase tracking-wider">40% OFF</span>
        </div>
        <p className="text-gray-500 text-sm font-light">Tax included. Shipping calculated at checkout.</p>
      </div>

      {/* Size Selector */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-900 text-sm font-medium uppercase tracking-wide">Size: <span className="font-bold">{selectedSize}</span></span>
          <button className="text-gray-500 text-[13px] underline hover:text-[#4e342e]">Size Guide</button>
        </div>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-12 flex items-center justify-center text-[13px] border transition-all duration-200 ${
                selectedSize === size 
                  ? 'border-[#4e342e] bg-[#4e342e] text-white' 
                  : 'border-gray-200 text-gray-700 hover:border-[#4e342e]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button className="w-full py-4 border border-[#4e342e] text-[#4e342e] bg-white font-medium tracking-[0.15em] uppercase text-[13px] hover:bg-[#4e342e] hover:text-white transition-colors">
          Add to Cart
        </button>
        <button className="w-full py-4 border border-[#4e342e] bg-[#4e342e] text-white font-medium tracking-[0.15em] uppercase text-[13px] hover:bg-[#3e2a25] transition-colors">
          Buy it Now
        </button>
      </div>

      {/* Accordions */}
      <div className="mt-4 border-t border-gray-200">
        {accordions.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <button 
              className="w-full py-5 flex justify-between items-center text-left"
              onClick={() => toggleAccordion(index)}
            >
              <span className="text-gray-900 text-[14px] font-medium tracking-wide uppercase">{item.title}</span>
              <span className="text-gray-400 text-xl font-light">
                {openAccordion === index ? '−' : '+'}
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openAccordion === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
