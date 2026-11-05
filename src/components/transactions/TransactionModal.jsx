import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useTransactions } from '../../context/TransactionContext';
import { useToast } from '../common/Toast';
import { CATEGORIES } from '../../constants/categories';
import { toInputDateFormat } from '../../utils/formatters';

export default function TransactionModal() {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingTransaction,
    setEditingTransaction,
    addTransaction,
    updateTransaction,
  } = useTransactions();

  const { addToast } = useToast();

  const isOpen = isAddModalOpen || Boolean(editingTransaction);
  const isEditing = Boolean(editingTransaction);

  const [formData, setFormData] = useState({
    name: '',
    type: 'debit',
    category: 'Entertainment',
    amount: '',
    date: toInputDateFormat(),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        name: editingTransaction.transaction_name || '',
        type: editingTransaction.type || 'debit',
        category: editingTransaction.category || 'Entertainment',
        amount: editingTransaction.amount || '',
        date: toInputDateFormat(editingTransaction.date),
      });
    } else {
      setFormData({
        name: '',
        type: 'debit',
        category: 'Entertainment',
        amount: '',
        date: toInputDateFormat(),
      });
    }
    setErrors({});
  }, [editingTransaction, isAddModalOpen]);

  const handleClose = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Transaction name is required';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.date) {
      errs.date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await updateTransaction(editingTransaction.id, formData);
        if (res.success) {
          addToast({ message: 'Transaction updated successfully', type: 'success' });
          handleClose();
        } else {
          addToast({ message: res.error || 'Failed to update transaction', type: 'error' });
        }
      } else {
        const res = await addTransaction(formData);
        if (res.success) {
          addToast({ message: 'Transaction added successfully', type: 'success' });
          handleClose();
        } else {
          addToast({ message: res.error || 'Failed to add transaction', type: 'error' });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Name */}
        <Input
          label="Transaction Name"
          placeholder="e.g., Grocery Shopping, Salary"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        {/* Transaction Type Segmented Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-heading">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'credit' })}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                formData.type === 'credit'
                  ? 'bg-credit text-white shadow-sm'
                  : 'text-dark-body hover:text-dark-heading'
              }`}
            >
              + Credit (Income)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'debit' })}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                formData.type === 'debit'
                  ? 'bg-debit text-white shadow-sm'
                  : 'text-dark-body hover:text-dark-heading'
              }`}
            >
              - Debit (Expense)
            </button>
          </div>
        </div>

        {/* Category & Amount in 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
            required
          />
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          required
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
