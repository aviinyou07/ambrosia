"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { openCart, cartCount } = useCart();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePopularSearchClick = (term: string) => {
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const navLinks = [
    { name: "New Arrivals", href: "/collections/new-arrivals" },
    { name: "Bestsellers", href: "/collections/bestsellers" },
    { 
      name: "Kurta Sets", 
      href: "/collections/kurta-sets",
      megaMenu: [
        {
          title: "CO-ORD SETS",
          items: ["All Co-ord Sets", "3 Piece Sets", "Patiala Sets", "Basic Sets", "Collar Sets", "Sleeveless Sets", "Long Kurta Sets", "Kaftan Sets"]
        },
        {
          title: "BY STYLE",
          items: ["Anarkali Sets", "Straight Sets", "A-Line Sets", "Sharara Sets"]
        },
        {
          title: "BY FABRIC",
          items: ["Cotton", "Silk", "Georgette", "Chanderi"]
        },
        {
          title: "BY OCCASION",
          items: ["Daily Wear", "Festive", "Wedding", "Office Wear"]
        }
      ]
    },
    { name: "Sarees", href: "/collections/sarees" },
    { name: "Lehengas", href: "/collections/lehengas" },
    { name: "Anarkalis", href: "/collections/anarkalis" },
    { name: "Palazzo Suits", href: "/collections/palazzo-suits" },
    { name: "Indo-Western", href: "/collections/indo-western" },
    { name: "Gowns", href: "/collections/gowns" },
    { name: "Dupattas", href: "/collections/dupattas" },
    { name: "Raise Return / Exchange", href: "/returns/raise" },
    { name: "Sale", href: "/collections/sale" }
  ];

  return (
    <nav className="bg-white border-b border-gray-100 relative" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6">
        {/* Top Row */}
        <div className="flex justify-between items-center py-4 relative">
          
          {/* Search */}
          <div className="flex items-center gap-2 relative">
            <button 
              className="text-gray-700 hover:text-[#4e342e] transition-colors flex items-center gap-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span className="text-sm tracking-wide font-medium hidden sm:inline">Search</span>
            </button>

            {/* Search Dropdown Panel */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 mt-6 w-[280px] sm:w-[360px] bg-white shadow-2xl border border-gray-100 p-6 z-50 cursor-default">
                <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-gray-200 pb-3">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for ethnic wear..." 
                    className="w-full text-[13px] outline-none text-gray-700 placeholder-gray-400 tracking-wide bg-transparent"
                    autoFocus
                  />
                  <button type="submit" className="text-[#4e342e] hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </button>
                </form>
                
                <div className="mt-6">
                  <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-4 block">
                    Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {["Designer Sarees", "Silk Lehengas", "Kurta Sets", "Anarkali Suits", "Fusion Gowns"].map(term => (
                      <span 
                        key={term} 
                        onClick={() => handlePopularSearchClick(term)}
                        className="text-[11px] bg-gray-50 text-gray-600 px-3.5 py-2 cursor-pointer hover:bg-[#ffe1ef] hover:text-[#4e342e] transition-colors border border-gray-100 rounded-sm"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logo (Centered) */}
          <Link href="/" className="px-5 py-2 text-xs md:text-sm font-light tracking-[0.3em] text-white bg-[#4e342e] absolute left-1/2 -translate-x-1/2 whitespace-nowrap uppercase hover:bg-[#3e2a25] transition-colors">
            AVYARA
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/account" className="text-sm tracking-wide text-gray-700 font-medium hidden sm:inline hover:text-[#4e342e] transition-colors">
              Account
            </Link>
            <button 
              onClick={openCart}
              className="text-gray-700 flex items-center gap-1.5 hover:text-[#4e342e] transition-colors relative cursor-pointer"
            >
              <span className="text-sm tracking-wide font-medium hidden sm:inline">Cart</span>
              <div className="relative">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#4e342e] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Row - Links */}
        <div className="flex justify-start md:justify-center gap-6 py-4 overflow-x-auto md:overflow-visible hide-scrollbar whitespace-nowrap">
          {navLinks.map((link) => (
            <div key={link.name} className="group">
              <Link 
                href={link.href} 
                className="text-[13px] font-medium tracking-wide text-gray-500 hover:text-[#4e342e] transition-colors pb-[18px] group-hover:border-b-2 group-hover:border-[#4e342e] group-hover:text-[#4e342e]"
              >
                {link.name}
              </Link>
              
              {/* Mega Menu */}
              {link.megaMenu && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pt-10 pb-16 px-12 border-t border-gray-100 cursor-default">
                  <div className="w-full max-w-[1400px] mx-auto flex justify-center gap-24">
                    {/* First column: All Category */}
                    <div className="w-[200px]">
                      <Link 
                        href={link.href} 
                        className="text-[13px] text-gray-800 hover:text-[#4e342e] transition-colors font-medium"
                      >
                        All {link.name}
                      </Link>
                    </div>
                    {/* Other columns */}
                    {link.megaMenu.map((col, idx) => (
                      <div key={idx} className="w-[200px]">
                        <h4 className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-6">
                          {col.title}
                        </h4>
                        <ul className="space-y-4">
                          {col.items.map((item, i) => (
                            <li key={i}>
                              <Link 
                                href={`${link.href}?filter=${encodeURIComponent(item)}`} 
                                className="text-[13px] text-gray-600 hover:text-[#4e342e] transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
