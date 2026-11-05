'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  PlusCircle,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { Badge } from '@/components/ui/Badge';
import { ItemCard } from '@/components/items/ItemCard';

export default function StudentDashboardPage() {
  const { currentUser, items, claims, lostReports } = useLostFound();
  const [activeTab, setActiveTab] = useState<'claims' | 'reports'>('claims');

  // Filter student-specific records
  const myClaims = claims.filter((c) => c.claimantId === currentUser.id);
  const myReports = lostReports.filter((r) => r.studentId === currentUser.id);

  // Summary counts
  const recentFoundCount = items.slice(0, 10).length;
  const activeReportsCount = myReports.filter((r) => r.status === 'Active').length;
  const pendingClaimsCount = myClaims.filter((c) => c.status === 'Pending' || c.status === 'Under Review').length;
  const approvedClaimsCount = myClaims.filter((c) => c.status === 'Approved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#003366] via-[#002244] to-[#001730] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-blue-200">
            <span>Student Portal</span> • <span>{currentUser.campus}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
            Track your ownership claims, register newly lost personal belongings, or check recent items surrendered to Campus Protection Services.
          </p>
          <div className="pt-2 text-xs text-blue-200/80 font-mono">
            Student Number: {currentUser.studentNumber} • {currentUser.email}
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            href="/report-lost"
            className="px-4 py-2.5 rounded-xl bg-[#F5A623] text-slate-900 text-xs font-bold hover:bg-[#d48b11] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Report Lost Item
          </Link>
          <Link
            href="/items"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Browse Inventory
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Recently Found Items */}
        <Link
          href="/items"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all hover:border-blue-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recently Found
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-[#003366]">{recentFoundCount}</div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Items in CPS custody</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Active Lost Reports */}
        <Link
          href="/my-reports"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all hover:border-purple-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Reports
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-purple-700">{activeReportsCount}</div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Your registered reports</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Pending Claims */}
        <Link
          href="/my-claims"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all hover:border-amber-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Claims
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-amber-700">{pendingClaimsCount}</div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Under CPS evaluation</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 4: Approved Claims */}
        <Link
          href="/my-claims"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all hover:border-emerald-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Approved Claims
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-700">{approvedClaimsCount}</div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Ready for collection</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Main Content Area: Split between Recent Activity & Quick Found Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Active Claims & Reports Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Header Tabs */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('claims')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'claims'
                      ? 'bg-[#003366] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  My Claims ({myClaims.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reports')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'reports'
                      ? 'bg-[#003366] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  My Lost Reports ({myReports.length})
                </button>
              </div>

              <Link
                href={activeTab === 'claims' ? '/my-claims' : '/my-reports'}
                className="text-xs font-bold text-[#003366] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List */}
            <div className="p-4 sm:p-5">
              {activeTab === 'claims' ? (
                myClaims.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Shield className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500">
                      You haven&apos;t filed any ownership claims yet.
                    </p>
                    <Link
                      href="/items"
                      className="inline-block text-xs font-bold text-[#003366] underline"
                    >
                      Browse items in CPS custody
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-500">
                              {claim.claimNumber}
                            </span>
                            <Badge variant={claim.status} size="sm">
                              {claim.status}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {claim.itemTitle}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {claim.itemCampus}
                            </span>
                            <span>•</span>
                            <span>Filed: {claim.submittedAt.split('T')[0]}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:self-center">
                          <Link
                            href="/my-claims"
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#003366] bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"
                          >
                            Track <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : myReports.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    No active lost property reports on file.
                  </p>
                  <Link
                    href="/report-lost"
                    className="inline-block text-xs font-bold text-[#003366] underline"
                  >
                    File a report now
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-500">
                            {report.referenceNumber}
                          </span>
                          <Badge variant={report.status} size="sm">
                            {report.status}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {report.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{report.campus}</span>
                          <span>•</span>
                          <span>Lost on: {report.dateLost}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/my-reports"
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#003366] bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 p-5 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#003366] text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#003366]">
                CPS Campus Verification Standard
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                When collecting approved property at your campus security office, please bring your valid physical TUT Student Card and reference your Claim ID. Items are released upon signature verification.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recently Found Items on Your Campus */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Recently Logged on Campus
            </h3>
            <Link
              href="/items"
              className="text-xs font-bold text-[#003366] hover:underline"
            >
              Browse all
            </Link>
          </div>

          <div className="space-y-4">
            {items.slice(0, 3).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
