import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SummaryCard({ title, amount, type = 'balance' }) {
  const configs = {
    credit: {
      label: title || 'Total Credit',
      icon: ArrowUpRight,
      iconBg: 'bg-credit-light text-credit-dark',
      badgeColor: 'text-credit-dark bg-credit-light',
      testId: 'incomeAmount',
      altTestId: 'credit-amount',
    },
    debit: {
      label: title || 'Total Debit',
      icon: ArrowDownLeft,
      iconBg: 'bg-debit-light text-debit-dark',
      badgeColor: 'text-debit-dark bg-debit-light',
      testId: 'expensesAmount',
      altTestId: 'debit-amount',
    },
    balance: {
      label: title || 'Total Balance',
      icon: Wallet,
      iconBg: 'bg-primary-light text-primary',
      badgeColor: 'text-primary bg-primary-light',
      testId: 'balanceAmount',
      altTestId: 'balance-amount',
    },
  };

  const current = configs[type] || configs.balance;
  const Icon = current.icon;

  return (
    <div
      className="bg-white rounded-3xl p-6 border border-surface-border shadow-card hover:shadow-cardHover transition-all duration-200 flex items-center gap-4"
      data-testid={current.altTestId}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${current.iconBg}`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-dark-body truncate">
          {current.label}
        </p>
        <h3
          className="text-xl sm:text-2xl font-bold text-dark-heading tracking-tight mt-1 truncate"
          data-testid={current.testId}
        >
          {type === 'debit' && Number(amount) > 0 ? '-' : ''}
          {formatCurrency(amount)}
        </h3>
      </div>
    </div>
  );
}
