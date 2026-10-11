"use client";
import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-2 block">
            Customer Concierge
          </span>
          <h1 className="text-[32px] md:text-[40px] font-serif text-gray-900 mb-4 tracking-wide uppercase">
            Contact Us
          </h1>
          <p className="text-gray-500 text-sm font-light max-w-md mx-auto leading-relaxed">
            Have a question regarding styling, tailoring, or an existing order? Our concierge is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-[#faf9f8] p-8 md:p-10 border border-gray-100 space-y-8 text-xs text-gray-600">
            <div>
              <h3 className="font-serif text-base text-gray-900 uppercase tracking-wider mb-2">Our Atelier</h3>
              <p className="leading-relaxed">
                Avyara Flagship Studio<br />
                Plot 14, Royal Palms Crescent, Design District<br />
                Mumbai, Maharashtra, 400706
              </p>
            </div>

            <div>
              <h3 className="font-serif text-base text-gray-900 uppercase tracking-wider mb-2">Concierge Hours</h3>
              <p className="leading-relaxed">
                Monday to Saturday: 10:00 AM – 7:00 PM IST<br />
                Sunday: Closed for artisanal celebrations
              </p>
            </div>

            <div>
              <h3 className="font-serif text-base text-gray-900 uppercase tracking-wider mb-2">Direct Reach</h3>
              <p className="leading-relaxed">
                Email: <strong className="text-gray-900">care@avyara.com</strong><br />
                Phone: <strong className="text-gray-900">+91 98765 43210</strong><br />
                WhatsApp: <strong className="text-gray-900">+91 98765 43211</strong>
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-[#faf9f8] p-10 text-center border border-gray-200">
                <div className="w-12 h-12 bg-[#faf3f0] text-[#4e342e] rounded-full flex items-center justify-center text-lg mx-auto mb-3">
                  ✓
                </div>
                <h3 className="font-serif text-xl text-gray-900 mb-2">Message Received</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Thank you for reaching out. A dedicated stylist from our team will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#4e342e] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-200 p-3 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-200 p-3 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-200 p-3 outline-none focus:border-[#4e342e]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
                    How can we help? *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-gray-200 p-3 outline-none focus:border-[#4e342e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
