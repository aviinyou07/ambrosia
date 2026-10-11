"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree, X, Upload } from 'lucide-react';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadMediaFile,
} from '@/lib/apis';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 1,
  });

  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      display_order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      display_order: cat.display_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadMediaFile(file);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, image_url: res.data!.url }));
      } else {
        alert(res.message || 'Image upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          alert(res.message || 'Failed to update category');
        }
      } else {
        const res = await createCategory(formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          alert(res.message || 'Failed to create category');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Server error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    const res = await deleteCategory(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(res.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Category Taxonomy & Curation
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Organize collections, navigation headers, and mega menu hierarchy for Ambrosia Vastra.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#4e342e] hover:bg-[#5d3f37] text-white text-xs font-semibold rounded-xl shadow-lg transition-all border border-[#8d6e63]/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-gray-500">
            Loading taxonomy tree...
          </div>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="bg-[#11141e] border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-700 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-14 rounded-lg bg-gray-800 overflow-hidden shrink-0 border border-gray-700/60 relative">
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <FolderTree className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300 font-mono">
                    Order #{c.display_order}
                  </span>
                </div>

                <h3 className="font-serif text-base font-medium text-white">{c.name}</h3>
                <p className="text-[11px] font-mono text-amber-400 mt-0.5">/collections/{c.slug}</p>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                  {c.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800/80 mt-4 flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  <strong className="text-white">{c.product_count || 0}</strong> products
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141e] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Sharara Sets"
                  className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#8d6e63]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Slug URL *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="sharara-sets"
                  className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-amber-400 font-mono focus:outline-none focus:border-[#8d6e63]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))
                  }
                  className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Artisanal description for SEO & collection header..."
                  className="w-full px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Image URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://... or /images/..."
                    className="flex-1 px-3 py-2 bg-[#0b0d13] border border-gray-800 rounded-xl text-white focus:outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-[#4e342e] hover:bg-[#5d3f37] text-white rounded-xl flex items-center space-x-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
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
                  {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
