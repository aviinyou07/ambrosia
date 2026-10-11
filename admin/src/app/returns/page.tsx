"use client";
import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Eye,
  X,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { getAdminReturns, getAdminReturnDetails, updateReturnRequestStatus } from '@/lib/apis';

const statusFilters = ['All', 'Pending', 'Approved', 'Rejected', 'Completed', 'Refunded'];

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Detail Modal
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchReturns = async () => {
    try {
      const res = await getAdminReturns(activeFilter);
      if (res.success && res.data) {
        setReturns(res.data);
      }
    } catch (err) {
      console.error('Failed to load return requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [activeFilter]);

  const openDetails = async (ret: any) => {
    setSelectedReturn(ret);
    setIsModalOpen(true);

    const res = await getAdminReturnDetails(ret.id);
    if (res.success && res.data) {
      setSelectedReturn(res.data);
    }
  };

  const handleUpdateStatus = async (returnId: string, status: string) => {
    setUpdating(true);
    try {
      const res = await updateReturnRequestStatus(returnId, status);
      if (res.success) {
        fetchReturns();
        if (selectedReturn && selectedReturn.id === returnId) {
          setSelectedReturn((prev: any) => ({ ...prev, status }));
        }
      } else {
        alert(res.message || 'Failed to update status');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Returns, Exchanges & Dispute Resolution
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Resolve consumer return claims, schedule reverse pickup logistics, and authorize refund releases.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 bg-[#11141e] p-1 rounded-xl border border-gray-800/80 w-fit">
        {statusFilters.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === tab
                ? 'bg-[#4e342e] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Returns Table */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800/80 text-gray-400 uppercase tracking-wider text-[10px] bg-[#0d0f17]">
                <th className="py-3.5 px-4 font-semibold">Claim ID</th>
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Request Type</th>
                <th className="py-3.5 px-4 font-semibold">Reason</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    Inspecting dispute queue...
                  </td>
                </tr>
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No return claims under {activeFilter} status.
                  </td>
                </tr>
              ) : (
                returns.map((r) => {
                  let statusColor = 'bg-gray-800 text-gray-300 border-gray-700';
                  if (r.status === 'Pending') statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  if (r.status === 'Approved') statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                  if (r.status === 'Rejected') statusColor = 'bg-red-500/10 text-red-400 border-red-500/30';
                  if (r.status === 'Refunded' || r.status === 'Completed') statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                  return (
                    <tr key={r.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {r.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-300">
                        #{r.order_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-white">{r.customer_name || 'Customer'}</p>
                        <p className="text-[10px] text-gray-500">{r.customer_email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-200">
                        {r.request_type}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate">
                        {r.reason}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] border font-medium ${statusColor}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openDetails(r)}
                            className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors"
                          >
                            Inspect
                          </button>
                          {r.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'Approved')}
                                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px]"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                                className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-[10px]"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {r.status === 'Approved' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Refunded')}
                              className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-[10px]"
                            >
                              Issue Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Details Modal */}
      {isModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141e] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">Dispute Inspection</span>
                <h3 className="text-base font-serif font-bold text-white mt-0.5">
                  Claim #{selectedReturn.id}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="bg-[#0b0d13] p-4 rounded-xl border border-gray-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Reference:</span>
                  <span className="font-mono font-bold text-amber-400">#{selectedReturn.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Claim Type:</span>
                  <span className="text-white font-medium">{selectedReturn.request_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stated Reason:</span>
                  <span className="text-white font-medium">{selectedReturn.reason}</span>
                </div>
                {selectedReturn.comments && (
                  <div className="pt-2 border-t border-gray-800 text-gray-300 italic">
                    "{selectedReturn.comments}"
                  </div>
                )}
              </div>

              {/* Order Items */}
              {Array.isArray(selectedReturn.items) && selectedReturn.items.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-300 uppercase tracking-wider text-[10px] mb-2">
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {selectedReturn.items.map((it: any) => (
                      <div
                        key={it.id}
                        className="p-2.5 bg-[#0b0d13] border border-gray-800 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-10 rounded bg-gray-800 overflow-hidden shrink-0">
                            {it.image && <img src={it.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-medium text-white">{it.title}</p>
                            <p className="text-[10px] text-gray-400">Size {it.size} • Qty {it.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-white">
                          ₹{(parseFloat(it.unit_price) * it.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-800 flex justify-end space-x-2">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleUpdateStatus(selectedReturn.id, 'Approved')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow"
                >
                  Approve Claim
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleUpdateStatus(selectedReturn.id, 'Refunded')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold shadow"
                >
                  Authorize Refund
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleUpdateStatus(selectedReturn.id, 'Rejected')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold shadow"
                >
                  Reject Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
