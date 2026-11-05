'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { TUT_CAMPUSES, ITEM_CATEGORIES } from '@/data/mockData';
import { CampusName, ItemCategory } from '@/types';
import { Button } from '@/components/ui/Button';

export default function ReportLostPage() {
  const { currentUser } = useLostFound();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics' as ItemCategory,
    campus: (currentUser?.campus || 'Pretoria Campus') as CampusName,
    specificLocation: '',
    dateLost: '',
    description: '',
    distinctiveMarks: '',
    contactEmail: currentUser?.email || '',
    contactPhone: currentUser?.phone || '',
  });

  // Safely set today's date on the client side to avoid Next.js prerender error
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dateLost: new Date().toISOString().split('T')[0],
      campus: (currentUser?.campus || prev.campus) as CampusName,
      contactEmail: currentUser?.email || prev.contactEmail,
      contactPhone: currentUser?.phone || prev.contactPhone,
    }));
  }, [currentUser]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successReportRef, setSuccessReportRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Item title is required';
    if (!formData.specificLocation.trim())
      newErrors.specificLocation = 'Please specify where you lost the item';
    if (!formData.description.trim())
      newErrors.description = 'Please provide a general description';
    if (!formData.distinctiveMarks.trim())
      newErrors.distinctiveMarks =
        'Please list at least one distinguishing mark or feature';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(file.name); // Instantly records file name without lag
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser?.id || currentUser?.studentNumber || 'STU-01',
          title: formData.title,
          category: formData.category,
          campus: formData.campus,
          specificLocation: formData.specificLocation,
          dateLost: formData.dateLost,
          description: formData.description,
          distinctiveMarks: formData.distinctiveMarks,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          imageUrl: imagePreview, // Sends the file name string to backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register lost report on backend server.');
      }

      const result = await response.json();
      setSuccessReportRef(result.referenceNumber || 'REP-CPS-' + Math.floor(1000 + Math.random() * 9000));
    } catch (err: any) {
      console.error('Error submitting lost report:', err);
      setErrorMessage(err.message || 'Failed to submit report to database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#CC0000]">
          Student Services (Neon DB Connected)
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Register a Lost Property Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide detailed specifications so Campus Protection Services can match items handed in by students or security patrols.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {successReportRef ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Report Successfully Logged in Database
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Reference #{successReportRef}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Your lost item report is now registered in the TUT central database. If an item matching these specifications is handed to CPS, you will receive an automated notification.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/my-reports"
              className="px-6 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] shadow-sm"
            >
              View My Reports
            </Link>
            <Link
              href="/items"
              className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
            >
              Browse Currently Found Items
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366] border-b border-slate-100 pb-2">
                1. Item Particulars
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Item Name & Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Dell Inspiron 15 / Casio fx-82ZA / Leather Wallet"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.title ? 'border-red-500' : 'border-slate-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#003366]`}
                  />
                  {errors.title && (
                    <span className="text-[11px] text-red-500 mt-1 block">
                      {errors.title}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ItemCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer font-medium text-slate-700"
                  >
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Date */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366] border-b border-slate-100 pb-2">
                2. Location & Timeline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Lost On <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.campus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        campus: e.target.value as CampusName,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer font-medium text-slate-700"
                  >
                    {TUT_CAMPUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Approximate Date Lost <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateLost}
                    onChange={(e) =>
                      setFormData({ ...formData, dateLost: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Building / Room / Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.specificLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specificLocation: e.target.value,
                      })
                    }
                    placeholder="e.g. Building 3 Computer Lab G-04 / Library 2nd Floor Carrels / Cafeteria"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.specificLocation
                        ? 'border-red-500'
                        : 'border-slate-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#003366]`}
                  />
                  {errors.specificLocation && (
                    <span className="text-[11px] text-red-500 mt-1 block">
                      {errors.specificLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Descriptions & Identifying Marks */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366] border-b border-slate-100 pb-2">
                3. Identifying Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="General physical appearance: color, size, brand..."
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                    errors.description ? 'border-red-500' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#003366]`}
                />
                {errors.description && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {errors.description}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confidential Distinctive Marks / Serials / Hidden Identifiers <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  This is kept confidential with CPS for ownership verification matching (e.g. scratched initials, sticker on back, IMEI, tear under strap).
                </p>
                <textarea
                  rows={3}
                  value={formData.distinctiveMarks}
                  onChange={(e) =>
                    setFormData({ ...formData, distinctiveMarks: e.target.value })
                  }
                  placeholder="e.g. Initials 'TM' engraved inside battery cover, scratch across Apple logo..."
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                    errors.distinctiveMarks
                      ? 'border-red-500'
                      : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#003366]`}
                />
                {errors.distinctiveMarks && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {errors.distinctiveMarks}
                  </span>
                )}
              </div>

              {/* Fast File Name Upload Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reference Photograph (Optional)
                </label>

                {imagePreview ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-medium text-slate-700 truncate">
                      📎 {imagePreview}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 relative hover:bg-slate-50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">
                      Click or drag to select a photo file
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Attaches instantly without lag
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
              >
                Submit Lost Property Report
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}