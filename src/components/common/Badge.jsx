import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function Badge({ type, children, className = '' }) {
  if (type === 'credit') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-credit-light text-credit-dark ${className}`}
      >
        <ArrowUpRight className="w-3.5 h-3.5" />
        {children || 'Credit'}
      </span>
    );
  }

  if (type === 'debit') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-debit-light text-debit-dark ${className}`}
      >
        <ArrowDownLeft className="w-3.5 h-3.5" />
        {children || 'Debit'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-dark-body ${className}`}
    >
      {children}
    </span>
  );
}
