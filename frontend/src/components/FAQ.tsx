"use client";
import React, { useState } from 'react';

export default function FAQ() {
  const faqs = [
    { question: "How should I care for my silk sarees and heavy lehengas?", answer: "We recommend dry cleaning only for all our premium silk sarees and embellished lehengas to maintain their shine and intricate detailing." },
    { question: "Do you offer custom tailoring for Anarkalis and Kurta sets?", answer: "Currently, we offer standard sizes ranging from XS to XXL. Please refer to our size guide for detailed measurements before placing an order." },
    { question: "What is your return policy for festive wear?", answer: "We accept returns within 7 days of delivery for unworn items with all tags attached. Please note that custom or altered items are non-refundable." },
    { question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days. For express delivery, you can expect your exquisite ethnic wear within 2-3 business days." }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#faf9f8]">
      <div className="w-full max-w-3xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-4 block">
            Support
          </span>
          <h2 className="text-[32px] md:text-[40px] font-serif text-gray-900 tracking-wide">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-gray-200 bg-white rounded-md transition-all duration-300 ${
                openIndex === index ? 'shadow-md border-transparent' : 'hover:border-gray-300'
              }`}
            >
              <div 
                className="flex justify-between items-center cursor-pointer p-6"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className={`text-[15px] tracking-wide transition-colors ${
                  openIndex === index ? 'text-[#4e342e] font-medium' : 'text-gray-700 font-light'
                }`}>
                  {faq.question}
                </h3>
                <span className={`text-xl transition-transform duration-300 ${
                  openIndex === index ? 'text-[#4e342e] rotate-45' : 'text-gray-400'
                }`}>
                  +
                </span>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${
                  openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
