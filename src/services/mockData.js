export const INITIAL_USER = {
  id: '1',
  name: 'Charlene Reed',
  userName: 'charlene.reed',
  email: 'charlenereed@gmail.com',
  password: '••••••••',
  dob: '1995-01-25',
  presentAddress: 'Hitech City, Hyderabad, India',
  permanentAddress: 'Hitech City, Hyderabad, India',
  city: 'Hyderabad',
  postalCode: '500081',
  country: 'India',
  role: 'user', // 'user' or 'admin'
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
};

// Generates dates relative to today for realistic 7-day analytics
const now = new Date();
const daysAgo = (days, hours = 10, minutes = 30) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'txn-1',
    transaction_name: 'Spotify Subscription',
    type: 'debit',
    category: 'Entertainment',
    amount: 199.00,
    date: daysAgo(0, 18, 45),
    user_id: '1',
  },
  {
    id: 'txn-2',
    transaction_name: 'Monthly Salary Credit',
    type: 'credit',
    category: 'Salary',
    amount: 85000.00,
    date: daysAgo(1, 9, 0),
    user_id: '1',
  },
  {
    id: 'txn-3',
    transaction_name: 'Grocery & Supermarket',
    type: 'debit',
    category: 'Food & Dining',
    amount: 3450.00,
    date: daysAgo(1, 14, 20),
    user_id: '1',
  },
  {
    id: 'txn-4',
    transaction_name: 'Electricity & Utility Bill',
    type: 'debit',
    category: 'Bill Expense',
    amount: 1850.00,
    date: daysAgo(2, 11, 15),
    user_id: '1',
  },
  {
    id: 'txn-5',
    transaction_name: 'Freelance Design Project',
    type: 'credit',
    category: 'Investment',
    amount: 25000.00,
    date: daysAgo(2, 16, 30),
    user_id: '1',
  },
  {
    id: 'txn-6',
    transaction_name: 'Amazon Online Shopping',
    type: 'debit',
    category: 'Shopping',
    amount: 4999.00,
    date: daysAgo(3, 13, 10),
    user_id: '1',
  },
  {
    id: 'txn-7',
    transaction_name: 'Mutual Fund SIP Dividend',
    type: 'credit',
    category: 'Investment',
    amount: 4200.00,
    date: daysAgo(4, 10, 0),
    user_id: '1',
  },
  {
    id: 'txn-8',
    transaction_name: 'Team Dinner at Restaurant',
    type: 'debit',
    category: 'Food & Dining',
    amount: 2400.00,
    date: daysAgo(5, 20, 15),
    user_id: '1',
  },
  {
    id: 'txn-9',
    transaction_name: 'Cult Fit Gym Membership',
    type: 'debit',
    category: 'Others',
    amount: 1500.00,
    date: daysAgo(6, 8, 30),
    user_id: '1',
  },
  {
    id: 'txn-10',
    transaction_name: 'Tech Consulting Honorarium',
    type: 'credit',
    category: 'Salary',
    amount: 35000.00,
    date: daysAgo(6, 15, 0),
    user_id: '1',
  },
];
