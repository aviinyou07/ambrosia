"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, email.split('@')[0]);
      router.push('/account');
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setResetSent(true);
      setTimeout(() => setResetSent(false), 6000);
    } else {
      alert('Please enter your email address above first.');
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
            Sign In to Your Account
          </h1>
          <p className="text-xs text-gray-500 font-light mt-1">
            Access your orders, saved addresses, and wishlist.
          </p>
        </div>

        {resetSent && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm text-center">
            ✓ Password reset link has been dispatched to <strong>{email}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-600 mb-1.5 uppercase tracking-wider text-[10px] font-medium">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya@example.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 p-3 outline-none focus:border-[#4e342e]"
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="accent-[#4e342e]" defaultChecked />
              <span>Remember me</span>
            </label>
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="hover:text-[#4e342e] underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#4e342e] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3e2a25] transition-colors cursor-pointer mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          New to Avyara?{' '}
          <Link href="/auth/register" className="text-[#4e342e] font-semibold underline">
            Create an Account
          </Link>
        </div>

      </div>
    </main>
  );
}
