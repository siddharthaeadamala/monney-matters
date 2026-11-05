export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://bursting-gelding-24.hasura.app/api/rest';

export const ENDPOINTS = {
  ALL_TRANSACTIONS: '/all-transactions',
  TRANSACTION_TOTALS: '/transaction-totals-admin',
  ADD_TRANSACTION: '/add-transaction',
  UPDATE_TRANSACTION: '/update-transaction',
  DELETE_TRANSACTION: '/delete-transaction',
  PROFILE: '/profile',
};
