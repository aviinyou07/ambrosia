"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, login, logout, orders, addresses, addAddress, removeAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // New address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrForm, setAddrForm] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addrForm.fullName && addrForm.street) {
      addAddress(addrForm);
      setAddrForm({ fullName: '', street: '', city: '', state: '', pincode: '', phone: '' });
      setIsAddingAddress(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f8] pt-12 pb-24">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-gray-200 gap-4">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase block mb-1">
              My Avyara
            </span>
            <h1 className="text-[28px] md:text-[34px] font-serif text-gray-900 tracking-wide">
              {user ? `Welcome, ${user.name}` : 'Customer Account'}
            </h1>
          </div>

          {user ? (
            <button
              onClick={logout}
              className="text-xs text-red-600 hover:underline uppercase tracking-wider font-semibold cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => login('customer@avyara.com', 'Ananya Sharma')}
                className="px-6 py-2.5 bg-[#4e342e] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3e2a25] cursor-pointer"
              >
                Sign In as Ananya
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-gray-200 mt-8 text-xs uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'orders' 
                ? 'border-[#4e342e] text-[#4e342e]' 
                : 'border-transparent text-gray-400 hover:text-gray-800'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-4 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'addresses' 
                ? 'border-[#4e342e] text-[#4e342e]' 
                : 'border-transparent text-gray-400 hover:text-gray-800'
            }`}
          >
            Addresses ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'profile' 
                ? 'border-[#4e342e] text-[#4e342e]' 
                : 'border-transparent text-gray-400 hover:text-gray-800'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-8">
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-white p-12 text-center border border-gray-100 rounded-sm">
                  <h3 className="font-serif text-lg text-gray-800 mb-2">No Orders Yet</h3>
                  <p className="text-xs text-gray-500 mb-6">When you place an order, it will appear here with full status tracking.</p>
                  <Link
                    href="/collections/new-arrivals"
                    className="inline-block px-8 py-3 bg-[#4e342e] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#3e2a25]"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="bg-white p-6 border border-gray-100 shadow-2xs rounded-sm">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-100 gap-2 mb-4 text-xs">
                      <div>
                        <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">Order</span>
                        <strong className="text-gray-900 font-mono text-sm">{ord.id}</strong>
                        <span className="text-gray-400 ml-3">• {ord.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ord.status}
                        </span>
                        <span className="font-serif text-sm font-bold text-[#4e342e]">
                          ₹{ord.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-gray-50">
                      {ord.items.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="py-3 flex items-center justify-between text-xs gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-16 bg-gray-50 shrink-0">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                            <div>
                              <Link href={`/products/${item.slug}`} className="font-medium text-gray-800 hover:text-[#4e342e] transition-colors">
                                {item.title}
                              </Link>
                              <div className="text-[11px] text-gray-400 mt-0.5">Size: {item.size} | Qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                      <span>Shipped to: {ord.shippingAddress.fullName}, {ord.shippingAddress.city}</span>
                      <Link 
                        href={`/order-tracking?id=${ord.id}`}
                        className="text-[#4e342e] underline font-medium hover:text-black"
                      >
                        Track Package →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg text-gray-900">Delivery Addresses</h3>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-4 py-2 border border-[#4e342e] text-[#4e342e] text-xs font-semibold uppercase tracking-wider hover:bg-[#4e342e] hover:text-white transition-colors cursor-pointer"
                >
                  {isAddingAddress ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddressSubmit} className="bg-white p-6 border border-gray-200 text-xs space-y-4">
                  <h4 className="font-serif text-sm uppercase tracking-wider text-gray-800">Add New Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={addrForm.fullName}
                      onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                      required
                      className="border border-gray-200 p-2.5 outline-none focus:border-[#4e342e]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={addrForm.phone}
                      onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                      required
                      className="border border-gray-200 p-2.5 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Street Address, Building, Apartment"
                    value={addrForm.street}
                    onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                    required
                    className="w-full border border-gray-200 p-2.5 outline-none focus:border-[#4e342e]"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={addrForm.city}
                      onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                      required
                      className="border border-gray-200 p-2.5 outline-none focus:border-[#4e342e]"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={addrForm.state}
                      onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                      required
                      className="border border-gray-200 p-2.5 outline-none focus:border-[#4e342e]"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={addrForm.pincode}
                      onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                      required
                      className="border border-gray-200 p-2.5 outline-none focus:border-[#4e342e]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#4e342e] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3e2a25]"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-white p-6 border border-gray-100 shadow-2xs rounded-sm text-xs relative">
                    <div className="font-semibold text-sm text-gray-900 mb-1">{addr.fullName}</div>
                    <div className="text-gray-600 leading-relaxed mb-3">
                      {addr.street}<br />
                      {addr.city}, {addr.state} - {addr.pincode}<br />
                      Phone: {addr.phone}
                    </div>
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="text-red-500 hover:underline text-[11px]"
                    >
                      Delete Address
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white p-8 border border-gray-100 shadow-2xs max-w-lg text-xs space-y-4">
              <h3 className="font-serif text-lg text-gray-900 mb-4">Profile Details</h3>
              <div>
                <label className="text-gray-400 uppercase tracking-wider text-[10px] block mb-1">Name</label>
                <div className="font-medium text-gray-800 text-sm">{user?.name || 'Ananya Sharma'}</div>
              </div>
              <div>
                <label className="text-gray-400 uppercase tracking-wider text-[10px] block mb-1">Email</label>
                <div className="font-medium text-gray-800 text-sm">{user?.email || 'ananya.sharma@example.com'}</div>
              </div>
              <div>
                <label className="text-gray-400 uppercase tracking-wider text-[10px] block mb-1">Mobile</label>
                <div className="font-medium text-gray-800 text-sm">{user?.phone || '+91 98765 43210'}</div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-gray-400">Membership Tier:</span>{' '}
                <strong className="text-[#4e342e]">Avyara Luxe Club (Gold)</strong>
              </div>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}
