'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';
import { TUT_CAMPUSES } from '@/data/mockData';
import { CampusName } from '@/types';
import { Button } from '@/components/ui/Button';
import { fetchClaims } from '@/services/api';

export default function StudentProfilePage() {
  const { currentUser, setCurrentUser } = useLostFound();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    studentNumber: currentUser?.studentNumber || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    campus: currentUser?.campus || 'Pretoria Campus',
    faculty: currentUser?.faculty || 'Faculty of Information and Communication Technology',
  });

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [myClaimsCount, setMyClaimsCount] = useState(0);
  const [myReportsCount, setMyReportsCount] = useState(0);

  // Fetch student claims and reports counts from backend
  useEffect(() => {
    const studentId = currentUser?.id || currentUser?.studentNumber;
    if (!studentId) return;

    fetchClaims(studentId)
      .then((data) => setMyClaimsCount(data.length))
      .catch((err) => console.error('Failed to load claims count:', err));

    fetch(`http://localhost:5000/api/reports?studentId=${studentId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setMyReportsCount(data.length))
      .catch((err) => console.error('Failed to load reports count:', err));
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/students/${currentUser?.id || formData.studentNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update student profile on server.');
      }

      setCurrentUser({
        ...currentUser,
        name: formData.name,
        studentNumber: formData.studentNumber,
        email: formData.email,
        phone: formData.phone,
        campus: formData.campus as CampusName,
        faculty: formData.faculty,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setErrorMessage(err.message || 'Failed to save changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#003366]">
          Account & Campus Preferences (Neon DB)
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your verified contact details for ownership match alerts and collection verification.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-2xl mx-auto ring-4 ring-blue-100 shadow-md">
              {(formData.name || 'Student')
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{formData.name}</h3>
              <p className="text-xs text-slate-500 font-mono">
                ID: {formData.studentNumber}
              </p>
              <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-blue-50 text-[#003366] text-[11px] font-bold">
                {formData.campus}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  My Claims
                </span>
                <span className="font-black text-[#003366] text-base">{myClaimsCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  My Reports
                </span>
                <span className="font-black text-purple-700 text-base">{myReportsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Details Form */}
        <div className="md:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366] border-b border-slate-100 pb-2">
                Personal Identification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    TUT Student Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Campus
                  </label>
                  <select
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value as CampusName })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white cursor-pointer"
                  >
                    {TUT_CAMPUSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>
            </div>

            {/* Notification settings */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366]">
                Automated Notification Alerts
              </h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded text-[#003366] focus:ring-[#003366]"
                  />
                  <span>Send instant email notifications when an item matches my lost report</span>
                </label>
                <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="rounded text-[#003366] focus:ring-[#003366]"
                  />
                  <span>Send SMS dispatch update when CPS approves my ownership claim</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
                </span>
              ) : (
                <span />
              )}
              <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
                <Save className="w-4 h-4 mr-1.5" /> Save Profile Details
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}