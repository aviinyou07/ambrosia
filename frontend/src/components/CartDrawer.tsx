"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    cartCount,
  } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[420px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg tracking-wide text-gray-900 uppercase">
              Shopping Bag
            </h2>
            <span className="text-xs bg-[#4e342e] text-white px-2 py-0.5 rounded-full font-medium">
              {cartCount}
            </span>
          </div>
          <button 
            onClick={closeCart}
            className="text-gray-400 hover:text-black p-1 transition-colors"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#faf9f8] px-6 py-3.5 border-b border-gray-100">
          <div className="text-[12px] text-gray-700 tracking-wide mb-1.5 flex justify-between">
            {amountNeeded === 0 ? (
              <span className="text-emerald-700 font-medium">✨ You've unlocked FREE Shipping!</span>
            ) : (
              <span>Add <strong className="text-[#4e342e]">₹{amountNeeded.toLocaleString()}</strong> more for <strong>FREE Shipping</strong></span>
            )}
            <span className="text-gray-400 font-mono text-[11px]">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4e342e] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#faf9f8] flex items-center justify-center text-gray-300 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-2">Your Bag is Empty</h3>
              <p className="text-xs text-gray-500 max-w-[240px] mb-6 leading-relaxed">
                Discover our handcrafted festive silhouettes and luxurious ethnic wear.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/collections/new-arrivals');
                }}
                className="px-6 py-3 bg-[#4e342e] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#3e2a25] transition-colors"
              >
                Shop New Arrivals
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="py-4 flex gap-4 items-start">
                <Link 
                  href={`/products/${item.slug}`} 
                  onClick={closeCart}
                  className="relative w-20 h-24 bg-gray-50 shrink-0 overflow-hidden block"
                >
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover" 
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link 
                      href={`/products/${item.slug}`} 
                      onClick={closeCart}
                      className="text-xs font-medium text-gray-800 hover:text-[#4e342e] transition-colors line-clamp-1 leading-snug"
                    >
                      {item.title}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-red-500 p-0.5 transition-colors"
                      title="Remove item"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-500 mt-1">
                    Size: <span className="font-medium text-gray-800">{item.size}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, -1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 text-xs transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#4e342e]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                      {item.originalPrice > item.price && (
                        <div className="text-[10px] text-gray-400 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 uppercase tracking-wider text-xs">Subtotal</span>
              <span className="font-serif text-lg text-gray-900 font-semibold">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-light">
              Taxes included. Shipping calculated at checkout.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleViewCart}
                className="w-full py-3 border border-[#4e342e] text-[#4e342e] text-xs font-semibold tracking-[0.15em] uppercase hover:bg-gray-50 transition-colors"
              >
                View Cart
              </button>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#3e2a25] transition-colors shadow-sm"
              >
                Checkout
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
