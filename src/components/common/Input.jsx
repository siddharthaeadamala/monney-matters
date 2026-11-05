import React from 'react';

export default function Input({
  label,
  id,
  error,
  icon: Icon,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-dark-heading"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-body">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white text-dark-heading text-sm rounded-xl border border-surface-border px-3.5 py-2.5 transition-all duration-150 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-dark-muted disabled:bg-slate-50 disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-debit focus:border-debit focus:ring-debit/10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-debit font-medium mt-0.5">{error}</span>}
    </div>
  );
}
