import React from 'react';
import Link from 'next/link';
import { Phone, Shield, MapPin, AlertTriangle, ExternalLink } from 'lucide-react';
import { TutLogo } from '@/components/ui/TutLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      {/* 24/7 CPS Emergency Dispatch Banner */}
      <div className="bg-[#CC0000] text-white py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 shrink-0 text-[#F5A623]" />
            <span className="font-bold text-sm tracking-wide">
              CAMPUS PROTECTION SERVICES (CPS) 24/7 HELPLINE
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <a href="tel:+27123825111" className="hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Pretoria Main: (012) 382 5111
            </a>
            <span className="hidden md:inline text-red-200">|</span>
            <a href="tel:+27123829000" className="hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Soshanguve: (012) 382 9000
            </a>
            <span className="hidden md:inline text-red-200">|</span>
            <a href="tel:+27123820500" className="hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Ga-Rankuwa: (012) 382 0500
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: TUT Lost & Found Info */}
          <div className="space-y-4">
            <TutLogo variant="dark" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed">
              Official campus lost-and-found management platform operated in coordination with
              Tshwane University of Technology Campus Protection Services (CPS).
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
              <span className="font-semibold text-[#F5A623] block mb-1">Notice:</span>
              Found items are kept securely in campus CPS custody vaults for 90 days before university policy resolution.
            </div>
          </div>

          {/* Col 2: Student Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 border-b border-slate-800 pb-2">
              Student Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/items" className="text-slate-400 hover:text-white transition-colors">
                  Search & Browse Found Items
                </Link>
              </li>
              <li>
                <Link href="/report-lost" className="text-slate-400 hover:text-white transition-colors">
                  Submit Lost Item Report
                </Link>
              </li>
              <li>
                <Link href="/report-found" className="text-slate-400 hover:text-white transition-colors">
                  Found an Item? Hand In to CPS
                </Link>
              </li>
              <li>
                <Link href="/my-claims" className="text-slate-400 hover:text-white transition-colors">
                  Track Ownership Claims
                </Link>
              </li>
              <li>
                <Link href="/my-reports" className="text-slate-400 hover:text-white transition-colors">
                  Manage My Reports
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: CPS Security Stations */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 border-b border-slate-800 pb-2">
              CPS Station Locations
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0 mt-0.5" />
                <span>Pretoria Main: Building 21, Ground Floor</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0 mt-0.5" />
                <span>Soshanguve South: Building 12, Main Gate</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0 mt-0.5" />
                <span>Ga-Rankuwa: Administration Block B</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0 mt-0.5" />
                <span>Arcadia Campus: Main Entrance Guard Post</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0 mt-0.5" />
                <span>eMalahleni & Polokwane: Campus Security HQ</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Demonstration & Verification Policy */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 border-b border-slate-800 pb-2">
              Verification Policy
            </h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <p>
                Claimants must present a valid physical <strong className="text-slate-200">TUT Student Card</strong> or South African National ID when collecting approved property.
              </p>
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  Frontend Demonstration System. All displayed cases and records are simulated mock data.
                </span>
              </div>
              <div className="pt-2">
                <Link
                  href="/cps"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F5A623] hover:underline"
                >
                  CPS Staff Login & Operations Portal <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026 Tshwane University of Technology. All Rights Reserved. Institutional Motto: <em>&ldquo;We empower people&rdquo;</em>.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">TUT Campus Lost & Found System • Frontend Only</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Academic Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
