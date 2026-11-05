import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TableRowSkeleton } from '../common/Skeleton';

export default function RecentTransactions() {
  const {
    transactions,
    isLoading,
    setEditingTransaction,
    setDeletingTransaction,
  } = useTransactions();

  const recentList = transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-dark-heading">
          Recent Transactions
        </h2>
        <Link
          to="/transactions"
          className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
        >
          See All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-1">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      ) : recentList.length === 0 ? (
        <div className="py-12 text-center text-dark-body text-sm">
          No recent transactions found. Click "+ Add Transaction" to start!
        </div>
      ) : (
        <div className="divide-y divide-surface-border/60">
          {recentList.map((txn) => {
            const isCredit = txn.type === 'credit';
            return (
              <div
                key={txn.id}
                data-testid="transaction-item"
                className="py-3.5 flex items-center justify-between group hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCredit
                        ? 'bg-credit-light text-credit-dark'
                        : 'bg-debit-light text-debit-dark'
                    }`}
                  >
                    {isCredit ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark-heading truncate">
                      {txn.transaction_name}
                    </p>
                    <p className="text-xs text-dark-body">
                      {formatDate(txn.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold whitespace-nowrap ${
                      isCredit ? 'text-credit-dark' : 'text-debit-dark'
                    }`}
                  >
                    {isCredit ? '+' : '-'}
                    {formatCurrency(txn.amount)}
                  </span>

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTransaction(txn)}
                      title="Edit"
                      data-testid="edit-btn"
                      className="p-1.5 rounded-lg text-dark-body hover:text-primary hover:bg-primary-light/50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingTransaction(txn)}
                      title="Delete"
                      data-testid="delete"
                      className="p-1.5 rounded-lg text-dark-body hover:text-debit hover:bg-debit-light/50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
