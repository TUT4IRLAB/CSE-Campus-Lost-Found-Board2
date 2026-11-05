'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Building2,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';
import { TUT_CAMPUSES } from '@/data/mockData';
import { ItemCard } from '@/components/items/ItemCard';
import { useLostFound } from '@/context/LostFoundContext';

export default function HomePage() {
  const router = useRouter();
  const { items } = useLostFound();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('All');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCampus !== 'All') params.set('campus', selectedCampus);
    router.push(`/items?${params.toString()}`);
  };

  const recentItems = items.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-[#003366] to-[#002244] text-white pt-16 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#CC0000]/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#F5A623]/20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />
            Tshwane University of Technology • Campus Protection Services
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Lost Something on Campus? <br className="hidden sm:inline" />
            <span className="text-[#F5A623]">We Help You Reclaim It.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100/90 leading-relaxed">
            The official centralized lost-and-found repository for all TUT campuses.
            Search secured items in CPS custody or register your lost property with ownership verification.
          </p>

          {/* Hero Search Box */}
          <div className="pt-4 max-w-3xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-blue-200/50"
            >
              <div className="flex-1 flex items-center gap-2 px-3 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by item name, brand, e.g. 'MacBook', 'Student Card', 'Keys'..."
                  className="w-full py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Campus Selector */}
              <div className="w-full sm:w-56 border-t sm:border-t-0 sm:border-l border-slate-200 px-3 py-1">
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full py-2 text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="All">All TUT Campuses</option>
                  {TUT_CAMPUSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search CTA */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Find Item
              </button>
            </form>
          </div>

          {/* Quick Actions Row */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/report-lost"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#F5A623]" />
              Report a Lost Item
            </Link>
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-colors"
            >
              <Search className="w-4 h-4 text-blue-300" />
              Browse CPS Inventory
            </Link>
            <Link
              href="/report-found"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-emerald-300" />
              Found Something? Hand In
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 w-full z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#003366]">{items.length}</div>
              <div className="text-xs text-slate-500 font-medium">Secured in CPS Vaults</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-700">24-48 hrs</div>
              <div className="text-xs text-slate-500 font-medium">Avg CPS Verification</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-700">92%</div>
              <div className="text-xs text-slate-500 font-medium">Student Cards Returned</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-700">8</div>
              <div className="text-xs text-slate-500 font-medium">TUT Campuses Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#CC0000]">
            Simple & Transparent Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003366] mt-2">
            How Campus Property Claiming Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Designed to protect students against unauthorized claims while ensuring prompt recovery of genuine personal belongings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow relative">
            <span className="text-3xl font-black text-slate-200 absolute top-4 right-4">01</span>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">1. Browse or Report</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Search found items by campus or category. If not listed yet, register a detailed Lost Report so CPS can match incoming items.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow relative">
            <span className="text-3xl font-black text-slate-200 absolute top-4 right-4">02</span>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">2. Submit Ownership Proof</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Describe unique identifying marks, serial numbers, wallpapers, or contents. Confidential details are kept hidden from public view.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow relative">
            <span className="text-3xl font-black text-slate-200 absolute top-4 right-4">03</span>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">3. CPS Officers Verify</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Campus Protection Services cross-checks your submitted evidence against the physical item in vault custody.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow relative">
            <span className="text-3xl font-black text-slate-200 absolute top-4 right-4">04</span>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">4. Collect In Person</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Present your student card at the designated campus security station to verify your identity and sign the handover register.
            </p>
          </div>
        </div>
      </section>

      {/* Recently Found Items Showcase */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#003366]">
                Latest Custody Records
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Recently Found Items Across Campuses
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Items logged into CPS custody within the last 7 days.
              </p>
            </div>
            <Link
              href="/items"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:text-[#002244] hover:underline"
            >
              View all items ({items.length})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] shadow-sm transition-all"
            >
              Browse Complete Inventory
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TUT Safety & CPS Custody Policy Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#003366] to-[#001f3f] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CC0000] text-xs font-bold">
              Official University Policy
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Found property on TUT grounds?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              University regulations require all found items (especially electronics, student cards, and wallets) to be surrendered to the nearest Campus Protection Services (CPS) office or campus gate post within 24 hours.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle2 className="w-4 h-4" /> Secure Vault Storage
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle2 className="w-4 h-4" /> Signed Audit Handover
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle2 className="w-4 h-4" /> Confidential Ownership Check
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/report-found"
              className="px-6 py-3 rounded-xl bg-[#F5A623] hover:bg-[#d48b11] text-slate-900 text-xs font-bold text-center transition-colors shadow-md"
            >
              Hand In a Found Item
            </Link>
            <Link
              href="/cps"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold text-center transition-colors"
            >
              CPS Staff Verification Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
