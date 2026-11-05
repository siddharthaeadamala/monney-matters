import React, { createContext, useContext, useState } from 'react';
import { getLocalUser, setLocalUser } from '../services/transactionService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getLocalUser());

  const updateProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    setLocalUser(updated);
    return updated;
  };

  const toggleRole = () => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateProfile({ role: newRole });
  };

  const value = {
    user,
    updateProfile,
    toggleRole,
    isAdmin: user.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
