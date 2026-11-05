import React from 'react';
import { ItemStatus, ClaimStatus, LostReportStatus } from '@/types';

type BadgeVariant =
  | ItemStatus
  | ClaimStatus
  | LostReportStatus
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'campus';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  size = 'md',
}) => {
  const getVariantStyles = (v: BadgeVariant) => {
    switch (v) {
      // Item Statuses
      case 'in_cps_custody':
        return 'bg-blue-50 text-tut-blue border border-blue-200 font-medium';
      case 'claim_pending':
        return 'bg-amber-50 text-amber-800 border border-amber-200 font-medium';
      case 'claimed_resolved':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium';
      case 'disposed':
        return 'bg-slate-100 text-slate-700 border border-slate-200';

      // Claim Statuses
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold';
      case 'Under Review':
        return 'bg-blue-50 text-tut-blue border border-blue-300 font-semibold';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold';
      case 'Rejected':
        return 'bg-red-50 text-red-800 border border-red-300 font-semibold';
      case 'Completed':
        return 'bg-slate-100 text-slate-800 border border-slate-300 font-semibold';

      // Lost Report Statuses
      case 'Active':
        return 'bg-purple-50 text-purple-800 border border-purple-200 font-semibold';
      case 'Potential Match':
        return 'bg-amber-100 text-amber-900 border border-amber-400 font-semibold animate-pulse';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold';

      // Generic
      case 'campus':
        return 'bg-slate-100 text-slate-700 border border-slate-200 font-medium';
      case 'primary':
        return 'bg-tut-blue text-white font-medium';
      case 'success':
        return 'bg-emerald-600 text-white font-medium';
      case 'danger':
        return 'bg-tut-red text-white font-medium';
      case 'warning':
        return 'bg-tut-gold text-slate-900 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-wide transition-colors ${sizeStyles} ${getVariantStyles(
        variant
      )} ${className}`}
    >
      {children}
    </span>
  );
};
