import React from 'react';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="w-full max-w-[900px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2 block">
            Customer Information
          </span>
          <h1 className="text-[32px] md:text-[38px] font-serif text-gray-900 mb-4 tracking-wide uppercase">
            Shipping & Delivery Policy
          </h1>
          <div className="w-16 h-[2px] bg-[#4e342e] mx-auto"></div>
        </div>

        <div className="prose prose-neutral max-w-none text-xs md:text-sm text-gray-600 font-light space-y-8 leading-relaxed">
          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">1. Domestic Shipping Timelines</h2>
            <p>
              We dispatch all orders within <strong>24 to 48 business hours</strong> of confirmation. Orders are shipped via our premium courier partners (Bluedart, Delhivery, and DTDC Express). You can expect delivery within:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-700">
              <li><strong>Metro Cities:</strong> 2 to 4 business days</li>
              <li><strong>Rest of India:</strong> 4 to 6 business days</li>
              <li><strong>Express Delivery:</strong> 1 to 2 business days (available at checkout)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">2. Shipping Charges</h2>
            <p>
              We offer <strong>Complimentary Free Shipping</strong> on all domestic prepaid and COD orders above ₹2,000. For orders below ₹2,000, a nominal flat delivery fee of ₹150 is applied at checkout.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">3. Tracking Your Consignment</h2>
            <p>
              As soon as your parcel is handed over to our logistics partner, you will receive an SMS and email notification with your Air Waybill (AWB) number and direct tracking link. You can also track your status directly on our <Link href="/order-tracking" className="text-[#4e342e] underline font-medium">Order Tracking</Link> page.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">4. Packaging & Safety</h2>
            <p>
              Every Avyara ensemble is wrapped in eco-friendly protective tissue, scented with subtle sandalwood essence, and packaged in tamper-evident luxury mailers to ensure pristine delivery.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}
