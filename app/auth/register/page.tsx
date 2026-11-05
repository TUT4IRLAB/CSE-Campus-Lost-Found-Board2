'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TutLogo } from '@/components/ui/TutLogo';
import { Button } from '@/components/ui/Button';
import { TUT_CAMPUSES } from '@/data/mockData';
import { CampusName } from '@/types';
import { useLostFound } from '@/context/LostFoundContext';
// 1. Import your real backend registration function
import { registerUser } from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useLostFound();
  const [formData, setFormData] = useState({
    studentNumber: '',
    name: '',
    email: '',
    phone: '',
    campus: 'Pretoria Campus' as CampusName,
    faculty: 'Faculty of Information & Communication Technology',
    password: 'tut123password',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 2. Send real registration payload to Express/Neon DB
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        studentNumber: formData.studentNumber,
        campus: formData.campus,
        password: formData.password,
        role: 'student',
      });

      setIsSuccess(true);
      setCurrentUser(data.user);

      // 3. Redirect to dashboard after brief confirmation
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <TutLogo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-[#003366]">Student Registration</h2>
          <p className="text-xs text-slate-500">Create your permanent profile in the Neon database</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center">
            {errorMessage}
          </div>
        )}

        {isSuccess ? (
          <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Registration Successful!</h3>
            <p className="text-xs text-slate-500">Welcome, {formData.name}. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Number</label>
                  <input
                    type="text"
                    required
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                    placeholder="21900000"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Thabo Mokoena"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">TUT Student Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="21900000@tut4life.ac.za"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2" size="md">
                Create Student Profile
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}