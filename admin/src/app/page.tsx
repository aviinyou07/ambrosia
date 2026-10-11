"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  RotateCcw,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { getDashboardAnalytics, updateOrderStatus } from '@/lib/apis';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await getDashboardAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleQuickStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#8d6e63] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Loading operations intelligence...</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const revenueTrend = data?.revenueTrend || [];
  const statusBreakdown = data?.statusBreakdown || [];
  const topProducts = data?.topProducts || [];
  const recentOrders = data?.recentOrders || [];

  // Calculate highest revenue day for SVG scaling
  const maxDayRevenue = Math.max(...revenueTrend.map((d: any) => parseFloat(d.revenue || '0')), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Executive Operations Dashboard
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time commerce telemetry, sales analytics, and logistics fulfillment overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchAnalytics();
            }}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-800/80 hover:bg-gray-800 text-gray-300 text-xs rounded-xl border border-gray-700/60 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <Link
            href="/products"
            className="flex items-center space-x-2 px-3.5 py-2 bg-[#4e342e] hover:bg-[#5d3f37] text-white text-xs font-medium rounded-xl shadow-md transition-all border border-[#8d6e63]/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            ₹{parseFloat(kpis.total_revenue || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-3 flex items-center text-[11px] text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            <span>+18.4% vs last cycle</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {kpis.total_orders || 0}
          </p>
          <div className="mt-3 flex items-center text-[11px] text-gray-400">
            <span className="text-amber-400 font-medium mr-1.5">{kpis.pending_orders || 0}</span>
            <span>pending fulfillment</span>
          </div>
        </div>

        {/* Low Stock Warning */}
        <Link
          href="/inventory"
          className="bg-[#11141e] border border-gray-800/80 hover:border-amber-500/40 transition-colors rounded-2xl p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Low Stock SKUs</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {kpis.low_stock_items || 0}
          </p>
          <div className="mt-3 flex items-center text-[11px] text-amber-400 group-hover:underline">
            <span>Inspect inventory matrix →</span>
          </div>
        </Link>

        {/* Pending Returns */}
        <Link
          href="/returns"
          className="bg-[#11141e] border border-gray-800/80 hover:border-purple-500/40 transition-colors rounded-2xl p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Disputes & Returns</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {kpis.pending_returns || 0}
          </p>
          <div className="mt-3 flex items-center text-[11px] text-purple-400 group-hover:underline">
            <span>Action return requests →</span>
          </div>
        </Link>
      </div>

      {/* Revenue Trend Visual Chart */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">30-Day Revenue Trend</h3>
            <p className="text-xs text-gray-400 mt-0.5">Daily aggregated sales volume across all collections</p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[11px] font-mono font-medium">
            Rolling 30 Days
          </span>
        </div>

        {/* Bar Chart Visual */}
        <div className="h-48 flex items-end space-x-1.5 sm:space-x-2 pt-6">
          {revenueTrend.map((d: any, idx: number) => {
            const rev = parseFloat(d.revenue || '0');
            const heightPercent = Math.max((rev / maxDayRevenue) * 100, rev > 0 ? 12 : 3);
            const isLatest = idx === revenueTrend.length - 1;

            return (
              <div key={d.day} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-gray-900 border border-gray-700 text-white text-[10px] px-2 py-1 rounded-md pointer-events-none whitespace-nowrap z-20 shadow-xl">
                  {d.formatted_day}: ₹{rev.toLocaleString('en-IN')} ({d.orders_count} orders)
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-sm transition-all ${
                    isLatest
                      ? 'bg-gradient-to-t from-[#8d6e63] to-amber-400'
                      : rev > 0
                      ? 'bg-[#8d6e63]/70 group-hover:bg-[#8d6e63]'
                      : 'bg-gray-800/40 group-hover:bg-gray-800'
                  }`}
                ></div>
                {idx % 5 === 0 && (
                  <span className="text-[9px] text-gray-500 mt-2 font-mono truncate hidden sm:block">
                    {d.formatted_day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns on Large Screens) */}
        <div className="lg:col-span-2 bg-[#11141e] border border-gray-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Recent Orders</h3>
              <p className="text-xs text-gray-400 mt-0.5">Live order feed with one-click status transitions</p>
            </div>
            <Link
              href="/orders"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800/80 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {recentOrders.map((ord: any) => {
                  let statusColor = 'bg-gray-800 text-gray-300 border-gray-700';
                  if (ord.status === 'Confirmed') statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                  if (ord.status === 'Processing') statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  if (ord.status === 'Shipped') statusColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                  if (ord.status === 'Delivered') statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                  return (
                    <tr key={ord.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="py-3 font-mono font-medium text-amber-400">#{ord.id}</td>
                      <td className="py-3">
                        <p className="font-medium text-gray-200">{ord.customer_name}</p>
                        <p className="text-[10px] text-gray-500">{ord.customer_email}</p>
                      </td>
                      <td className="py-3 font-semibold text-white">
                        ₹{parseFloat(ord.total).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] border font-medium ${statusColor}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {ord.status === 'Confirmed' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(ord.id, 'Processing')}
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded text-[11px] border border-amber-500/30"
                          >
                            Mark Processing
                          </button>
                        )}
                        {ord.status === 'Processing' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(ord.id, 'Shipped')}
                            className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded text-[11px] border border-purple-500/30"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {ord.status === 'Shipped' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(ord.id, 'Delivered')}
                            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-[11px] border border-emerald-500/30"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {ord.status === 'Delivered' && (
                          <span className="text-[11px] text-gray-500 flex items-center justify-end space-x-1">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>Fulfilled</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products Leaderboard */}
        <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
              Top Performers
            </h3>
            <p className="text-xs text-gray-400 mb-5">Highest grossing catalog items</p>

            <div className="space-y-4">
              {topProducts.map((p: any, idx: number) => (
                <div key={p.product_id} className="flex items-center space-x-3 text-xs">
                  <div className="w-6 text-gray-500 font-mono font-bold text-center">
                    0{idx + 1}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden shrink-0 border border-gray-700/60 relative">
                    {p.product_image && (
                      <img
                        src={p.product_image}
                        alt={p.product_title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 font-medium truncate">{p.product_title}</p>
                    <p className="text-[11px] text-gray-400">
                      {p.total_sold} units sold • ₹{parseFloat(p.total_revenue).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800/80 mt-6">
            <Link
              href="/inventory"
              className="w-full block text-center py-2.5 px-4 bg-gray-800/60 hover:bg-gray-800 text-gray-300 text-xs rounded-xl border border-gray-700/60 transition-colors"
            >
              Manage Warehouse Inventory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
