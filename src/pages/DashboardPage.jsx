import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import SummaryCard from '../components/dashboard/SummaryCard';
import WeeklyActivityChart from '../components/dashboard/WeeklyActivityChart';
import ExpenseStatsChart from '../components/dashboard/ExpenseStatsChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { CardSkeleton } from '../components/common/Skeleton';
import Button from '../components/common/Button';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { totals, isLoading, error, fetchTransactions } = useTransactions();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Error / Retry Banner if network failed */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between text-rose-900">
          <div className="flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchTransactions}
            icon={RefreshCw}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard
              type="balance"
              title="Total Balance"
              amount={totals.totalBalance}
            />
            <SummaryCard
              type="credit"
              title="Total Credit"
              amount={totals.totalCredit}
            />
            <SummaryCard
              type="debit"
              title="Total Debit"
              amount={totals.totalDebit}
            />
          </>
        )}
      </div>

      {/* Analytics & Charts Section (2-Column Grid on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyActivityChart />
        </div>
        <div className="lg:col-span-1">
          <ExpenseStatsChart />
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div>
        <RecentTransactions />
      </div>
    </div>
  );
}
