'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Clock,
  CheckCircle2,
  MapPin,
  Eye,
  UserCheck,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ClaimTimeline } from '@/components/claims/ClaimTimeline';
import { CategoryIcon } from '@/components/items/CategoryIcon';
import { fetchClaims } from '@/services/api';

export default function MyClaimsPage() {
  const { currentUser } = useLostFound();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

  // Fetch claims from backend API
  useEffect(() => {
    if (!currentUser?.id && !currentUser?.studentNumber) {
      setLoading(false);
      return;
    }

    const studentId = currentUser?.id || currentUser?.studentNumber;
    fetchClaims(studentId)
      .then((data) => setClaims(data))
      .catch((err) => console.error('Failed to fetch claims:', err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading ownership claims from Neon database...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#003366]">
            Ownership Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            My Ownership Claims
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track verification progress and collection instructions for items claimed from CPS custody.
          </p>
        </div>

        <Link
          href="/items"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] shadow-sm self-start sm:self-auto"
        >
          <Shield className="w-4 h-4 text-[#F5A623]" />
          Browse Items to Claim
        </Link>
      </div>

      {/* Claims List */}
      {claims.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No active ownership claims found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven&apos;t filed a claim for any found property. If you recognise your belongings in the public inventory, file an ownership claim.
          </p>
          <div className="pt-2">
            <Link
              href="/items"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244]"
            >
              Browse Campus Inventory
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id || claim.uuid}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003366] flex items-center justify-center shrink-0">
                    <CategoryIcon category={claim.itemCategory || claim.category || 'Electronics'} className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {claim.claimNumber || claim.referenceNumber || 'CLM-REC'}
                      </span>
                      <Badge variant={claim.status || 'Under Review'} size="sm">
                        {claim.status || 'Under Review'}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {claim.itemTitle || claim.title || 'Claimed Property'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#003366]" />
                      <span>{claim.itemCampus || claim.campus || 'Pretoria Campus'}</span>
                      <span>•</span>
                      <span>Submitted: {(claim.submittedAt || claim.created_at || '').split('T')[0] || 'Recently'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setSelectedClaim(claim)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> View Full Case
                  </button>
                </div>
              </div>

              {/* Step Tracker Timeline */}
              <div className="px-2">
                <ClaimTimeline
                  status={claim.status || 'Under Review'}
                  submittedAt={claim.submittedAt || claim.created_at}
                  reviewedAt={claim.reviewedAt}
                  handoverCompletedAt={claim.handoverCompletedAt}
                />
              </div>

              {/* Status Notices */}
              {claim.status === 'Approved' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Claim Approved for Physical Collection!</p>
                    <p className="text-emerald-800 leading-relaxed">
                      CPS has verified your ownership evidence. Please proceed to{' '}
                      <strong>{claim.handoverLocation || 'Pretoria Campus Security Office'}</strong>{' '}
                      with your physical TUT Student Card. Scheduled collection window:{' '}
                      <strong>{claim.handoverScheduledDate || '08:00 - 16:00 (Working Hours)'}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {claim.status === 'Under Review' && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#003366] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Review in Progress by CPS Security</p>
                    <p className="text-blue-800 leading-relaxed">
                      An officer ({claim.reviewedByOfficer || 'CPS Duty Officer'}) is inspecting the physical vault record and matching your submitted features.
                    </p>
                  </div>
                </div>
              )}

              {claim.status === 'Completed' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Property Handover Completed</p>
                    <p className="text-slate-600">
                      Item successfully released and signed for on {(claim.handoverCompletedAt || '').split('T')[0] || 'Record'}. Case closed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Case Details Modal */}
      <Modal
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        title={`Claim Dossier: ${selectedClaim?.claimNumber || selectedClaim?.referenceNumber || 'CLM-REC'}`}
        description={`Item: ${selectedClaim?.itemTitle || selectedClaim?.title || 'Property'} • Campus: ${selectedClaim?.itemCampus || selectedClaim?.campus || 'Pretoria'}`}
      >
        {selectedClaim && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-semibold">Current Claim Status</span>
              <Badge variant={selectedClaim.status || 'Under Review'} size="md">
                {selectedClaim.status || 'Under Review'}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#003366]">
                Claimant Evidence Submitted
              </span>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-slate-800 space-y-2">
                <p className="leading-relaxed">{selectedClaim.evidenceDescription || selectedClaim.proofDescription || 'No description provided.'}</p>
                {selectedClaim.serialNumberOrIMEI && (
                  <div className="font-mono text-[11px] bg-white p-2 rounded-lg border border-blue-200">
                    Serial / IMEI: {selectedClaim.serialNumberOrIMEI}
                  </div>
                )}
              </div>
            </div>

            {selectedClaim.reviewNotes && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  CPS Officer Notes
                </span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
                  {selectedClaim.reviewNotes}
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-100 text-slate-600 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Assigned Officer:</span>
                <span className="font-bold text-slate-800">
                  {selectedClaim.reviewedByOfficer || 'Pending Officer Assignment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Submitted At:</span>
                <span>{(selectedClaim.submittedAt || selectedClaim.created_at || '').split('T')[0] || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}