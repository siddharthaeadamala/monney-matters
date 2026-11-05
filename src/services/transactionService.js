import api from './api';
import { ENDPOINTS } from './endpoints';
import { INITIAL_TRANSACTIONS, INITIAL_USER } from './mockData';

const STORAGE_KEY_TXNS = 'money_matters_transactions_v2';
const STORAGE_KEY_USER = 'money_matters_user_v2';

// Normalizes transaction objects to guarantee consistent types & fields
export function normalizeTransaction(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id || `txn-${Date.now()}`),
    transaction_name: String(
      raw.transaction_name || raw.name || raw.title || 'Untitled Transaction'
    ),
    type: String(raw.type || 'debit').toLowerCase().trim(),
    category: String(raw.category || 'Others'),
    amount: Math.abs(Number(raw.amount)) || 0,
    date: raw.date || raw.created_at || new Date().toISOString(),
    user_id: String(raw.user_id || '1'),
  };
}

function getLocalTransactions() {
  const data = localStorage.getItem(STORAGE_KEY_TXNS);
  if (!data) {
    const normalized = INITIAL_TRANSACTIONS.map(normalizeTransaction);
    localStorage.setItem(STORAGE_KEY_TXNS, JSON.stringify(normalized));
    return normalized;
  }
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(normalizeTransaction);
    }
    return INITIAL_TRANSACTIONS.map(normalizeTransaction);
  } catch {
    return INITIAL_TRANSACTIONS.map(normalizeTransaction);
  }
}

function setLocalTransactions(txns) {
  const normalized = txns.map(normalizeTransaction);
  localStorage.setItem(STORAGE_KEY_TXNS, JSON.stringify(normalized));
}

export function getLocalUser() {
  const data = localStorage.getItem(STORAGE_KEY_USER);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USER;
  }
}

export function setLocalUser(user) {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

export const transactionService = {
  async getAllTransactions({ limit = 100, offset = 0 } = {}) {
    try {
      const response = await api.get(ENDPOINTS.ALL_TRANSACTIONS, {
        params: { limit, offset },
      });

      const rawList =
        response.data?.transactions ||
        response.data?.get_transactions ||
        (Array.isArray(response.data) ? response.data : null);

      if (Array.isArray(rawList) && rawList.length > 0) {
        const normalized = rawList.map(normalizeTransaction);
        setLocalTransactions(normalized);
        return { data: normalized, isFallback: false };
      }

      return { data: getLocalTransactions(), isFallback: true };
    } catch (err) {
      console.warn('API connection unavailable, serving local persistent storage:', err.message);
      return { data: getLocalTransactions(), isFallback: true };
    }
  },

  async addTransaction(payload) {
    const newTxn = normalizeTransaction({
      id: `txn-${Date.now()}`,
      transaction_name: payload.name || payload.transaction_name,
      type: payload.type,
      category: payload.category,
      amount: payload.amount,
      date: payload.date ? new Date(payload.date).toISOString() : new Date().toISOString(),
      user_id: payload.user_id || '1',
    });

    let savedTxn = newTxn;

    try {
      const response = await api.post(ENDPOINTS.ADD_TRANSACTION, {
        name: newTxn.transaction_name,
        type: newTxn.type,
        category: newTxn.category,
        amount: newTxn.amount,
        date: newTxn.date,
        user_id: newTxn.user_id,
      });

      const serverObj =
        response.data?.transaction ||
        response.data?.insert_transactions_one ||
        (typeof response.data === 'object' && response.data?.id ? response.data : null);

      if (serverObj) {
        savedTxn = normalizeTransaction({ ...newTxn, ...serverObj });
      }
    } catch (err) {
      console.warn('Remote add failed, saving locally:', err.message);
    }

    const local = getLocalTransactions();
    setLocalTransactions([savedTxn, ...local]);
    return { data: savedTxn };
  },

  async updateTransaction(id, payload) {
    const updatedTxn = normalizeTransaction({
      id,
      transaction_name: payload.name || payload.transaction_name,
      type: payload.type,
      category: payload.category,
      amount: payload.amount,
      date: payload.date ? new Date(payload.date).toISOString() : new Date().toISOString(),
      user_id: payload.user_id || '1',
    });

    try {
      await api.post(ENDPOINTS.UPDATE_TRANSACTION, {
        id: updatedTxn.id,
        name: updatedTxn.transaction_name,
        type: updatedTxn.type,
        category: updatedTxn.category,
        amount: updatedTxn.amount,
        date: updatedTxn.date,
      });
    } catch (err) {
      console.warn('Remote update failed, updating locally:', err.message);
    }

    const local = getLocalTransactions();
    const index = local.findIndex((t) => String(t.id) === String(id));
    if (index !== -1) {
      local[index] = updatedTxn;
      setLocalTransactions([...local]);
    }

    return { data: updatedTxn };
  },

  async deleteTransaction(id) {
    try {
      await api.delete(ENDPOINTS.DELETE_TRANSACTION, {
        params: { id },
        data: { id },
      });
    } catch (err) {
      console.warn('Remote delete failed, deleting locally:', err.message);
    }

    const local = getLocalTransactions();
    const filtered = local.filter((t) => String(t.id) !== String(id));
    setLocalTransactions(filtered);
    return { success: true };
  },

  resetDemoData() {
    localStorage.removeItem(STORAGE_KEY_TXNS);
    localStorage.removeItem(STORAGE_KEY_USER);
    const txns = getLocalTransactions();
    const usr = getLocalUser();
    return { transactions: txns, user: usr };
  },
};
