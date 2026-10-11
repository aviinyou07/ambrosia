"use client";
import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ShieldAlert, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('admin@ambrosia.luxury');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  const handleUseDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0b0d13] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#4e342e]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#8d6e63]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#11141e] border border-gray-800/90 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4e342e] to-[#8d6e63] items-center justify-center text-white font-serif font-bold text-2xl shadow-xl border border-[#8d6e63]/40 mb-4">
            A
          </div>
          <h1 className="font-serif text-2xl font-light text-white tracking-widest uppercase">
            Ambrosia Vastra
          </h1>
          <p className="text-xs text-amber-500/90 font-mono tracking-wider mt-1 uppercase font-semibold">
            Executive Operations Gateway
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Authorized administrative access for admin.ambrosiavastra.com
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center space-x-3 text-red-200 text-xs">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ambrosia.luxury"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d13] border border-gray-800 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#8d6e63] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d13] border border-gray-800 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#8d6e63] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#4e342e] to-[#6d4c41] hover:from-[#5d3f37] hover:to-[#7d564a] text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Access Operations Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Pre-fill helper */}
        <div className="mt-8 pt-6 border-t border-gray-800/80 text-center">
          <p className="text-[11px] text-gray-500 mb-3 flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Developer / Administrator Quick Access</span>
          </p>
          <div className="flex justify-center space-x-2">
            <button
              type="button"
              onClick={() => handleUseDemo('admin@ambrosia.luxury', 'Admin@123')}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-300 border border-gray-700/60 transition-colors"
            >
              admin@ambrosia.luxury
            </button>
            <button
              type="button"
              onClick={() => handleUseDemo('admin@avyara.com', 'Admin@123')}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-300 border border-gray-700/60 transition-colors"
            >
              admin@avyara.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
