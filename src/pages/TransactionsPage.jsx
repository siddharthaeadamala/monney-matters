import React from 'react';
import TransactionTable from '../components/transactions/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <TransactionTable />
      </div>
    </div>
  );
}
