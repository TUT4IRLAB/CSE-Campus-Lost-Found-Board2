'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Upload,
  File,
  X,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/items/CategoryIcon';
// 1. Import your real backend submission function
import { submitClaim as submitClaimApi } from '@/services/api';

function SecureClaimContent() {
  const params = useParams();
  const id = params?.id as string;
  const { getItemById, currentUser } = useLostFound();

  const item = getItemById(id);

  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [serialNumberOrIMEI, setSerialNumberOrIMEI] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'proof_of_ownership_sample.pdf',
  ]);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedClaimNumber, setSubmittedClaimNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Item Not Found</h2>
        <Link href="/items" className="text-xs font-bold text-[#003366] underline">
          Return to Browse Items
        </Link>
      </div>
    );
  }

  const isElectronics = item.category === 'Electronics';

  const handleSimulateAddFile = () => {
    const sampleFiles = [
      'apple_store_receipt.pdf',
      'device_box_photo.jpg',
      'student_id_affidavit.pdf',
    ];
    const nextFile = sampleFiles[uploadedFiles.length % sampleFiles.length];
    if (!uploadedFiles.includes(nextFile)) {
      setUploadedFiles([...uploadedFiles, nextFile]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // 2. Connect the submit handler to your live backend API
  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPolicy) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Send claim data to Express & Neon Postgres
      const response = await submitClaimApi({
        itemId: item.id,
        studentId: currentUser?.id || 'u-default',
        studentName: currentUser?.name || 'TUT Student',
        studentNumber: currentUser?.studentNumber || '21900000',
        proofDescription: `${evidenceDescription} ${isElectronics ? '[Serial/IMEI: ' + serialNumberOrIMEI + ']' : ''}`,
      });

      setIsLoading(false);
      setSubmittedClaimNumber(response.claim.uuid || 'CLAIM-SUCCESS');
    } catch (err: any) {
      console.error('Failed to submit claim:', err);
      setErrorMessage(err.message || 'Failed to submit claim. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href={`/items/${item.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#003366] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Cancel & Return to Item Details
      </Link>

      {/* Item Summary Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center shrink-0">
            <CategoryIcon category={item.category} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-slate-500">
                {item.referenceNumber}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                {item.category}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{item.title}</h2>
          </div>
        </div>

        <div className="text-xs text-slate-500 sm:text-right">
          <div className="font-semibold text-slate-800">{item.campus}</div>
          <div className="text-[11px]">Held in CPS Custody</div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center">
          {errorMessage}
        </div>
      )}

      {submittedClaimNumber ? (
        /* Success Confirmation Modal / Card */
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Claim Logged in Database
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Ownership Claim Successfully Submitted
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Your confidential ownership evidence has been recorded in Neon Postgres and forwarded to{' '}
              <strong>{item.campus} Campus Protection Services (CPS)</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Claimant:</span>
              <span className="font-bold text-slate-800">{currentUser?.name || 'Student'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student Number:</span>
              <span className="font-mono font-bold text-slate-800">{currentUser?.studentNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Initial Status:</span>
              <span className="font-bold text-amber-600">Pending Review</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] shadow-sm"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/items"
              className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
            >
              Browse More Items
            </Link>
          </div>
        </div>
      ) : (
        /* The Claim Form */
        <form onSubmit={handleSubmitClaim} className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-[#002244] text-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F5A623] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-sm text-white">Confidential Ownership Evidence Submission</h3>
              <p className="text-blue-100 leading-relaxed">
                Describe unique distinguishing characteristics only the true owner would know.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366] mb-3">
                1. Claimant Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Name</span>
                  <p className="font-bold text-slate-800">{currentUser?.name || 'Guest User'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Student ID</span>
                  <p className="font-mono font-bold text-slate-800">{currentUser?.studentNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Contact Email</span>
                  <p className="font-mono text-slate-700 truncate">{currentUser?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366]">
                2. Ownership Evidence & Distinctive Marks
              </h3>

              {isElectronics && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Serial Number, IMEI, or MAC Address (if known)
                  </label>
                  <input
                    type="text"
                    value={serialNumberOrIMEI}
                    onChange={(e) => setSerialNumberOrIMEI(e.target.value)}
                    placeholder="e.g. C02G8492J84K"
                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Distinctive Marks & Unique Physical Identifiers <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  placeholder="Describe scratches, stickers, custom background wallpaper..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <strong>TUT Disciplinary Code Section 14 Notice:</strong> Fraudulently claiming property constitutes theft.
                </p>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="mt-0.5 rounded text-[#003366] focus:ring-[#003366]"
                />
                <span>
                  I declare under penalty of perjury that I am the rightful owner of this item.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
              size="md"
            >
              Submit Official Ownership Claim
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs">Loading claim portal...</div>}>
      <SecureClaimContent />
    </Suspense>
  );
}