'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { TUT_CAMPUSES, ITEM_CATEGORIES } from '@/data/mockData';
import { CampusName, ItemCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { createItem } from '@/services/api';

export default function ReportFoundPage() {
  const { currentUser } = useLostFound();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics' as ItemCategory,
    campus: (currentUser?.campus || 'Pretoria Campus') as CampusName,
    specificLocation: '',
    dateFound: new Date().toISOString().split('T')[0],
    publicDescription: '',
    confidentialDetails: '',
    storageLocation: 'To be handed in to Campus Security Station',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await createItem({
        name: formData.title,
        category: formData.category,
        description: formData.publicDescription,
        confidentialDetails: formData.confidentialDetails,
        dateFound: formData.dateFound,
        location: `${formData.specificLocation} (${formData.storageLocation})`,
        campus: formData.campus,
        reportedBy: currentUser?.name || 'Good Samaritan Student',
      });

      setSuccessRef(response.referenceNumber || 'REF-CPS-' + Math.floor(1000 + Math.random() * 9000));
    } catch (err: any) {
      console.error('Failed to submit found item:', err);
      setErrorMessage(err.message || 'Failed to register found item on server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Good Samaritan Submission (Neon DB Connected)
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Found Property on Campus?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Help return lost items to fellow TUT students and staff by logging the details before handing it over to CPS.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {successRef ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Found Item Registered in Vault Ledger
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Receipt Reference #{successRef}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Thank you for upholding the TUT spirit! Please hand this item over to the nearest Campus Protection Services (CPS) guard post or reception desk within 24 hours, quoting reference <strong>#{successRef}</strong>.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/items"
              className="px-6 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244]"
            >
              View in Public Listings
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-[#002244] text-white p-5 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F5A623] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-white">Custody Handover Guideline</h4>
              <p className="text-blue-100 leading-relaxed">
                Items found anywhere on university property must be surrendered to CPS for secure storage in the campus vault. Do not hold valuable electronics or student cards in personal custody.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Name / Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Huawei Nova Smartphone / Black Casio Watch"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ItemCategory })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus Where Found <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value as CampusName })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer"
                >
                  {TUT_CAMPUSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date Found <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateFound}
                  onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Location Where Found <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.specificLocation}
                  onChange={(e) => setFormData({ ...formData, specificLocation: e.target.value })}
                  placeholder="e.g. Building 10 Cafeteria table / Library 1st floor printer station"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Public Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.publicDescription}
                onChange={(e) => setFormData({ ...formData, publicDescription: e.target.value })}
                placeholder="Brief public description (do NOT include secret passwords or serial numbers here)..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confidential Ownership Check Details (CPS Only)
              </label>
              <p className="text-[11px] text-slate-500 mb-1.5">
                Hidden details (e.g., sticker under case, lock screen photo, internal marking) that the owner must identify to claim.
              </p>
              <textarea
                rows={2}
                value={formData.confidentialDetails}
                onChange={(e) => setFormData({ ...formData, confidentialDetails: e.target.value })}
                placeholder="e.g. Lock screen has a picture of a cat; sticker on the back..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
              >
                Register Found Item for CPS Intake
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}