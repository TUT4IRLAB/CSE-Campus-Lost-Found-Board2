'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  PlusCircle,
  FileText,
  Shield,
  User,
  LayoutDashboard,
  ShieldAlert,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { TutLogo } from '@/components/ui/TutLogo';
import { NotificationDropdown } from './NotificationDropdown';
import { useLostFound } from '@/context/LostFoundContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentUser, switchUserRole } = useLostFound();

  const isCPS = currentUser.role === 'cps_officer';

  const navLinks = [
    { href: '/items', label: 'Browse Found Items', icon: Search },
    { href: '/report-lost', label: 'Report Lost Item', icon: PlusCircle },
    { href: '/report-found', label: 'Found Something?', icon: HelpCircle },
    { href: '/dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { href: '/my-claims', label: 'My Claims', icon: Shield },
    { href: '/my-reports', label: 'My Reports', icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Top University Brand Bar */}
      <div className="bg-[#003366] text-white text-[11px] py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">TSHWANE UNIVERSITY OF TECHNOLOGY</span>
            <span className="hidden sm:inline text-blue-200">•</span>
            <span className="hidden sm:inline text-blue-100">Campus Protection Services (CPS) Lost & Found Directory</span>
          </div>
          {/* Quick Demo Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-blue-200 hidden md:inline">Demo Persona:</span>
            <button
              onClick={() => switchUserRole(isCPS ? 'student' : 'cps_officer')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer ${
                isCPS
                  ? 'bg-[#CC0000] text-white hover:bg-red-700'
                  : 'bg-[#F5A623] text-slate-900 hover:bg-amber-400'
              }`}
              title="Click to toggle between Student and CPS Officer persona"
            >
              {isCPS ? (
                <>
                  <ShieldAlert className="w-3 h-3" />
                  Mode: CPS Officer
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  Mode: Student
                </>
              )}
              <span className="text-[9px] underline ml-1">switch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="hover:opacity-95 transition-opacity">
            <TutLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    active
                      ? 'bg-blue-50 text-[#003366]'
                      : 'text-slate-600 hover:text-[#003366] hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: CPS button, Notifications, Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* CPS Dashboard Direct Link */}
            <Link
              href="/cps"
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-[#F5A623]" />
              CPS Portal
            </Link>

            {/* Notifications */}
            <NotificationDropdown />

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {currentUser.role === 'cps_officer' ? 'CPS Security' : currentUser.campus.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#003366]">
                      {currentUser.role === 'cps_officer' ? 'Campus Protection Officer' : `ID: ${currentUser.studentNumber}`}
                    </span>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Student Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    Student Dashboard
                  </Link>
                  <Link
                    href="/cps"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Shield className="w-4 h-4 text-[#F5A623]" />
                    CPS Security Management
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <Link
                    href="/auth/login"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign Out / Switch Account
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <NotificationDropdown />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400">{currentUser.campus}</p>
              </div>
            </div>
            <button
              onClick={() => switchUserRole(isCPS ? 'student' : 'cps_officer')}
              className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800"
            >
              Switch: {isCPS ? 'CPS' : 'Student'}
            </button>
          </div>

          <div className="pt-2 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active
                      ? 'bg-blue-50 text-[#003366] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/cps"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold bg-slate-900 text-white mt-2"
            >
              <Shield className="w-4 h-4 text-[#F5A623]" />
              CPS Security Management
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700"
            >
              <User className="w-4 h-4 text-slate-400" />
              Student Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
