import React from 'react';
import Link from 'next/link';

export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="w-full max-w-[900px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2 block">
            Customer Information
          </span>
          <h1 className="text-[32px] md:text-[38px] font-serif text-gray-900 mb-4 tracking-wide uppercase">
            Returns & Exchange Policy
          </h1>
          <div className="w-16 h-[2px] bg-[#4e342e] mx-auto"></div>
        </div>

        <div className="prose prose-neutral max-w-none text-xs md:text-sm text-gray-600 font-light space-y-8 leading-relaxed">
          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">1. 7-Day Doorstep Reverse Pickup</h2>
            <p>
              We want you to love what you wear. If your size isn't perfect or the ensemble doesn't meet your expectations, we offer a seamless <strong>7-day return and exchange policy</strong> from the date of package delivery.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">2. Conditions for Returns</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Item must be unused, unwashed, and undamaged.</li>
              <li>All original brand tags, barcodes, and packaging must remain intact.</li>
              <li>Customized alterations or items bought on clearance Final Sale are non-returnable.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">3. How to Initiate a Return or Exchange</h2>
            <p>
              Simply visit our dedicated <Link href="/returns/raise" className="text-[#4e342e] underline font-medium">Raise Return / Exchange</Link> page, enter your Order ID, and select your preferred exchange size or refund method. Our reverse pickup partner will collect the item from your doorstep.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">4. Refund Timelines</h2>
            <p>
              Once your returned garment passes our quality check at the warehouse, refunds are initiated within <strong>48 hours</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Prepaid Orders:</strong> Credited back to original bank/card/UPI within 3-5 business days.</li>
              <li><strong>Cash on Delivery (COD):</strong> Transferred directly to your provided bank account via NEFT or issued as Avyara Store Credits with 1-year validity.</li>
            </ul>
          </section>
        </div>

      </div>
    </main>
  );
}
