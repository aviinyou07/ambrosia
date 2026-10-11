"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Percent, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import {
  getAdminCoupons,
  createCoupon,
  toggleCouponActive,
  deleteCoupon,
} from '@/lib/apis';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_order_value: '0',
    usage_limit: '',
    expires_at: '',
  });

  const fetchCoupons = async () => {
    try {
      const res = await getAdminCoupons();
      if (res.success && res.data) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggle = async (c: any) => {
    const nextState = !c.is_active;
    const res = await toggleCouponActive(c.id, nextState);
    if (res.success) {
      setCoupons((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, is_active: nextState } : item))
      );
    } else {
      alert(res.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Permanently revoke promo code ${code}?`)) return;

    const res = await deleteCoupon(id);
    if (res.success) {
      setCoupons((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert(res.message || 'Failed to delete coupon');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await createCoupon({
        code: formData.code.trim().toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_value: parseFloat(formData.min_order_value) || 0,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : undefined,
        expires_at: formData.expires_at || undefined,
      });

      if (res.success) {
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        alert(res.message || 'Failed to create coupon');
      }
    } catch (err: any) {
      alert(err.message || 'Server error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Promotions & Discount Vouchers
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Generate promotional promo codes, establish minimum threshold values, and manage voucher limits.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              code: '',
              discount_type: 'percentage',
              discount_value: '15',
              min_order_value: '1999',
              usage_limit: '100',
              expires_at: '',
            });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#4e342e] hover:bg-[#5d3f37] text-white text-xs font-semibold rounded-xl shadow-lg transition-all border border-[#8d6e63]/40"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800/80 text-gray-400 uppercase tracking-wider text-[10px] bg-[#0d0f17]">
                <th className="py-3.5 px-4 font-semibold">Voucher Code</th>
                <th className="py-3.5 px-4 font-semibold">Benefit</th>
                <th className="py-3.5 px-4 font-semibold">Minimum Cart</th>
                <th className="py-3.5 px-4 font-semibold">Usage Meter</th>
                <th className="py-3.5 px-4 font-semibold">Expiration</th>
                <th className="py-3.5 px-4 font-semibold">State</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    Loading promotion rules...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No active discount coupons configured.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {c.discount_type === 'percentage'
                        ? `${c.discount_value}% OFF`
                        : `₹${parseFloat(c.discount_value).toLocaleString('en-IN')} Flat`}
                    </td>
                    <td className="py-3.5 px-4 text-gray-300">
                      ₹{parseFloat(c.min_order_value || '0').toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-gray-300">
                      {c.times_used || 0} / {c.usage_limit || '∞'} used
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {c.expires_at
                        ? new Date(c.expires_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'No Expiry'}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggle(c)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] border font-medium ${
                          c.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-gray-800 text-gray-500 border-gray-700'
                        }`}
                      >
                        {c.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{c.is_active ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141e] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">Create Promo Voucher</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. LUXURY20"
                  className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-amber-400 font-mono font-bold uppercase focus:outline-none focus:border-[#8d6e63]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discount_type: e.target.value as 'percentage' | 'fixed',
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discount_value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, discount_value: e.target.value }))}
                    placeholder="15"
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Min Order Cart (₹)</label>
                  <input
                    type="number"
                    value={formData.min_order_value}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, min_order_value: e.target.value }))
                    }
                    placeholder="1999"
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Total Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, usage_limit: e.target.value }))}
                    placeholder="Unlimited if empty"
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Expiration Date</label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expires_at: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#4e342e] hover:bg-[#5d3f37] text-white font-semibold rounded-xl shadow-md border border-[#8d6e63]/40"
                >
                  {submitting ? 'Generating...' : 'Issue Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
