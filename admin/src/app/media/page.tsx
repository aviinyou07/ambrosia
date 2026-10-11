"use client";
import React, { useEffect, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Cloud,
  ExternalLink,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { listMediaAssets, uploadMediaFile, R2_PUBLIC_URL } from '@/lib/apis';

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await listMediaAssets();
      if (res.success && res.data) {
        setAssets(res.data);
      }
    } catch (err) {
      console.error('Failed to load media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadMediaFile(file);
      if (res.success) {
        fetchAssets();
      } else {
        alert(res.message || 'Media upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
            Cloudflare R2 Media Vault
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Global high-speed edge distribution for product imagery, lookbooks, and high-res fabrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAssets}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
            title="Refresh assets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <label className="cursor-pointer flex items-center space-x-2 px-4 py-2.5 bg-[#4e342e] hover:bg-[#5d3f37] text-white text-xs font-semibold rounded-xl shadow-lg transition-all border border-[#8d6e63]/40">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading to R2...' : 'Upload Asset'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Cloudflare Bucket Spec Card */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl p-5">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Cloud className="w-4 h-4" />
          <span>Active Storage Destination</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-[#0b0d13] p-3 rounded-xl border border-gray-800">
            <span className="text-gray-500 text-[10px] uppercase block">Bucket Name</span>
            <span className="text-white font-bold">ambrosia</span>
          </div>
          <div className="bg-[#0b0d13] p-3 rounded-xl border border-gray-800">
            <span className="text-gray-500 text-[10px] uppercase block">Edge Endpoint</span>
            <span className="text-gray-300 truncate block">80cb977372f202bf141deb4906b650d6.r2</span>
          </div>
          <div className="bg-[#0b0d13] p-3 rounded-xl border border-gray-800">
            <span className="text-gray-500 text-[10px] uppercase block">Public Domain</span>
            <span className="text-emerald-400 truncate block">{R2_PUBLIC_URL}</span>
          </div>
        </div>
      </div>

      {/* Media Assets Gallery Grid */}
      <div className="bg-[#11141e] border border-gray-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Media Assets Repository ({assets.length})
          </h3>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500 text-xs">
            Connecting to Cloudflare R2 bucket...
          </div>
        ) : assets.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-xs flex flex-col items-center justify-center space-y-2">
            <FolderOpen className="w-8 h-8 text-gray-600" />
            <p>No media files uploaded yet. Click "Upload Asset" above to store files in Cloudflare R2.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {assets.map((item) => {
              const isCopied = copiedKey === item.key;

              return (
                <div
                  key={item.key}
                  className="bg-[#0b0d13] border border-gray-800 hover:border-amber-500/40 rounded-xl overflow-hidden group transition-all flex flex-col justify-between"
                >
                  <div className="h-36 bg-gray-900 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.key}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-gray-900/90 text-white rounded-lg hover:bg-black transition-colors"
                        title="View Full Image"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="p-2.5 space-y-1.5 text-[11px]">
                    <p className="font-medium text-gray-200 truncate font-mono text-[10px]" title={item.key}>
                      {item.key}
                    </p>
                    <p className="text-gray-500 text-[10px]">{formatFileSize(item.size)}</p>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.url, item.key)}
                      className="w-full mt-1 flex items-center justify-center space-x-1 py-1 px-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
