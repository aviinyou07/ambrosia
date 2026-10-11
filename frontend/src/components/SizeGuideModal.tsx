"use client";
import React from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const chart = [
    { size: 'XS', bust: '32"', waist: '26"', hip: '36"', length: '46"' },
    { size: 'S', bust: '34"', waist: '28"', hip: '38"', length: '46"' },
    { size: 'M', bust: '36"', waist: '30"', hip: '40"', length: '47"' },
    { size: 'L', bust: '38"', waist: '32"', hip: '42"', length: '47"' },
    { size: 'XL', bust: '40"', waist: '34"', hip: '44"', length: '48"' },
    { size: 'XXL', bust: '42"', waist: '36"', hip: '46"', length: '48"' },
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg p-6 md:p-8 shadow-2xl z-10 border border-gray-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <h3 className="font-serif text-xl tracking-wide text-gray-900 uppercase">
            Size & Measurement Guide
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-black p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          All measurements are in inches. For a relaxed or customized fit, we recommend selecting your exact bust measurement.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Bust</th>
                <th className="py-2.5 px-3">Waist</th>
                <th className="py-2.5 px-3">Hip</th>
                <th className="py-2.5 px-3">Kurta Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {chart.map((row) => (
                <tr key={row.size} className="hover:bg-[#faf9f8] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#4e342e]">{row.size}</td>
                  <td className="py-3 px-3">{row.bust}</td>
                  <td className="py-3 px-3">{row.waist}</td>
                  <td className="py-3 px-3">{row.hip}</td>
                  <td className="py-3 px-3">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400">
            Need styling or custom alteration assistance? Contact us at <strong className="text-gray-700">care@avyara.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
