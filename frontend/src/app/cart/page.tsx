"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    shippingFee,
    freeShippingThreshold,
    total,
  } = useCart();
  const router = useRouter();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput);
    setCouponMessage({ text: res.message, success: res.success });
    if (res.success) setCouponInput('');
  };

  return (
    <main className="min-h-screen bg-white pt-10 pb-24">
      <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-gray-500 tracking-[0.1em] uppercase mb-8 flex gap-2">
          <Link href="/" className="hover:text-[#4e342e] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Bag</span>
        </nav>

        <h1 className="text-[32px] md:text-[38px] font-serif text-gray-900 mb-8 uppercase tracking-wide">
          Your Shopping Bag
        </h1>

        {items.length === 0 ? (
          <div className="bg-[#faf9f8] p-16 text-center rounded-sm max-w-2xl mx-auto my-12">
            <h2 className="font-serif text-2xl text-gray-800 mb-3">Your Bag is Empty</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 font-light">
              Explore our handcrafted collections of timeless sarees, kurta sets, and festive silhouettes.
            </p>
            <Link 
              href="/collections/new-arrivals"
              className="inline-block px-10 py-4 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors"
            >
              Discover Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 divide-y divide-gray-100 border-t border-b border-gray-100">
              {/* Free shipping banner */}
              <div className="py-4 bg-[#faf9f8] px-4 my-2">
                <div className="text-xs text-gray-700 tracking-wide mb-1 flex justify-between">
                  {amountNeeded === 0 ? (
                    <span className="text-emerald-700 font-medium">✨ You qualify for FREE shipping!</span>
                  ) : (
                    <span>Add <strong className="text-[#4e342e]">₹{amountNeeded.toLocaleString()}</strong> more to get <strong>FREE Delivery</strong></span>
                  )}
                  <span className="font-mono text-gray-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4e342e] transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="py-6 flex gap-6 items-center">
                  <Link href={`/products/${item.slug}`} className="relative w-24 h-32 bg-gray-50 shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link href={`/products/${item.slug}`} className="font-serif text-base text-gray-900 hover:text-[#4e342e] transition-colors block">
                          {item.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                          Size: <span className="font-bold text-gray-800">{item.size}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1"
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-[#4e342e]">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.originalPrice > item.price && (
                          <div className="text-xs text-gray-400 line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-[#faf9f8] p-8 border border-gray-200/60 sticky top-28 space-y-6">
              <h3 className="font-serif text-lg tracking-wide uppercase text-gray-900 border-b border-gray-200 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs tracking-wide text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({promoCode})</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-serif text-gray-900 font-bold">
                  <span>Total</span>
                  <span className="text-[#4e342e]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. AVYARA10)"
                    className="flex-1 text-xs border border-gray-200 px-3 py-2.5 outline-none bg-white focus:border-[#4e342e]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[11px] mt-2 ${couponMessage.success ? 'text-emerald-700' : 'text-red-500'}`}>
                    {couponMessage.text}
                  </p>
                )}
                {promoCode && (
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-[11px] text-gray-400 hover:text-red-500 mt-1 underline"
                  >
                    Remove coupon ({promoCode})
                  </button>
                )}
              </form>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors shadow-sm cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <div className="text-[11px] text-gray-500 space-y-2 pt-2 border-t border-gray-200/60 font-light">
                <div className="flex items-center gap-2">
                  <span>🔒</span> Safe & encrypted 256-bit payment checkout
                </div>
                <div className="flex items-center gap-2">
                  <span>✨</span> Free exchanges & 7-day hassle-free return window
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
