import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useTransactions } from '../../context/TransactionContext';
import { useToast } from '../common/Toast';
import { formatCurrency } from '../../utils/formatters';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal() {
  const { deletingTransaction, setDeletingTransaction, deleteTransaction } =
    useTransactions();
  const { addToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOpen = Boolean(deletingTransaction);

  const handleClose = () => {
    setDeletingTransaction(null);
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      const res = await deleteTransaction(deletingTransaction.id);
      if (res.success) {
        addToast({ message: 'Transaction deleted successfully', type: 'success' });
        setDeletingTransaction(null);
      } else {
        addToast({ message: res.error || 'Failed to delete transaction', type: 'error' });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Transaction"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Are you sure you want to delete this?</p>
            <p className="text-xs text-rose-700 mt-1">
              This action cannot be undone. The transaction record will be permanently removed.
            </p>
          </div>
        </div>

        {deletingTransaction && (
          <div className="p-3 bg-slate-50 rounded-xl border border-surface-border flex items-center justify-between text-sm">
            <span className="font-semibold text-dark-heading">
              {deletingTransaction.transaction_name}
            </span>
            <span
              className={`font-bold ${
                deletingTransaction.type === 'credit'
                  ? 'text-credit-dark'
                  : 'text-debit-dark'
              }`}
            >
              {deletingTransaction.type === 'credit' ? '+' : '-'}
              {formatCurrency(deletingTransaction.amount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            data-testid="confirm-delete-btn"
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
