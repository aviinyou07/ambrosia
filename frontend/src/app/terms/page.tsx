import React from 'react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="w-full max-w-[900px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2 block">
            Legal
          </span>
          <h1 className="text-[32px] md:text-[38px] font-serif text-gray-900 mb-4 tracking-wide uppercase">
            Terms of Service
          </h1>
          <div className="w-16 h-[2px] bg-[#4e342e] mx-auto"></div>
        </div>

        <div className="prose prose-neutral max-w-none text-xs md:text-sm text-gray-600 font-light space-y-8 leading-relaxed">
          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">1. Overview</h2>
            <p>
              This website is operated by Avyara Ethnic Wear Atelier. Throughout the site, the terms "we", "us" and "our" refer to Avyara. By visiting our site and/or purchasing an item, you engage in our "Service" and agree to be bound by the following terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">2. Products & Accuracy</h2>
            <p>
              We strive to display the colors, fabrics, and embroideries of our apparel as accurately as possible. Due to variations in computer monitors and the handcrafted nature of artisanal textiles, slight color variations are natural characteristics of authentic handlooms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">3. Pricing & Modifications</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue any design or collection without liability.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">4. Governing Law</h2>
            <p>
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, with jurisdiction in Mumbai, Maharashtra.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}
