"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const { items, subtotal, discount, shippingFee, total, clearCart } = useCart();
  const { createOrder, user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: user?.email || 'ananya.sharma@example.com',
    phone: user?.phone || '9876543210',
    firstName: 'Ananya',
    lastName: 'Sharma',
    address: 'Flat 402, Royal Palms, Palm Beach Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400706',
    paymentMethod: 'UPI',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        items,
        subtotal,
        discount,
        shippingFee,
        total,
        shippingAddress: {
          id: 'addr-' + Date.now(),
          fullName: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
      });

      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 text-center">
        <h2 className="font-serif text-2xl text-gray-900 mb-3">Your Bag is Empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add your favorite pieces before checking out.</p>
        <Link 
          href="/collections/new-arrivals" 
          className="px-8 py-3 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors"
        >
          Shop Now
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f8] pt-10 pb-24">
      <div className="w-full max-w-[1300px] mx-auto px-4 md:px-8">
        
        {/* Checkout Header */}
        <div className="text-center pb-10 border-b border-gray-200">
          <Link href="/" className="font-serif text-2xl tracking-[0.3em] uppercase text-gray-900 font-medium">
            AVYARA
          </Link>
          <div className="text-[11px] text-gray-500 uppercase tracking-widest mt-2 flex items-center justify-center gap-2">
            <span>Bag</span> <span>&gt;</span>
            <span className="text-[#4e342e] font-semibold">Checkout</span> <span>&gt;</span>
            <span>Confirmation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Contact Details */}
            <div className="bg-white p-6 md:p-8 shadow-xs border border-gray-100 rounded-sm">
              <h3 className="font-serif text-lg text-gray-900 uppercase tracking-wide mb-6">
                1. Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 px-3.5 py-2.5 outline-none focus:border-[#4e342e]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 px-3.5 py-2.5 outline-none focus:border-[#4e342e]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 md:p-8 shadow-xs border border-gray-100 rounded-sm">
              <h3 className="font-serif text-lg text-gray-900 uppercase tracking-wide mb-6">
                2. Shipping Address
              </h3>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 px-3.5 py-2.5 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 px-3.5 py-2.5 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                    Street Address / Flat / Floor *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 px-3.5 py-2.5 outline-none focus:border-[#4e342e]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 px-3.5 py-2.5 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 px-3.5 py-2.5 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 px-3.5 py-2.5 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 shadow-xs border border-gray-100 rounded-sm">
              <h3 className="font-serif text-lg text-gray-900 uppercase tracking-wide mb-6">
                3. Payment Method
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { id: 'UPI', label: 'UPI (Instant via Google Pay, PhonePe, Paytm)', desc: 'Scan QR code or enter UPI VPA' },
                  { id: 'Card', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex' },
                  { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay with cash upon package arrival' },
                ].map((option) => (
                  <label 
                    key={option.id}
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      formData.paymentMethod === option.id 
                        ? 'border-[#4e342e] bg-[#faf9f8]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.id}
                      checked={formData.paymentMethod === option.id}
                      onChange={handleChange}
                      className="mt-0.5 accent-[#4e342e]"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-gray-500 text-[11px] mt-0.5">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors cursor-pointer shadow-md disabled:opacity-60"
            >
              {isSubmitting ? 'Processing Order...' : `Place Order • ₹${total.toLocaleString()}`}
            </button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-gray-200/60 sticky top-28 shadow-xs rounded-sm">
            <h3 className="font-serif text-lg text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-4 mb-6">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            <div className="divide-y divide-gray-100 max-h-[360px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="py-3 flex gap-3 items-center">
                  <div className="relative w-14 h-18 bg-gray-50 shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#4e342e] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-gray-800 truncate">{item.title}</h4>
                    <span className="text-[10px] text-gray-400 uppercase">Size: {item.size}</span>
                  </div>
                  <div className="text-xs font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-200 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-serif font-bold text-gray-900">
                <span>Total Payable</span>
                <span className="text-[#4e342e]">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </main>
  );
}
