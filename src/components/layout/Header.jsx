import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, Plus, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import Button from '../common/Button';

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setIsAddModalOpen, searchQuery, setSearchQuery } = useTransactions();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
      case '/':
        return 'Overview';
      case '/transactions':
        return 'Transactions';
      case '/profile':
        return 'Setting';
      default:
        return 'Money Matters';
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && location.pathname !== '/transactions') {
      navigate('/transactions');
    }
  };

  return (
    <header className="h-20 bg-white border-b border-surface-border px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open Navigation Menu"
          className="lg:hidden p-2 rounded-xl text-dark-heading hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-dark-heading tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-body">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search for something"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-surface-bg text-xs text-dark-heading rounded-full pl-10 pr-4 py-2.5 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-dark-muted"
          />
        </div>

        {/* Global Action: + Add Transaction */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          size="sm"
          className="hidden sm:inline-flex bg-primary hover:bg-primary-hover shadow-sm"
          icon={Plus}
          data-testid="add-transaction-btn"
        >
          Add Transaction
        </Button>

        {/* Mobile icon button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="sm:hidden p-2 rounded-xl bg-primary text-white shadow-sm hover:bg-primary-hover transition-colors"
          title="Add Transaction"
          data-testid="add-transaction-btn-mobile"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Notification Icon */}
        <button
          className="hidden sm:flex w-10 h-10 rounded-full bg-surface-bg items-center justify-center text-dark-body hover:text-dark-heading hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile Avatar */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 border-l border-surface-border sm:border-none sm:pl-0"
          title="View Profile Settings"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary transition-all cursor-pointer"
          />
        </Link>
      </div>
    </header>
  );
}
