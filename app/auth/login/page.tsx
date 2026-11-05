'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, ShieldAlert } from 'lucide-react';
import { TutLogo } from '@/components/ui/TutLogo';
import { Button } from '@/components/ui/Button';
import { useLostFound } from '@/context/LostFoundContext';
// 1. Import your real backend login function
import { loginUser } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useLostFound();
  const [identifier, setIdentifier] = useState(''); // Email or Student Number
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [roleTab, setRoleTab] = useState<'student' | 'cps'>('student');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 2. Call your live Express backend
      const data = await loginUser({ identifier, password });
      
      // 3. Set real user in context and redirect
      setCurrentUser(data.user);
      if (data.user.role === 'cps' || data.user.role === 'cps_officer') {
        router.push('/cps');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <TutLogo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-[#003366]">Campus Single Sign-On</h2>
          <p className="text-xs text-slate-500">Sign in with your live Neon database profile</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center">
            {errorMessage}
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => setRoleTab('student')}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                roleTab === 'student' ? 'border-[#003366] text-[#003366]' : 'border-transparent text-slate-400'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('cps')}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                roleTab === 'cps' ? 'border-[#CC0000] text-[#CC0000]' : 'border-transparent text-slate-400'
              }`}
            >
              CPS Staff Portal
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {roleTab === 'student' ? 'Student Number or Email' : 'Staff Email or Badge'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={roleTab === 'student' ? 'e.g. 21900000' : 'cps.pretoria@tut.ac.za'}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant={roleTab === 'cps' ? 'danger' : 'primary'}
              isLoading={isLoading}
              className="w-full mt-2"
              size="md"
            >
              {roleTab === 'student' ? 'Sign In as Student' : 'Sign In as CPS Officer'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an active student profile?{' '}
              <Link href="/auth/register" className="font-bold text-[#003366] hover:underline">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}