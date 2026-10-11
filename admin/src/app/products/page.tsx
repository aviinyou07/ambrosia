"use client";
import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Upload,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminProducts,
  getAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadMediaFile,
} from '@/lib/apis';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    price: '',
    original_price: '',
    discount_percentage: 0,
    tag: 'New arrival',
    description: '',
    material_and_care: '',
    shipping_and_returns: 'Free shipping on orders above ₹2,000.',
    fabric: 'Pure Cotton',
    style: 'Straight Sets',
    color: '',
    is_featured: false,
    images: [] as string[],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 5 },
    ],
  });

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        getAdminProducts({ category: selectedCategory, search }),
        getAdminCategories(),
      ]);

      if (prodRes.success && prodRes.data) setProducts(prodRes.data);
      if (catRes.success && catRes.data) setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      slug: '',
      category_id: categories[0]?.id || '',
      price: '',
      original_price: '',
      discount_percentage: 0,
      tag: 'New arrival',
      description: '',
      material_and_care: 'Pure handcrafted fabric. Dry clean or gentle hand wash.',
      shipping_and_returns: 'Free delivery on prepaid orders. 7-day hassle-free returns.',
      fabric: 'Silk / Cotton',
      style: 'Ethnic Classic',
      color: 'Crimson Wine',
      is_featured: false,
      images: ['/images/ethnic_kurta_set_1789624822973.jpg'],
      sizes: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 5 },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title,
      slug: prod.slug,
      category_id: prod.category_id || '',
      price: String(prod.price),
      original_price: prod.original_price ? String(prod.original_price) : '',
      discount_percentage: prod.discount_percentage || 0,
      tag: prod.tag || 'New arrival',
      description: prod.description || '',
      material_and_care: prod.material_and_care || '',
      shipping_and_returns: prod.shipping_and_returns || '',
      fabric: prod.fabric || '',
      style: prod.style || '',
      color: prod.color || '',
      is_featured: Boolean(prod.is_featured),
      images: Array.isArray(prod.images) ? prod.images : [],
      sizes: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 5 },
      ],
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handlePriceChange = (priceStr: string, origPriceStr: string) => {
    const p = parseFloat(priceStr) || 0;
    const orig = parseFloat(origPriceStr) || 0;
    let disc = 0;
    if (orig > p && orig > 0) {
      disc = Math.round(((orig - p) / orig) * 100);
    }
    setFormData((prev) => ({
      ...prev,
      price: priceStr,
      original_price: origPriceStr,
      discount_percentage: disc,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadMediaFile(file);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          images: [res.data!.url, ...prev.images],
        }));
      } else {
        alert(res.message || 'Image upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, {
          title: formData.title,
          slug: formData.slug,
          category_id: formData.category_id,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          discount_percentage: formData.discount_percentage,
          tag: formData.tag,
          description: formData.description,
          material_and_care: formData.material_and_care,
          shipping_and_returns: formData.shipping_and_returns,
          fabric: formData.fabric,
          style: formData.style,
          color: formData.color,
          is_featured: formData.is_featured,
          images: formData.images,
        });

        if (res.success) {
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(res.message || 'Failed to update product');
        }
      } else {
        const res = await createProduct({
          title: formData.title,
          slug: formData.slug,
          category_id: formData.category_id,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          discount_percentage: formData.discount_percentage,
          tag: formData.tag,
          description: formData.description,
          material_and_care: formData.material_and_care,
          shipping_and_returns: formData.shipping_and_returns,
          fabric: formData.fabric,
          style: formData.style,
          color: formData.color,
          is_featured: formData.is_featured,
          images: formData.images,
          sizes: formData.sizes,
        });

        if (res.success) {
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(res.message || 'Failed to create product');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Server error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently remove "${title}"?`)) return;

    const res = await deleteProduct(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(res.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Product Catalog Management
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Create, curate, and configure luxury ethnic silhouettes, variant sizing, and R2 media.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#4e342e] hover:bg-[#5d3f37] text-white text-xs font-semibold rounded-xl shadow-lg transition-all border border-[#8d6e63]/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, fabric, or style..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#11141e] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#8d6e63]"
          />
        </form>

        <div className="sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3 bg-[#11141e] border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#8d6e63]"
          >
            <option value="">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800/80 text-gray-400 uppercase tracking-wider text-[10px] bg-[#0d0f17]">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Badge</th>
                <th className="py-3.5 px-4 font-semibold">Sizes / Stock</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    Loading product inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No products matching search criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const mainImage = Array.isArray(p.images) && p.images[0] ? p.images[0] : null;

                  return (
                    <tr key={p.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-14 rounded-lg bg-gray-800 overflow-hidden shrink-0 border border-gray-700/60 relative">
                            {mainImage ? (
                              <img src={mainImage} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-medium text-gray-200 truncate">{p.title}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300 font-medium">
                        {p.category_name || 'Unassigned'}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">₹{parseFloat(p.price).toLocaleString('en-IN')}</p>
                        {p.original_price && (
                          <p className="text-[10px] text-gray-500 line-through">
                            ₹{parseFloat(p.original_price).toLocaleString('en-IN')}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.tag ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            {p.tag}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-gray-300 font-semibold">{p.total_stock || 0} in stock</p>
                        <p className="text-[10px] text-gray-500">
                          {Array.isArray(p.sizes) ? p.sizes.join(', ') : 'Free Size'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-gray-800 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#11141e] border border-gray-800 rounded-2xl w-full max-w-3xl my-8 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  {editingProduct ? 'Edit Catalog Item' : 'New Luxury Silhouette'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Configure pricing, fabric specifications, and Cloudflare R2 media.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Royal Banarasi Silk Saree"
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#8d6e63]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="royal-banarasi-silk-saree"
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-amber-400 font-mono focus:outline-none focus:border-[#8d6e63]"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#8d6e63]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Marketing Tag / Badge</label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#8d6e63]"
                  >
                    <option value="New arrival">New arrival</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Trending">Trending</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>
              </div>

              {/* Pricing Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0b0d13] p-4 rounded-xl border border-gray-800">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handlePriceChange(e.target.value, formData.original_price)}
                    placeholder="2699"
                    className="w-full px-3 py-2 bg-[#11141e] border border-gray-700 rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => handlePriceChange(formData.price, e.target.value)}
                    placeholder="4499"
                    className="w-full px-3 py-2 bg-[#11141e] border border-gray-700 rounded-xl text-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Calculated Discount</label>
                  <div className="px-3 py-2 bg-[#11141e] border border-gray-700 rounded-xl text-amber-400 font-bold">
                    {formData.discount_percentage}% OFF
                  </div>
                </div>
              </div>

              {/* Fabric, Style, Color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Fabric</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fabric: e.target.value }))}
                    placeholder="Pure Organza Silk"
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Style</label>
                  <input
                    type="text"
                    value={formData.style}
                    onChange={(e) => setFormData((prev) => ({ ...prev, style: e.target.value }))}
                    placeholder="Anarkali / Straight"
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    placeholder="Pastel Rose"
                    className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed artisanal craftsmanship notes..."
                  className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              {/* Cloudflare R2 Image Upload */}
              <div className="bg-[#0b0d13] p-4 rounded-xl border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-200">Cloudflare R2 Media Gallery</h4>
                    <p className="text-[11px] text-gray-500">
                      Upload directly to R2 bucket <code className="text-amber-400">ambrosia</code>
                    </p>
                  </div>
                  <label className="cursor-pointer flex items-center space-x-1.5 px-3 py-1.5 bg-[#4e342e] hover:bg-[#5d3f37] text-white rounded-lg text-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Images Preview Grid */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {formData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-20 rounded-lg overflow-hidden border border-gray-700 bg-gray-900 group"
                    >
                      <img src={imgUrl} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length === 0 && (
                    <p className="text-gray-600 text-[11px] italic py-2">No images uploaded yet.</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
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
                  {submitting ? 'Saving Item...' : editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
