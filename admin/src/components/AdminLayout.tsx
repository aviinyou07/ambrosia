"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Boxes,
  Users,
  Percent,
  RotateCcw,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle2,
  Database,
  Cloud,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Categories', href: '/categories', icon: FolderTree },
  { name: 'Inventory', href: '/inventory', icon: Boxes },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Coupons', href: '/coupons', icon: Percent },
  { name: 'Returns', href: '/returns', icon: RotateCcw },
  { name: 'R2 Media Vault', href: '/media', icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // If on login page, render children directly without dashboard shell
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0d13] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#8d6e63] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-xs tracking-widest uppercase">Authenticating Operations Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0d13] text-gray-100 flex flex-col md:flex-row antialiased">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#11141e] border-r border-gray-800/80 sticky top-0 h-screen select-none z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#4e342e] to-[#8d6e63] flex items-center justify-center text-white font-serif font-bold text-lg shadow-md border border-[#8d6e63]/40">
            A
          </div>
          <div>
            <h1 className="font-serif tracking-widest text-sm text-white font-semibold">AMBROSIA</h1>
            <p className="text-[10px] tracking-wider text-amber-500/90 font-mono font-medium">ADMIN OPS PORTAL</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] uppercase font-semibold tracking-wider text-gray-400">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4e342e]/80 to-[#3e2723]/60 text-white border border-[#8d6e63]/40 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Live System Diagnostics Pill */}
        <div className="p-4 mx-3 mb-3 bg-[#0d0f17] rounded-xl border border-gray-800/80 text-[11px] space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>PostgreSQL</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center space-x-1.5">
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              <span>Cloudflare R2</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-400 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Ready</span>
            </span>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-800/80 flex items-center justify-between bg-[#0e1018]">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#8d6e63]/20 border border-[#8d6e63]/40 flex items-center justify-center text-amber-400 font-medium text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-gray-200 truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of Admin Suite"
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[#11141e]/90 backdrop-blur-md border-b border-gray-800/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>admin.ambrosiavastra.com</span>
              <span>/</span>
              <span className="text-amber-400 font-medium capitalize">
                {pathname === '/' ? 'Overview' : pathname.replace('/', '')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs bg-gray-800/60 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/60 transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>

            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
              ADM
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#11141e] border-b border-gray-800 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-[#4e342e] text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
