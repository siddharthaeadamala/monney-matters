import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { transactionService } from '../services/transactionService';

export const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modal control states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  // Fetch transactions on mount
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Aggregate metrics (in INR)
  const totals = useMemo(() => {
    let credit = 0;
    let debit = 0;

    for (const txn of transactions) {
      const amt = Number(txn.amount) || 0;
      const type = String(txn.type).toLowerCase();
      if (type === 'credit') {
        credit += amt;
      } else if (type === 'debit') {
        debit += amt;
      }
    }

    return {
      totalCredit: credit,
      totalDebit: debit,
      totalBalance: credit - debit,
    };
  }, [transactions]);

  // Sorted transactions (newest first)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const timeA = new Date(a.date || 0).getTime();
      const timeB = new Date(b.date || 0).getTime();
      return timeB - timeA;
    });
  }, [transactions]);

  // Weekly Activity Chart Data (Sat, Sun, Mon, Tue, Wed, Thu, Fri)
  const weeklyActivityData = useMemo(() => {
    const daysOrder = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const dayMap = {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
    };

    const data = daysOrder.map((day) => ({
      day,
      deposit: 0,
      withdraw: 0,
    }));

    for (const txn of transactions) {
      const d = new Date(txn.date);
      if (isNaN(d.getTime())) continue;
      const dayName = dayMap[d.getDay()];
      const item = data.find((x) => x.day === dayName);
      if (item) {
        const amt = Number(txn.amount) || 0;
        const type = String(txn.type).toLowerCase();
        if (type === 'credit') {
          item.deposit += amt;
        } else if (type === 'debit') {
          item.withdraw += amt;
        }
      }
    }

    return data;
  }, [transactions]);

  // Expense Category Distribution (Donut / Pie Chart)
  const expenseStatisticsData = useMemo(() => {
    const categoryTotals = {};
    let totalDebitSum = 0;

    for (const txn of transactions) {
      const type = String(txn.type).toLowerCase();
      if (type === 'debit') {
        const cat = txn.category || 'Others';
        const amt = Number(txn.amount) || 0;
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
        totalDebitSum += amt;
      }
    }

    if (totalDebitSum === 0) {
      return [
        { name: 'Entertainment', value: 30, percentage: 30, color: '#343C6A' },
        { name: 'Bill Expense', value: 15, percentage: 15, color: '#FF82AC' },
        { name: 'Investment', value: 20, percentage: 20, color: '#1814F3' },
        { name: 'Others', value: 35, percentage: 35, color: '#FC7900' },
      ];
    }

    const categoryColorMap = {
      'Entertainment': '#343C6A',
      'Bill Expense': '#FF82AC',
      'Investment': '#1814F3',
      'Shopping': '#FFBB38',
      'Food & Dining': '#396AFF',
      'Salary': '#16DBAA',
      'Others': '#FC7900',
    };

    const fallbackColors = ['#343C6A', '#FC7900', '#1814F3', '#FF82AC', '#16DBAA', '#718EBF'];

    return Object.entries(categoryTotals).map(([name, val], idx) => {
      const percentage = Math.round((val / totalDebitSum) * 100);
      return {
        name,
        value: val,
        percentage,
        color: categoryColorMap[name] || fallbackColors[idx % fallbackColors.length],
      };
    });
  }, [transactions]);

  // CRUD actions
  const addTransaction = async (formData) => {
    try {
      const { data } = await transactionService.addTransaction(formData);
      setTransactions((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTransaction = async (id, formData) => {
    try {
      const { data } = await transactionService.updateTransaction(id, formData);
      setTransactions((prev) =>
        prev.map((t) => (String(t.id) === String(id) ? { ...t, ...data } : t))
      );
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => String(t.id) !== String(id)));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    transactions: sortedTransactions,
    rawTransactions: transactions,
    isLoading,
    error,
    totals,
    weeklyActivityData,
    expenseStatisticsData,
    searchQuery,
    setSearchQuery,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isAddModalOpen,
    setIsAddModalOpen,
    editingTransaction,
    setEditingTransaction,
    deletingTransaction,
    setDeletingTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
