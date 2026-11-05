export const TRANSACTION_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
};

export const CATEGORIES = [
  { id: 'entertainment', name: 'Entertainment', color: '#343C6A', bg: '#EDF0F7' },
  { id: 'bills', name: 'Bill Expense', color: '#16DBAA', bg: '#DCFAF8' },
  { id: 'investment', name: 'Investment', color: '#FE5C73', bg: '#FFE0EB' },
  { id: 'shopping', name: 'Shopping', color: '#FFBB38', bg: '#FFF5D9' },
  { id: 'food', name: 'Food & Dining', color: '#396AFF', bg: '#EBF1FF' },
  { id: 'salary', name: 'Salary', color: '#10B981', bg: '#D1FAE5' },
  { id: 'transfer', name: 'Transfer', color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'others', name: 'Others', color: '#718EBF', bg: '#F1F4F9' },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.name.toLowerCase()] = cat;
  acc[cat.id] = cat;
  return acc;
}, {});
