import React from 'react';

interface TutLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'color';
}

export const TutLogo: React.FC<TutLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'color',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* TUT Brand Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-[#003366] via-[#002244] to-[#001730] p-1.5 border border-white/20`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Institutional geometric shapes: TUT Blue, Red, Gold */}
          <path
            d="M50 8L88 28V72L50 92L12 72V28L50 8Z"
            stroke="#F5A623"
            strokeWidth="5"
            fill="none"
          />
          {/* Central Stylized "T" and Flame of Knowledge */}
          <path
            d="M32 34H68V44H56V76H44V44H32V34Z"
            fill="#FFFFFF"
          />
          {/* Red flame accent */}
          <path
            d="M50 20C54 25 58 29 55 33C52 36 48 36 45 33C42 29 46 25 50 20Z"
            fill="#CC0000"
          />
          {/* Gold ray */}
          <circle cx="50" cy="50" r="4" fill="#F5A623" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`tracking-tight ${titleSizes[size]} ${isDark ? 'text-white' : 'text-[#003366]'}`}>
            TUT
          </span>
          <span className={`font-semibold tracking-tight ${titleSizes[size]} ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
            Lost & Found
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#CC0000] ml-0.5"></span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1">
            <span className={`${subtitleSizes[size]} font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-slate-500'}`}>
              Tshwane University of Technology
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
