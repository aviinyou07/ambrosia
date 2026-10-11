"use client";
import React, { useEffect, useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Save,
  Search,
} from 'lucide-react';
import { getAdminInventory, updateInventoryStock } from '@/lib/apis';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [editingStocks, setEditingStocks] = useState<Record<string, number>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await getAdminInventory(lowStockOnly);
      if (res.success && res.data) {
        setItems(res.data);
        const map: Record<string, number> = {};
        res.data.forEach((it: any) => {
          map[it.variant_id] = it.stock_quantity;
        });
        setEditingStocks(map);
      }
    } catch (err) {
      console.error('Failed to load inventory matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const handleStockChange = (variantId: string, val: number) => {
    setEditingStocks((prev) => ({
      ...prev,
      [variantId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = async (variantId: string) => {
    const qty = editingStocks[variantId];
    if (qty === undefined) return;

    setUpdatingId(variantId);
    try {
      const res = await updateInventoryStock(variantId, qty);
      if (res.success) {
        setItems((prev) =>
          prev.map((it) => (it.variant_id === variantId ? { ...it, stock_quantity: qty } : it))
        );
      } else {
        alert(res.message || 'Failed to update stock');
      }
    } catch (err: any) {
      alert(err.message || 'Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter((it) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      it.product_title?.toLowerCase().includes(q) ||
      it.sku?.toLowerCase().includes(q) ||
      it.size?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Warehouse Inventory Matrix
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time variant level stock counts, low-inventory warning triggers, and inline restock controls.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              lowStockOnly
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-sm'
                : 'bg-gray-800/80 text-gray-300 border-gray-700/60 hover:bg-gray-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Low Stock Items Only (≤ 5 units)</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by product name, SKU, or size..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#11141e] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#8d6e63]"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800/80 text-gray-400 uppercase tracking-wider text-[10px] bg-[#0d0f17]">
                <th className="py-3.5 px-4 font-semibold">Product Title</th>
                <th className="py-3.5 px-4 font-semibold">SKU Code</th>
                <th className="py-3.5 px-4 font-semibold">Variant Size</th>
                <th className="py-3.5 px-4 font-semibold">Stock Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Inline Restock Controller</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Inspecting warehouse bins...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No variants matching filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((it) => {
                  const currentVal = editingStocks[it.variant_id] ?? it.stock_quantity;
                  const isDirty = currentVal !== it.stock_quantity;
                  const isLow = currentVal <= 5;
                  const isOOS = currentVal === 0;

                  return (
                    <tr key={it.variant_id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-12 rounded bg-gray-800 overflow-hidden shrink-0 border border-gray-700/60">
                            {it.product_image ? (
                              <img src={it.product_image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <Boxes className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">{it.product_title}</p>
                            <p className="text-[10px] text-gray-500">{it.category_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-400">{it.sku || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-amber-400 font-bold border border-gray-700">
                          {it.size}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isOOS ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] bg-red-500/10 text-red-400 border border-red-500/30">
                            <XCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock ({currentVal} left)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle className="w-3 h-3" />
                            <span>Healthy ({currentVal})</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleStockChange(it.variant_id, currentVal - 1)}
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            value={currentVal}
                            onChange={(e) =>
                              handleStockChange(it.variant_id, parseInt(e.target.value) || 0)
                            }
                            className="w-16 text-center py-1 bg-[#0b0d13] border border-gray-700 rounded-lg text-white font-bold focus:outline-none focus:border-[#8d6e63]"
                          />
                          <button
                            type="button"
                            onClick={() => handleStockChange(it.variant_id, currentVal + 1)}
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockChange(it.variant_id, currentVal + 10)}
                            className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] rounded-lg font-mono transition-colors"
                          >
                            +10
                          </button>

                          {isDirty && (
                            <button
                              type="button"
                              onClick={() => handleSaveStock(it.variant_id)}
                              disabled={updatingId === it.variant_id}
                              className="ml-2 flex items-center space-x-1 px-3 py-1 bg-[#4e342e] hover:bg-[#5d3f37] text-white rounded-lg shadow font-medium"
                            >
                              <Save className="w-3 h-3" />
                              <span>{updatingId === it.variant_id ? 'Saving...' : 'Save'}</span>
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
    </div>
  );
}
