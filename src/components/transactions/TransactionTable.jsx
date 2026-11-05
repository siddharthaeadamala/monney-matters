import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Pencil,
  Trash2,
  Search,
  Plus,
  Inbox,
  ArrowUpDown,
} from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Pagination from './Pagination';
import { TableRowSkeleton } from '../common/Skeleton';

const PAGE_SIZE = 8;

export default function TransactionTable() {
  const {
    transactions,
    isLoading,
    searchQuery,
    setSearchQuery,
    setIsAddModalOpen,
    setEditingTransaction,
    setDeletingTransaction,
  } = useTransactions();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'debit' | 'credit'
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date'); // 'date' | 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Filtered and sorted list
  const processedTransactions = useMemo(() => {
    let list = transactions.filter((txn) => {
      // Tab filter
      if (activeTab === 'debit' && txn.type !== 'debit') return false;
      if (activeTab === 'credit' && txn.type !== 'credit') return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = txn.transaction_name?.toLowerCase().includes(query);
        const catMatch = txn.category?.toLowerCase().includes(query);
        return nameMatch || catMatch;
      }

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortField === 'amount') {
        const amtA = Number(a.amount) || 0;
        const amtB = Number(b.amount) || 0;
        return sortOrder === 'asc' ? amtA - amtB : amtB - amtA;
      }
      // default: date
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return list;
  }, [transactions, activeTab, searchQuery, sortField, sortOrder]);

  // Counts for tabs
  const counts = useMemo(() => {
    let debitCount = 0;
    let creditCount = 0;
    for (const t of transactions) {
      if (t.type === 'debit') debitCount++;
      if (t.type === 'credit') creditCount++;
    }
    return {
      all: transactions.length,
      debit: debitCount,
      credit: creditCount,
    };
  }, [transactions]);

  // Pagination slice
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return processedTransactions.slice(start, start + PAGE_SIZE);
  }, [processedTransactions, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-border shadow-card flex flex-col">
      {/* Top Filter Bar: Tabs & Search */}
      <div className="p-6 border-b border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b sm:border-b-0 pb-2 sm:pb-0 border-surface-border overflow-x-auto">
          {[
            { id: 'all', label: 'All Transactions', count: counts.all },
            { id: 'debit', label: 'Debit', count: counts.debit },
            { id: 'credit', label: 'Credit', count: counts.credit },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 pb-2 sm:pb-2.5 px-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-dark-body hover:text-dark-heading'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary-light text-primary'
                    : 'bg-slate-100 text-dark-body'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Add button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-body">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search transaction..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-surface-bg text-xs text-dark-heading rounded-xl pl-9 pr-3 py-2.5 border border-surface-border focus:outline-none focus:border-primary placeholder:text-dark-muted"
            />
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            icon={Plus}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-6 space-y-2">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      ) : paginatedList.length === 0 ? (
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-dark-body mb-3">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-dark-heading">
            No transactions found
          </h3>
          <p className="text-xs text-dark-body mt-1 max-w-sm">
            {searchQuery
              ? `No transactions matched your search query "${searchQuery}".`
              : `There are currently no ${activeTab === 'all' ? '' : activeTab} transactions recorded.`}
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="mt-4"
            icon={Plus}
          >
            Add Transaction
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/50 text-[11px] font-bold text-dark-body uppercase tracking-wider">
                <th className="py-3 px-6">Transaction Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-dark-heading select-none"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-dark-heading select-none"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/70 text-sm">
              {paginatedList.map((txn) => {
                const isCredit = txn.type === 'credit';
                return (
                  <tr
                    key={txn.id}
                    data-testid="transaction-row"
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCredit
                              ? 'bg-credit-light text-credit-dark'
                              : 'bg-debit-light text-debit-dark'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-semibold text-dark-heading">
                          {txn.transaction_name}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-dark-body font-medium">
                      {txn.category || 'Others'}
                    </td>

                    <td className="py-4 px-4">
                      <Badge type={txn.type} />
                    </td>

                    <td className="py-4 px-4 text-xs text-dark-body">
                      {formatDate(txn.date)}
                    </td>

                    <td
                      className={`py-4 px-4 text-right font-bold whitespace-nowrap ${
                        isCredit ? 'text-credit-dark' : 'text-debit-dark'
                      }`}
                    >
                      {isCredit ? '+' : '-'}
                      {formatCurrency(txn.amount)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setEditingTransaction(txn)}
                          title="Edit transaction"
                          data-testid="edit-btn"
                          className="p-1.5 rounded-lg text-dark-body hover:text-primary hover:bg-primary-light transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(txn)}
                          title="Delete transaction"
                          data-testid="delete"
                          className="p-1.5 rounded-lg text-dark-body hover:text-debit hover:bg-debit-light transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalItems={processedTransactions.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
