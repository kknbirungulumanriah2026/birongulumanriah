'use client';

import React from 'react';

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: string;
  actions?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  eyebrow,
  title,
  description,
  icon,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-[#EDEDE9]">
      <div className="flex items-start gap-3.5 min-w-0">
        {icon && (
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </div>
        )}
        <div className="min-w-0">
          <span className="font-body text-[10px] sm:text-[11px] font-semibold text-emerald-700 tracking-[0.18em] uppercase block mb-1">
            {eyebrow}
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A] leading-tight">
            {title}
          </h1>
          {description && (
            <p className="font-body text-sm text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
};