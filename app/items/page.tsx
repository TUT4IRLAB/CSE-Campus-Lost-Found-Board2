'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, RefreshCcw, PackageSearch } from 'lucide-react';
import { TUT_CAMPUSES, ITEM_CATEGORIES } from '@/data/mockData';
import { CampusName } from '@/types';
import { ItemCard } from '@/components/items/ItemCard';
// 1. Import your API service function
import { fetchItems } from '@/services/api';

function BrowseItemsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCampus = (searchParams.get('campus') as CampusName) || 'All';

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCampus, setSelectedCampus] = useState<string>(initialCampus);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // 2. Load live inventory from Neon DB
  useEffect(() => {
    fetchItems()
      .then((data) => {
        setItems(data);
      })
      .catch((err) => console.error('Failed to load items:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.name && item.name.toLowerCase().includes(q)) ||
          (item.publicDescription && item.publicDescription.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.referenceNumber && item.referenceNumber.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      if (selectedCampus !== 'All' && item.campus !== selectedCampus) {
        return false;
      }

      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.dateFound || a.created_at || 0).getTime();
      const dateB = new Date(b.dateFound || b.created_at || 0).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [items, searchQuery, selectedCampus, selectedCategory, selectedStatus, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCampus('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCampus !== 'All' ||
    selectedCategory !== 'All' ||
    selectedStatus !== 'All';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Fetching live campus inventory from Neon database...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#003366]">
            Campus Inventory Directory (Live DB)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Browse Found Items in CPS Custody
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search items surrendered to campus protection services across all 8 TUT campuses.
          </p>
        </div>

        {/* Search & Main Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, model, reference ID..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          <div>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white cursor-pointer font-medium text-slate-700"
            >
              <option value="All">All Campuses</option>
              {TUT_CAMPUSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white cursor-pointer font-medium text-slate-700"
            >
              <option value="newest">Sort: Most Recently Found</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Filter by Category
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#003366] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#003366] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {ITEM_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#003366] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong className="text-slate-800">{filteredItems.length}</strong> items found
        </span>
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white cursor-pointer text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="in_cps_custody">In CPS Custody</option>
            <option value="claim_pending">Claim Pending</option>
            <option value="claimed_resolved">Claimed / Resolved</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#003366] flex items-center justify-center mx-auto">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No items matched your search criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms or switching campus filters.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id || item.uuid} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrowseItemsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-slate-400">Loading campus inventory...</div>}>
      <BrowseItemsContent />
    </Suspense>
  );
}