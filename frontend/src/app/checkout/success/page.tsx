"use client";
import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = use(searchParams);
  const orderId = resolvedParams.orderId || 'AVY-89210';
  const { getOrderById } = useAuth();
  const order = getOrderById(orderId);

  return (
    <main className="min-h-screen bg-[#faf9f8] pt-12 pb-24">
      <div className="w-full max-w-[800px] mx-auto px-4 md:px-8">
        
        {/* Card */}
        <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 text-center rounded-sm">
          <div className="w-16 h-16 bg-[#faf3f0] text-[#4e342e] rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
            ✓
          </div>

          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.25em] uppercase mb-2 block">
            Order Confirmed
          </span>

          <h1 className="text-[28px] md:text-[34px] font-serif text-gray-900 mb-3 tracking-wide">
            Thank you for your order!
          </h1>

          <p className="text-gray-500 text-xs md:text-sm font-light max-w-md mx-auto mb-6 leading-relaxed">
            Your ethnic ensemble is being tailored and prepared with care. We have sent your order confirmation and tracking details to your email.
          </p>

          <div className="inline-block bg-[#faf9f8] border border-gray-200/80 px-6 py-3 rounded-sm mb-8">
            <span className="text-xs text-gray-500 uppercase tracking-widest mr-2">Order ID:</span>
            <span className="font-mono text-sm font-bold text-[#4e342e]">{orderId}</span>
          </div>

          {/* Order Details Preview */}
          {order && (
            <div className="border-t border-gray-100 pt-6 mb-8 text-left">
              <h3 className="font-serif text-sm uppercase tracking-wider text-gray-900 mb-4">
                Items in this order:
              </h3>
              <div className="divide-y divide-gray-100 mb-6">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-gray-50 shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-gray-400">Qty: {item.quantity} | Size: {item.size}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#faf9f8] p-4 text-xs text-gray-600 space-y-1">
                <div><strong>Delivery Address:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
                <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
                <div><strong>Estimated Delivery:</strong> 3-5 business days</div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3.5 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account"
              className="px-8 py-3.5 border border-[#4e342e] text-[#4e342e] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors"
            >
              View in My Orders
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
