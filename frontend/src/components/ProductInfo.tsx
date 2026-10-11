"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import SizeGuideModal from './SizeGuideModal';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  const accordions = [
    {
      title: 'Product Description',
      content: product.description || 'Elegant ethnic wear crafted in premium breathable fabric.'
    },
    {
      title: 'Material & Care',
      content: product.materialAndCare || '100% Premium Cotton. Gentle hand wash or dry clean recommended.'
    },
    {
      title: 'Shipping & Returns',
      content: product.shippingAndReturns || 'Free standard shipping on all orders over ₹2000. Easy 7-day returns and exchanges.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || '/images/ethnic_kurta_set_1789624822973.jpg',
      size: selectedSize,
    }, 1);

    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || '/images/ethnic_kurta_set_1789624822973.jpg',
      size: selectedSize,
    }, 1);
    router.push('/checkout');
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header Info */}
      <div>
        <h1 className="text-[28px] md:text-[34px] font-serif text-gray-900 tracking-wide mb-3 leading-snug">
          {product.title}
        </h1>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[#4e342e] text-[22px] font-medium tracking-wide">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-[16px]">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="bg-[#b52a5c] text-white text-[10px] font-semibold px-2 py-1 uppercase tracking-wider">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm font-light">Tax included. Shipping calculated at checkout.</p>
      </div>

      {/* Size Selector */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-900 text-sm font-medium uppercase tracking-wide">
            Size: <span className="font-bold">{selectedSize}</span>
          </span>
          <button 
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-gray-500 text-[13px] underline hover:text-[#4e342e] transition-colors cursor-pointer"
          >
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`px-4 h-12 min-w-12 flex items-center justify-center text-[13px] border transition-all duration-200 cursor-pointer ${
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
        <button 
          type="button"
          onClick={handleAddToCart}
          className="w-full py-4 border border-[#4e342e] text-[#4e342e] bg-white font-medium tracking-[0.15em] uppercase text-[13px] hover:bg-[#4e342e] hover:text-white transition-colors cursor-pointer"
        >
          {isAddedFeedback ? '✓ Added to Bag!' : 'Add to Cart'}
        </button>
        <button 
          type="button"
          onClick={handleBuyNow}
          className="w-full py-4 border border-[#4e342e] bg-[#4e342e] text-white font-medium tracking-[0.15em] uppercase text-[13px] hover:bg-[#3e2a25] transition-colors cursor-pointer shadow-sm"
        >
          Buy it Now
        </button>
      </div>

      {/* Accordions */}
      <div className="mt-4 border-t border-gray-200">
        {accordions.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <button 
              type="button"
              className="w-full py-5 flex justify-between items-center text-left cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <span className="text-gray-900 text-[14px] font-medium tracking-wide uppercase">{item.title}</span>
              <span className="text-gray-400 text-xl font-light">
                {openAccordion === index ? '−' : '+'}
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openAccordion === index ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />
    </div>
  );
}
