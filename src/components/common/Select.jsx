import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  id,
  options = [],
  error,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-dark-heading"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none bg-white text-dark-heading text-sm rounded-xl border border-surface-border px-3.5 py-2.5 pr-10 transition-all duration-150 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-slate-50 cursor-pointer ${
            error ? 'border-debit focus:border-debit' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-dark-body">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <span className="text-xs text-debit font-medium mt-0.5">{error}</span>}
    </div>
  );
}
