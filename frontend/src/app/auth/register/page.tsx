"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      login(formData.email, formData.name);
      router.push('/account');
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f8] flex items-center justify-center py-20 px-4">
      <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 max-w-md w-full rounded-sm">
        
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl tracking-[0.3em] uppercase text-gray-900 font-medium">
            AVYARA
          </Link>
          <h1 className="font-serif text-xl text-gray-800 tracking-wide mt-4 uppercase text-xs font-semibold">
            Create an Account
          </h1>
          <p className="text-xs text-gray-500 font-light mt-1">
            Join the Avyara Luxe Club for personalized styling and previews.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ananya Sharma"
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
              placeholder="e.g. ananya@example.com"
              className="w-full border border-gray-200 p-3 outline-none focus:border-[#4e342e]"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
              Mobile Number (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full border border-gray-200 p-3 outline-none focus:border-[#4e342e]"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
              Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 6 characters"
              className="w-full border border-gray-200 p-3 outline-none focus:border-[#4e342e]"
            />
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed">
            By creating an account, you agree to Avyara's <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            className="w-full py-4 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors cursor-pointer mt-4"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#4e342e] font-semibold underline">
            Sign In
          </Link>
        </div>

      </div>
    </main>
  );
}
