import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="w-full max-w-[900px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2 block">
            Privacy Commitment
          </span>
          <h1 className="text-[32px] md:text-[38px] font-serif text-gray-900 mb-4 tracking-wide uppercase">
            Privacy Policy
          </h1>
          <div className="w-16 h-[2px] bg-[#4e342e] mx-auto"></div>
        </div>

        <div className="prose prose-neutral max-w-none text-xs md:text-sm text-gray-600 font-light space-y-8 leading-relaxed">
          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              When you purchase an item from our atelier, we collect the personal information you provide us such as your name, shipping address, email address, and mobile phone number for order fulfillment and delivery tracking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">2. Payment Security</h2>
            <p>
              We do not store your credit card or debit card numbers on our servers. All digital payments are processed through PCI-DSS compliant secure payment gateways with bank-grade 256-bit SSL encryption.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">3. Non-Disclosure & Third Parties</h2>
            <p>
              We will never sell, rent, or trade your personal information to third-party advertisers. Information is strictly shared with trusted logistics partners (e.g. courier agencies) strictly necessary to deliver your package.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gray-900 mb-2">4. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you or ask for your information to be deleted. To make a request, contact our data protection officer at <strong className="text-gray-900">privacy@avyara.com</strong>.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}
