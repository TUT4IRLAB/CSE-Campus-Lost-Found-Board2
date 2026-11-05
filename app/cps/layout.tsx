'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Layers,
  FileCheck2,
  UserCheck,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useLostFound } from '@/context/LostFoundContext';

function CpsSubNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/cps', label: 'Operations Overview', icon: Layers },
    { href: '/cps/items', label: 'Found Items Vault', icon: Lock },
    { href: '/cps/claims', label: 'Claims Verification Queue', icon: FileCheck2 },
    { href: '/cps/handover', label: 'Handover & Release Station', icon: UserCheck },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-800/80 pt-2 pb-2">
      {navItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/cps' && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-colors ${
              active
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function CpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useLostFound();

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col">
      {/* Tactical CPS Sub-Header */}
      <div className="bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#CC0000] text-white flex items-center justify-center font-bold shadow-md ring-2 ring-red-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold tracking-wide uppercase">
                    Campus Protection Services (CPS)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5A623] text-slate-950 uppercase tracking-wider">
                    Staff Management
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Custody Vault Control & Ownership Verification Division • {currentUser.name}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold self-start sm:self-auto transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Student View
            </Link>
          </div>

          {/* CPS Sub-navigation Bar */}
          <React.Suspense fallback={<div className="h-8 py-2" />}>
            <CpsSubNav />
          </React.Suspense>
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
