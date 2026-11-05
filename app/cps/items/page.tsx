'use client';

import React, { useState, useMemo } from 'react';
import {
  Lock,
  PlusCircle,
  Search,
  Eye,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TUT_CAMPUSES, ITEM_CATEGORIES } from '@/data/mockData';
import { FoundItem, CampusName, ItemCategory } from '@/types';
import { CategoryIcon } from '@/components/items/CategoryIcon';

export default function CpsItemsManagementPage() {
  const { items, submitFoundItem } = useLostFound();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [inspectItem, setInspectItem] = useState<FoundItem | null>(null);

  // New item form state
  const [newItemData, setNewItemData] = useState({
    title: '',
    category: 'Electronics' as ItemCategory,
    campus: 'Pretoria Campus' as CampusName,
    specificLocation: '',
    dateFound: '2026-10-13',
    publicDescription: '',
    confidentialDetails: '',
    storageLocation: 'Pretoria Campus CPS Vault Shelf A-1',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.referenceNumber.toLowerCase().includes(q) ||
          item.storageLocation.toLowerCase().includes(q) ||
          item.confidentialDetails.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedCampus !== 'All' && item.campus !== selectedCampus) return false;
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      return true;
    });
  }, [items, searchQuery, selectedCampus, selectedStatus, selectedCategory]);

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitFoundItem(newItemData);
      setIsSubmitting(false);
      setIsNewItemModalOpen(false);
      setNewItemData({
        title: '',
        category: 'Electronics',
        campus: 'Pretoria Campus',
        specificLocation: '',
        dateFound: '2026-10-13',
        publicDescription: '',
        confidentialDetails: '',
        storageLocation: 'Pretoria Campus CPS Vault Shelf A-1',
      });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#003366]">
            Physical Inventory Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Found Items Vault Custody
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage vault storage locations, confidential records, and status of property held by CPS.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewItemModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#F5A623]" />
          Log New Found Item to Vault
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, title, locker, serial..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
          />
        </div>

        <select
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer font-medium text-slate-700"
        >
          <option value="All">All Campuses</option>
          {TUT_CAMPUSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer font-medium text-slate-700"
        >
          <option value="All">All Categories</option>
          {ITEM_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer font-medium text-slate-700"
        >
          <option value="All">All Statuses</option>
          <option value="in_cps_custody">In CPS Custody</option>
          <option value="claim_pending">Claim Pending</option>
          <option value="claimed_resolved">Claimed & Handed Over</option>
        </select>
      </div>

      {/* Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Campus & Storage Locker</th>
                <th className="py-3 px-4">Date Found</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No items found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                      {item.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                        {item.specificLocation}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        <CategoryIcon category={item.category} className="w-3 h-3" />
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.campus}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#CC0000]" />
                        {item.storageLocation}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.dateFound}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={item.status} size="sm">
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setInspectItem(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#003366] font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Record
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Item Record Modal */}
      <Modal
        isOpen={!!inspectItem}
        onClose={() => setInspectItem(null)}
        title={`CPS Custody Dossier: ${inspectItem?.referenceNumber}`}
        description={`Item: ${inspectItem?.title} • Campus: ${inspectItem?.campus}`}
        maxWidth="xl"
      >
        {inspectItem && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Current Status
                </span>
                <div className="mt-0.5">
                  <Badge variant={inspectItem.status} size="md">
                    {inspectItem.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Vault Locker Location
                </span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">
                  {inspectItem.storageLocation}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Public Description
              </span>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
                {inspectItem.publicDescription}
              </p>
            </div>

            {/* CONFIDENTIAL CPS RECORDS */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Confidential Verification Notes (CPS Internal)
              </span>
              <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-red-950 font-mono text-[11px] leading-relaxed">
                {inspectItem.confidentialDetails}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Intake Logged By:</span>
                <span className="font-bold text-slate-800">{inspectItem.loggedBy}</span>
              </div>
              <div className="flex justify-between">
                <span>Secured At Campus:</span>
                <span>{inspectItem.campus}</span>
              </div>
              <div className="flex justify-between">
                <span>Date Logged:</span>
                <span>{inspectItem.createdAt}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Log New Found Item Modal */}
      <Modal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        title="Log New Found Property into CPS Vault"
        description="Register an item surrendered to campus security into the central university custody ledger"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Item Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newItemData.title}
                onChange={(e) =>
                  setNewItemData({ ...newItemData, title: e.target.value })
                }
                placeholder="e.g. Apple iPad Air 10.9-inch"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={newItemData.category}
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    category: e.target.value as ItemCategory,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Campus Location <span className="text-red-500">*</span>
              </label>
              <select
                value={newItemData.campus}
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    campus: e.target.value as CampusName,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer"
              >
                {TUT_CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Date Found <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={newItemData.dateFound}
                onChange={(e) =>
                  setNewItemData({ ...newItemData, dateFound: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Specific Location Where Found <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newItemData.specificLocation}
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    specificLocation: e.target.value,
                  })
                }
                placeholder="e.g. Pretoria Campus Library 2nd Floor Carrel 8"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Vault Locker / Storage Safe Assignment <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newItemData.storageLocation}
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    storageLocation: e.target.value,
                  })
                }
                placeholder="e.g. Pretoria Campus Security Vault Cabinet B-04"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Public Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={newItemData.publicDescription}
              onChange={(e) =>
                setNewItemData({
                  ...newItemData,
                  publicDescription: e.target.value,
                })
              }
              placeholder="Publicly viewable description without confidential secrets..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          <div>
            <label className="block font-bold text-red-700 mb-1">
              Confidential Ownership Verification Details (Strictly CPS Internal) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={newItemData.confidentialDetails}
              onChange={(e) =>
                setNewItemData({
                  ...newItemData,
                  confidentialDetails: e.target.value,
                })
              }
              placeholder="Record serial numbers, distinctive tears, scratches, stickers, or lockscreen photos..."
              className="w-full px-3 py-2 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-[#CC0000] bg-red-50/30"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewItemModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              Log Property into CPS Vault
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
