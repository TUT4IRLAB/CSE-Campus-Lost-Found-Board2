'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Calendar,
  MapPin,
  AlertCircle,
  Eye,
  Building,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { CategoryIcon } from '@/components/items/CategoryIcon';

export default function MyReportsPage() {
  const { currentUser } = useLostFound();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Fetch student lost property declarations from database endpoint
  useEffect(() => {
    let isMounted = true;
    const studentIdentifier = currentUser?.id || currentUser?.studentNumber || '1';

    fetch(`http://localhost:5000/api/reports?studentId=${studentIdentifier}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) setReports(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch user reports:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Safety timeout: stop showing loading spinner after 3 seconds no matter what
    const timer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#003366]">
            Student Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            My Registered Lost Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and manage your submitted lost property declarations across all campuses.
          </p>
        </div>

        <Link
          href="/report-lost"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#F5A623]" />
          File New Lost Report
        </Link>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No active lost property reports
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            If you have misplaced personal belongings anywhere on TUT grounds, register a report so Campus Protection Services can assist in recovery.
          </p>
          <div className="pt-2">
            <Link
              href="/report-lost"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244]"
            >
              <PlusCircle className="w-4 h-4" /> File a Report Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id || report.uuid}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <CategoryIcon category={report.category || 'Electronics'} className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {report.reference_number || report.referenceNumber || 'REP-01'}
                    </span>
                    <Badge variant={report.status || 'Active'} size="sm">
                      {report.status || 'Active'}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {report.title || report.itemName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {report.campus || 'Pretoria Campus'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {report.specific_location || report.specificLocation || report.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Date Lost: {(report.date_lost || report.dateLost || report.created_at || '').split('T')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Details Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title || selectedReport?.itemName}
        description={`Reference ID: ${selectedReport?.reference_number || selectedReport?.referenceNumber || 'REP-01'} • Logged on ${(selectedReport?.createdAt || selectedReport?.created_at || '').split('T')[0]}`}
      >
        {selectedReport && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-semibold">Report Status</span>
              <Badge variant={selectedReport.status || 'Active'} size="md">
                {selectedReport.status || 'Active'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Campus</span>
                <p className="font-bold text-slate-800">{selectedReport.campus || 'Pretoria Campus'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Category</span>
                <p className="font-bold text-slate-800">{selectedReport.category}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 col-span-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Location Lost</span>
                <p className="text-slate-700">{selectedReport.specific_location || selectedReport.specificLocation || selectedReport.location}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                General Description
              </span>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#003366]">
                Confidential Distinguishing Features
              </span>
              <p className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-slate-800 font-mono text-[11px] leading-relaxed">
                {selectedReport.distinctive_marks || selectedReport.distinctiveMarks || selectedReport.confidentialDetails || 'None recorded'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                CPS automatically checks new found item custody entries against your report features. If matched, you will receive an invitation to inspect and claim the item.
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}