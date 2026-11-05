'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Search, CheckCircle2, Printer } from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { Button } from '@/components/ui/Button';
import { fetchClaims } from '@/services/api';

export default function CpsHandoverStationPage() {
  const { currentUser } = useLostFound();
  const [claims, setClaims] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

  const [checkedStudentCard, setCheckedStudentCard] = useState(false);
  const [checkedPhotoId, setCheckedPhotoId] = useState(false);
  const [checkedItemInspected, setCheckedItemInspected] = useState(false);
  const [officerNotes, setOfficerNotes] = useState('Physical student card verified. Property released.');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<any | null>(null);

  useEffect(() => {
    fetchClaims().then(setClaims).catch(console.error);
  }, []);

  const approvedClaims = claims.filter(
    (c) =>
      c.status === 'Approved' &&
      (searchQuery === '' ||
        (c.claimNumber && c.claimNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.claimantStudentId && c.claimantStudentId.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const canFinalize = checkedStudentCard && checkedPhotoId && checkedItemInspected;

  const handleFinalizeHandover = async () => {
    if (!selectedClaim || !canFinalize) return;
    setIsFinalizing(true);

    try {
      await fetch(`http://localhost:5000/api/claims/${selectedClaim.id || selectedClaim.uuid}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Completed',
          reviewNotes: officerNotes,
        }),
      });

      setCompletedReceipt({
        ...selectedClaim,
        status: 'Completed',
        handoverCompletedAt: new Date().toISOString(),
      });

      setIsFinalizing(false);
      setSelectedClaim(null);
      setCheckedStudentCard(false);
      setCheckedPhotoId(false);
      setCheckedItemInspected(false);
      
      // Refresh list
      const fresh = await fetchClaims();
      setClaims(fresh);
    } catch (err) {
      console.error('Handover completion failed:', err);
      setIsFinalizing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">In-Person Release Protocol</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Handover & Collection Verification Station</h1>
      </div>

      {completedReceipt ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Handover Completed Successfully</h3>
          <Button onClick={() => setCompletedReceipt(null)} variant="primary">Verify Another Handover</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Approved Claims Awaiting Collection ({approvedClaims.length})</h3>
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
                {approvedClaims.map((claim) => (
                  <div
                    key={claim.id || claim.uuid}
                    onClick={() => setSelectedClaim(claim)}
                    className={`p-4 rounded-2xl border cursor-pointer ${selectedClaim?.id === claim.id ? 'bg-blue-50 border-[#003366]' : 'bg-white'}`}
                  >
                    <div className="font-mono text-xs font-bold">{claim.claimNumber}</div>
                    <div className="text-xs font-bold text-slate-900">{claim.itemTitle}</div>
                    <div className="text-[11px] text-slate-500">{claim.claimantName} ({claim.claimantStudentId})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {selectedClaim ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
                <h3 className="text-lg font-bold">Verify & Release: {selectedClaim.itemTitle}</h3>
                
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer">
                    <input type="checkbox" checked={checkedStudentCard} onChange={(e) => setCheckedStudentCard(e.target.checked)} />
                    <span>Physical TUT Student Card Inspected</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer">
                    <input type="checkbox" checked={checkedPhotoId} onChange={(e) => setCheckedPhotoId(e.target.checked)} />
                    <span>Facial & Photo Identification Confirmed</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer">
                    <input type="checkbox" checked={checkedItemInspected} onChange={(e) => setCheckedItemInspected(e.target.checked)} />
                    <span>Property Physically Checked & Acknowledged</span>
                  </label>
                </div>

                <Button variant="primary" size="lg" disabled={!canFinalize} isLoading={isFinalizing} onClick={handleFinalizeHandover} className="w-full bg-emerald-700">
                  <UserCheck className="w-5 h-5 mr-2" /> Sign & Execute Physical Handover
                </Button>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border text-center text-xs text-slate-400">
                Select an Approved Claim from the queue on the left to begin verification.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}