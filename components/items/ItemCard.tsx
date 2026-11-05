import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { FoundItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { CategoryIcon } from './CategoryIcon';

interface ItemCardProps {
  item: FoundItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Electronics':
        return 'from-blue-600/10 via-indigo-600/5 to-transparent text-blue-700';
      case 'Student Cards & IDs':
        return 'from-amber-600/10 via-orange-600/5 to-transparent text-amber-700';
      case 'Bags & Backpacks':
        return 'from-emerald-600/10 via-teal-600/5 to-transparent text-emerald-700';
      case 'Clothing & Accessories':
        return 'from-purple-600/10 via-violet-600/5 to-transparent text-purple-700';
      case 'Keys':
        return 'from-rose-600/10 via-red-600/5 to-transparent text-rose-700';
      default:
        return 'from-slate-600/10 via-gray-600/5 to-transparent text-slate-700';
    }
  };

  const getStatusText = (status: FoundItem['status']) => {
    switch (status) {
      case 'in_cps_custody':
        return 'In CPS Custody';
      case 'claim_pending':
        return 'Claim Pending';
      case 'claimed_resolved':
        return 'Claimed & Handed Over';
      case 'disposed':
        return 'Disposed / Archived';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Media / Illustrated Placeholder */}
      <div
        className={`relative h-44 w-full bg-gradient-to-br ${getCategoryGradient(
          item.category
        )} flex flex-col items-center justify-center p-6 border-b border-slate-100 group-hover:scale-[1.01] transition-transform`}
      >
        {/* Subtle patterned backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Category Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
          <CategoryIcon category={item.category} className="w-8 h-8" />
        </div>

        {/* Ref number tag & Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-mono font-medium text-slate-600 border border-slate-200">
            {item.referenceNumber}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <Badge variant={item.status} size="sm">
            {getStatusText(item.status)}
          </Badge>
        </div>

        {/* Category Pill at bottom */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-xs font-semibold text-slate-700 shadow-2xs border border-slate-100">
            <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
            {item.category}
          </span>
        </div>
      </div>

      {/* Item Information */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003366] transition-colors line-clamp-1">
          {item.title}
        </h3>

        {/* Campus & Location */}
        <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-[#003366] shrink-0" />
            <span>{item.campus}</span>
          </div>
          <div className="flex items-start gap-1.5 text-slate-500 line-clamp-1 pl-5">
            <span>{item.specificLocation}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 pl-5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 -ml-5" />
            <span>Found: {item.dateFound}</span>
          </div>
        </div>

        {/* Public Description */}
        <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
          {item.publicDescription}
        </p>

        {/* Bottom Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <Link
            href={`/items/${item.id}`}
            className="text-xs font-semibold text-[#003366] hover:text-[#002244] inline-flex items-center gap-1 transition-colors"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {item.status !== 'claimed_resolved' ? (
            <Link
              href={`/claim/${item.id}`}
              className="px-3 py-1.5 rounded-lg bg-[#003366] text-white hover:bg-[#002244] text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F5A623]" />
              Claim Item
            </Link>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Case Closed</span>
          )}
        </div>
      </div>
    </div>
  );
};
