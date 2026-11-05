import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, CheckCheck, XCircle } from 'lucide-react';
import { ClaimStatus } from '@/types';

interface ClaimTimelineProps {
  status: ClaimStatus;
  submittedAt: string;
  reviewedAt?: string;
  handoverCompletedAt?: string;
}

export const ClaimTimeline: React.FC<ClaimTimelineProps> = ({
  status,
  submittedAt,
  reviewedAt,
  handoverCompletedAt,
}) => {
  const isRejected = status === 'Rejected';

  const steps = [
    {
      title: 'Claim Submitted',
      description: 'Ownership evidence registered with CPS',
      date: submittedAt.split('T')[0],
      icon: Clock,
      completed: true,
      active: status === 'Pending',
    },
    {
      title: 'CPS Review',
      description: 'Officer cross-referencing serials & markings',
      date: reviewedAt ? reviewedAt.split('T')[0] : 'In Progress',
      icon: ShieldCheck,
      completed: ['Under Review', 'Approved', 'Completed'].includes(status),
      active: status === 'Under Review',
    },
    {
      title: isRejected ? 'Verification Failed' : 'Claim Approved',
      description: isRejected
        ? 'Insufficient ownership proof'
        : 'Collection authorized with Student Card',
      date: isRejected ? 'Declined' : (reviewedAt ? reviewedAt.split('T')[0] : 'Pending'),
      icon: isRejected ? XCircle : CheckCircle2,
      completed: ['Approved', 'Completed'].includes(status) || isRejected,
      active: status === 'Approved',
      error: isRejected,
    },
    {
      title: 'Physical Handover',
      description: 'Item collected at Campus Security Station',
      date: handoverCompletedAt ? handoverCompletedAt.split('T')[0] : 'Pending',
      icon: CheckCheck,
      completed: status === 'Completed',
      active: status === 'Completed',
    },
  ];

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex flex-col items-start relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div
                  className={`hidden md:block absolute top-5 left-10 right-0 h-0.5 z-0 ${
                    steps[index + 1].completed
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              )}

              <div className="flex items-center gap-3 md:flex-col md:items-start z-10 w-full">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                    step.error
                      ? 'bg-red-100 text-red-600 ring-4 ring-red-50'
                      : step.completed
                      ? 'bg-emerald-600 text-white'
                      : step.active
                      ? 'bg-[#003366] text-white ring-4 ring-blue-100'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Details */}
                <div className="mt-0 md:mt-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        step.error
                          ? 'text-red-700'
                          : step.completed || step.active
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {step.description}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-mono text-slate-400">
                    {step.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
