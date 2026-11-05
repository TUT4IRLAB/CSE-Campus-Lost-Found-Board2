'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  Building,
  User,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { CategoryIcon } from '@/components/items/CategoryIcon';
// 1. Import your API service helper
import { fetchItems } from '@/services/api';

function ItemDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the specific item from the live Express backend
  useEffect(() => {
    if (!id) return;

    fetchItems()
      .then((data: any[]) => {
        // Find matching item by id or uuid
        const found = data.find((i) => i.id === id || i.uuid === id || String(i.id) === id);
        setItem(found || null);
      })
      .catch((err) => console.error('Failed to load item from API:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading item record from Neon database...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Item Not Found</h2>
        <p className="text-xs text-slate-500">
          The item reference you are looking for does not exist or has been archived.
        </p>
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003366] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
      </div>
    );
  }

  const isResolved = item.status === 'claimed_resolved';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#003366] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Col: Media & Category Illustration */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-900 via-[#003366] to-[#001f3f] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white">
              {item.referenceNumber || 'REF-ITEM'}
            </span>
            <Badge variant={item.status || 'in_cps_custody'} size="sm">
              {(item.status || 'in_cps_custody').replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="relative z-10 my-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
              <CategoryIcon category={item.category} className="w-14 h-14 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5A623]">
                {item.category}
              </span>
              <p className="text-[11px] text-blue-200 mt-0.5">Secured Property</p>
            </div>
          </div>

          <div className="relative z-10 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-[11px] text-blue-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Lock className="w-3.5 h-3.5 text-[#F5A623]" />
              Custody Location
            </div>
            <p className="text-[10px] text-blue-200">{item.storageLocation || item.location || 'Pretoria Campus Vault'}</p>
          </div>
        </div>

        {/* Right Col: Item Details & Actions */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                Found Item Record
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                {item.title || item.name}
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Campus</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Building className="w-3.5 h-3.5 text-[#003366]" />
                  {item.campus || 'Pretoria Campus'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Date Found</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-[#003366]" />
                  {item.dateFound || '2026-10-13'}
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Location Found</span>
                <div className="flex items-start gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-[#CC0000] shrink-0 mt-0.5" />
                  <span>{item.specificLocation || item.location}</span>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Logged By</span>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.loggedBy || item.reportedBy || 'CPS Duty Officer'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Public Description
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                {item.publicDescription || item.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                Ownership Verification Protocol
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Unique identifying marks, lock-screen wallpapers, and serial numbers are strictly withheld from public view.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            {!isResolved ? (
              <Link
                href={`/claim/${item.id || item.uuid}`}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-[#F5A623]" />
                Submit Ownership Claim
              </Link>
            ) : (
              <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold text-center">
                This item was claimed and collected by its owner.
              </div>
            )}
            <Link
              href="/report-lost"
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-colors"
            >
              File Lost Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs">Loading item details...</div>}>
      <ItemDetailsContent />
    </Suspense>
  );
}