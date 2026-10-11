"use client";
import React, { useEffect, useState } from 'react';
import { Users, Search, ShoppingBag, ShieldCheck, UserCheck, Eye, X } from 'lucide-react';
import { getAdminCustomers, getAdminCustomerDetails, updateCustomerRole } from '@/lib/apis';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customer Profile Modal
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await getAdminCustomers(search);
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const openCustomerDetails = async (cust: any) => {
    setSelectedCustomer(cust);
    setIsModalOpen(true);

    const res = await getAdminCustomerDetails(cust.id);
    if (res.success && res.data) {
      setSelectedCustomer(res.data);
    }
  };

  const handleToggleRole = async (cust: any) => {
    const newRole = cust.role === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Change role of ${cust.name} to ${newRole.toUpperCase()}?`)) return;

    const res = await updateCustomerRole(cust.id, newRole);
    if (res.success) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === cust.id ? { ...c, role: newRole } : c))
      );
      if (selectedCustomer && selectedCustomer.id === cust.id) {
        setSelectedCustomer((prev: any) => ({ ...prev, role: newRole }));
      }
    } else {
      alert(res.message || 'Failed to update role');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Customer Directory & CRM
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Examine client lifetime value, repeat order histories, and manage privileged access.
          </p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email, or telephone number..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#11141e] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#8d6e63]"
        />
      </form>

      {/* Customer Directory Table */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800/80 text-gray-400 uppercase tracking-wider text-[10px] bg-[#0d0f17]">
                <th className="py-3.5 px-4 font-semibold">Client Name</th>
                <th className="py-3.5 px-4 font-semibold">Contact Email</th>
                <th className="py-3.5 px-4 font-semibold">Phone</th>
                <th className="py-3.5 px-4 font-semibold">Orders Placed</th>
                <th className="py-3.5 px-4 font-semibold">Lifetime Value (LTV)</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    Accessing client records...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">{c.name}</td>
                    <td className="py-3.5 px-4 text-gray-300 font-mono text-[11px]">{c.email}</td>
                    <td className="py-3.5 px-4 text-gray-400">{c.phone || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 font-semibold text-amber-400">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{c.total_orders || 0}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{parseFloat(c.total_spent || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] border font-medium ${
                          c.role === 'admin'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {c.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        <span className="capitalize">{c.role}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openCustomerDetails(c)}
                          className="px-2.5 py-1 bg-gray-800/80 hover:bg-gray-800 text-gray-300 rounded-lg text-xs transition-colors"
                        >
                          Orders
                        </button>
                        <button
                          onClick={() => handleToggleRole(c)}
                          className="px-2.5 py-1 bg-[#4e342e]/40 hover:bg-[#4e342e] text-amber-300 rounded-lg text-[10px] transition-colors"
                        >
                          Role
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile & Purchase History Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141e] border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-gray-400">{selectedCustomer.email}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <h4 className="font-semibold text-gray-300 uppercase tracking-wider text-[10px]">
                Order Purchase History
              </h4>

              {Array.isArray(selectedCustomer.orders) && selectedCustomer.orders.length > 0 ? (
                <div className="space-y-3">
                  {selectedCustomer.orders.map((ord: any) => (
                    <div
                      key={ord.id}
                      className="p-3 bg-[#0b0d13] border border-gray-800 rounded-xl space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-amber-400">#{ord.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300 border border-gray-700">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="font-bold text-white">
                          ₹{parseFloat(ord.total).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-6 text-center">No previous purchase records found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
