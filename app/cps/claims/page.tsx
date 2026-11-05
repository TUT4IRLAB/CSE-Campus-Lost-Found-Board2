'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  Search,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ClaimStatus } from '@/types';
// 1. Import your API service helper
import { fetchClaims, submitClaim } from '@/services/api'; // (or update claim status via your API)

function CpsClaimsContent() {
  const searchParams = useSearchParams();
  const reviewClaimId = searchParams.get('review');

  const { getItemById } = useLostFound();

  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(reviewClaimId);

  // 2. Fetch live claims from Neon Postgres on mount
  useEffect(() => {
    fetchClaims()
      .then((data) => {
        setClaims(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch claims:', err);
        setLoading(false);
      });
  }, []);

  const inspectClaim = selectedClaimId ? claims.find((c) => c.id === selectedClaimId || c.uuid === selectedClaimId) || null : null;

  const [reviewNotes, setReviewNotes] = useState('');
  const [handoverDate, setHandoverDate] = useState('2026-10-15 10:00');
  const [handoverLocation, setHandoverLocation] = useState(
    'Pretoria Campus Security Office (Building 21 Ground Floor)'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredClaims = claims.filter((claim) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (claim.claimNumber && claim.claimNumber.toLowerCase().includes(q)) ||
        (claim.itemTitle && claim.itemTitle.toLowerCase().includes(q)) ||
        (claim.claimantName && claim.claimantName.toLowerCase().includes(q)) ||
        (claim.claimantStudentId && claim.claimantStudentId.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedStatus !== 'All' && claim.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const handleDecision = async (newStatus: ClaimStatus) => {
    if (!inspectClaim) return;
    setIsProcessing(true);

    try {
      // 3. Make API call to update claim status in backend
      const res = await fetch(`http://localhost:5000/api/claims/${inspectClaim.id || inspectClaim.uuid}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          reviewNotes: reviewNotes || (newStatus === 'Approved' ? 'Evidence matches physical item.' : 'Rejected by CPS.'),
          handoverDate,
          handoverLocation,
        }),
      });

      if (!res.ok) throw new Error('Failed to update claim status');

      // Refresh local claims state
      const updatedClaims = await fetchClaims();
      setClaims(updatedClaims);

      setIsProcessing(false);
      setSelectedClaimId(null);
      setReviewNotes('');
    } catch (err) {
      console.error('Error updating claim decision:', err);
      setIsProcessing(false);
    }
  };

  const associatedItem = inspectClaim ? getItemById(inspectClaim.itemId) : undefined;

  if (loading) return <div className="p-12 text-center text-xs">Loading live claims from database...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#003366]">Claims Review Queue</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Ownership Verification Adjudication</h1>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claim #, student name, student ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
          />
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Claim ID</th>
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Claimant</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClaims.map((claim) => (
              <tr key={claim.id || claim.uuid} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{claim.claimNumber || 'CLM-01'}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{claim.itemTitle || 'Lost Item'}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{claim.claimantName}</td>
                <td className="py-3.5 px-4"><Badge variant={claim.status} size="sm">{claim.status}</Badge></td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedClaimId(claim.id || claim.uuid)}
                    className="px-3 py-1.5 rounded-lg bg-[#003366] text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F5A623]" /> Review Evidence
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjudication Modal */}
      <Modal
        isOpen={!!inspectClaim}
        onClose={() => setSelectedClaimId(null)}
        title={`Adjudication: ${inspectClaim?.claimNumber || 'Claim'}`}
        description={`Claimant: ${inspectClaim?.claimantName}`}
        maxWidth="2xl"
      >
        {inspectClaim && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Evidence Submitted:</span>
              <p className="p-2.5 rounded-xl bg-white border text-slate-800">{inspectClaim.evidenceDescription}</p>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <Button type="button" variant="danger" size="sm" onClick={() => handleDecision('Rejected')} disabled={isProcessing}>
                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
              </Button>
              <Button type="button" variant="primary" size="md" isLoading={isProcessing} onClick={() => handleDecision('Approved')} className="bg-emerald-700 hover:bg-emerald-800">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve for Handover
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function CpsClaimsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs">Loading queue...</div>}>
      <CpsClaimsContent />
    </Suspense>
  );
}