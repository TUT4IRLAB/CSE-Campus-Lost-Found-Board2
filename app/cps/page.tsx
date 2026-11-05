'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  Lock,
  PlusCircle,
  ArrowRight,
  MapPin,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { Badge } from '@/components/ui/Badge';
import { CategoryIcon } from '@/components/items/CategoryIcon';

export default function CpsOverviewPage() {
  const { items, claims } = useLostFound();

  // Metrics
  const totalFound = items.length;
  const inVaultCustody = items.filter((i) => i.status === 'in_cps_custody').length;
  const pendingClaims = claims.filter((c) => c.status === 'Pending').length;
  const underReviewClaims = claims.filter((c) => c.status === 'Under Review').length;
  const approvedClaims = claims.filter((c) => c.status === 'Approved').length;
  const resolvedCases = claims.filter((c) => c.status === 'Completed').length;

  const urgentClaimsQueue = claims.filter(
    (c) => c.status === 'Pending' || c.status === 'Under Review'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CC0000]">
            CPS Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Custody Vault & Claims Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time custody ledger, evidence cross-examination queue, and authorized handover verification.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/cps/items"
            className="px-4 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-[#F5A623]" />
            Log Intake Item
          </Link>
          <Link
            href="/cps/claims"
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Review Queue ({pendingClaims + underReviewClaims})
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Found Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Found Items
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-[#003366]">{totalFound}</div>
          <div className="mt-1 text-xs text-slate-500">
            {inVaultCustody} currently in physical vaults
          </div>
        </div>

        {/* KPI 2: Pending Claims */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Claims
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-amber-700">{pendingClaims}</div>
          <div className="mt-1 text-xs text-slate-500">
            Awaiting officer assignment
          </div>
        </div>

        {/* KPI 3: Claims Under Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Under Active Review
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-blue-700">{underReviewClaims}</div>
          <div className="mt-1 text-xs text-slate-500">
            Evidence being cross-checked
          </div>
        </div>

        {/* KPI 4: Resolved Handover Cases */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Resolved Cases
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-700">{resolvedCases}</div>
          <div className="mt-1 text-xs text-slate-500">
            {approvedClaims} approved awaiting collection
          </div>
        </div>
      </div>

      {/* Main Operations Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Urgent Claims Needing Action */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Claims Verification Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Student ownership claims requiring verification against item custody records
                </p>
              </div>
              <Link
                href="/cps/claims"
                className="text-xs font-bold text-[#003366] hover:underline flex items-center gap-1"
              >
                Open Full Queue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {urgentClaimsQueue.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No pending claims in the queue right now. All caught up!
                </div>
              ) : (
                urgentClaimsQueue.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        <CategoryIcon category={claim.itemCategory} className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-600">
                            {claim.claimNumber}
                          </span>
                          <Badge variant={claim.status} size="sm">
                            {claim.status}
                          </Badge>
                          <span className="text-[10px] text-slate-400">
                            • {claim.itemCampus}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {claim.itemTitle}
                        </h4>
                        <div className="text-xs text-slate-600 flex items-center gap-2">
                          <span>Claimant: <strong>{claim.claimantName}</strong> ({claim.claimantStudentId})</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/cps/claims?review=${claim.id}`}
                      className="px-3.5 py-2 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] transition-colors self-end sm:self-center shrink-0 shadow-2xs"
                    >
                      Examine Evidence & Decide
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">CPS Disciplinary Protocol</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Ensure serial numbers and distinctive characteristics match exactly before authorizing an item for handover. Upon collection, the claimant MUST present a valid physical TUT Student Card.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Custody Vault Intakes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Recent Vault Intakes
            </h3>
            <Link
              href="/cps/items"
              className="text-xs font-bold text-[#003366] hover:underline"
            >
              Vault Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500 font-bold">
                    {item.referenceNumber}
                  </span>
                  <Badge variant={item.status} size="sm">
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {item.title}
                </h4>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#CC0000]" />
                    <span>{item.campus}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{item.storageLocation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
