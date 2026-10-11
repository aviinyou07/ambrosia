"use client";
import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  X,
  Package,
} from 'lucide-react';
import { getAdminOrders, getAdminOrderDetails, updateOrderStatus } from '@/lib/apis';

const statusTabs = ['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Dispatch Form in Modal
  const [newStatus, setNewStatus] = useState('');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders({
        status: activeTab,
        search,
      });
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setCarrier(order.tracking_carrier || 'Blue Dart Express');
    setTrackingNumber(order.tracking_number || '');
    setIsDetailsOpen(true);

    // Fetch full order details including line items
    const res = await getAdminOrderDetails(order.id);
    if (res.success && res.data) {
      setSelectedOrder(res.data);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setStatusUpdating(true);

    try {
      const res = await updateOrderStatus(
        selectedOrder.id,
        newStatus,
        carrier || undefined,
        trackingNumber || undefined
      );

      if (res.success) {
        setIsDetailsOpen(false);
        fetchOrders();
      } else {
        alert(res.message || 'Failed to update order status');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Order Fulfillment & Logistics
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Track customer orders, assign courier AWB tracking numbers, and manage shipment states.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 bg-[#11141e] p-1 rounded-xl border border-gray-800/80">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#4e342e] text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, name, email..."
            className="w-full pl-10 pr-4 py-2 bg-[#11141e] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#8d6e63]"
          />
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800/80 text-gray-400 uppercase tracking-wider text-[10px] bg-[#0d0f17]">
                <th className="py-3.5 px-4 font-semibold">Order</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Tracking Carrier</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    Loading customer orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No orders found under {activeTab} status.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  let statusColor = 'bg-gray-800 text-gray-300 border-gray-700';
                  if (ord.status === 'Confirmed') statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                  if (ord.status === 'Processing') statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  if (ord.status === 'Shipped') statusColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                  if (ord.status === 'Delivered') statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                  if (ord.status === 'Cancelled') statusColor = 'bg-red-500/10 text-red-400 border-red-500/30';

                  return (
                    <tr key={ord.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-mono font-bold text-amber-400">#{ord.id}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-gray-200">{ord.customer_name}</p>
                        <p className="text-[10px] text-gray-500">{ord.customer_email}</p>
                        <p className="text-[10px] text-gray-500">{ord.customer_phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">₹{parseFloat(ord.total).toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-gray-400">
                          {ord.payment_method} • {ord.payment_status}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] border font-medium ${statusColor}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.tracking_number ? (
                          <div className="text-[11px]">
                            <p className="text-gray-300 font-medium">{ord.tracking_carrier}</p>
                            <p className="text-amber-400 font-mono text-[10px]">{ord.tracking_number}</p>
                          </div>
                        ) : (
                          <span className="text-gray-600 italic">Not Assigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openOrderDetails(ord)}
                          className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg text-xs font-medium border border-gray-700/60 transition-colors inline-flex items-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Dispatch Modal */}
      {isDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#11141e] border border-gray-800 rounded-2xl w-full max-w-2xl my-8 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Order Details
                </span>
                <h3 className="text-base font-serif font-bold text-white mt-0.5">
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0b0d13] p-4 rounded-xl border border-gray-800">
                <div>
                  <h4 className="font-semibold text-gray-300 uppercase tracking-wider text-[10px] mb-2">
                    Customer Information
                  </h4>
                  <p className="font-medium text-white">{selectedOrder.customer_name}</p>
                  <p className="text-gray-400">{selectedOrder.customer_email}</p>
                  <p className="text-gray-400">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300 uppercase tracking-wider text-[10px] mb-2">
                    Delivery Destination
                  </h4>
                  {selectedOrder.shipping_address ? (
                    <div className="text-gray-400 space-y-0.5">
                      <p className="text-white">{selectedOrder.shipping_address.address}</p>
                      <p>
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} -{' '}
                        {selectedOrder.shipping_address.pincode}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Address details unavailable</p>
                  )}
                </div>
              </div>

              {/* Order Items List */}
              <div>
                <h4 className="font-semibold text-gray-300 uppercase tracking-wider text-[10px] mb-3">
                  Purchased Items ({Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
                </h4>
                <div className="space-y-2 border border-gray-800 rounded-xl divide-y divide-gray-800/60 overflow-hidden">
                  {Array.isArray(selectedOrder.items) &&
                    selectedOrder.items.map((it: any) => (
                      <div key={it.id} className="p-3 bg-[#0b0d13] flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-12 rounded bg-gray-800 overflow-hidden shrink-0 border border-gray-700/60">
                            {it.image && (
                              <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">{it.title}</p>
                            <p className="text-[10px] text-gray-400">
                              Size: <span className="text-amber-400 font-bold">{it.size}</span> • Qty:{' '}
                              {it.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-white">
                          ₹{(parseFloat(it.unit_price) * it.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-[#0b0d13] p-4 rounded-xl border border-gray-800 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span>₹{parseFloat(selectedOrder.subtotal || '0').toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Discount Applied:</span>
                  <span className="text-emerald-400">
                    -₹{parseFloat(selectedOrder.discount || '0').toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping Fee:</span>
                  <span>₹{parseFloat(selectedOrder.shipping_fee || '0').toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
                  <span>Total Amount:</span>
                  <span className="text-amber-400">
                    ₹{parseFloat(selectedOrder.total || '0').toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Dispatch & Status Transition Form */}
              <div className="bg-[#151926] p-4 rounded-xl border border-gray-700 space-y-4">
                <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
                  <Truck className="w-4 h-4" />
                  <span>Courier Dispatch & Status Management</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Order Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-700 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Carrier Partner</label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g. Blue Dart / Delhivery"
                      className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">AWB Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. 78392184912"
                      className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-700 rounded-xl text-amber-400 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={statusUpdating}
                    className="px-5 py-2 bg-[#4e342e] hover:bg-[#5d3f37] text-white font-semibold rounded-xl shadow-md border border-[#8d6e63]/40"
                  >
                    {statusUpdating ? 'Updating Status...' : 'Apply Status Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
