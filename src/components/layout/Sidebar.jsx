import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  User,
  Wallet,
  ShieldCheck,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, toggleRole } = useAuth();
  const { addToast } = useToast();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleRoleToggle = () => {
    toggleRole();
    addToast({
      message: `Switched to ${!isAdmin ? 'Admin' : 'Regular User'} mode`,
      type: 'info',
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-surface-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-20 flex items-center gap-3 px-7 border-b border-surface-border/60">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-dark-heading">
                Money <span className="text-primary">Matters</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-dark-body font-semibold">
                Finance Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'text-primary bg-primary-light/60'
                        : 'text-dark-body hover:text-dark-heading hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-primary rounded-r-full" />
                      )}
                      <Icon
                        className={`w-5 h-5 transition-transform duration-150 group-hover:scale-105 ${
                          isActive ? 'text-primary' : 'text-dark-body'
                        }`}
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User / Role Card */}
        <div className="p-4 border-t border-surface-border">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-surface-border/80 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-dark-heading truncate">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                      <UserCheck className="w-3 h-3" /> User
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleRoleToggle}
              title={`Click to switch to ${isAdmin ? 'User' : 'Admin'} mode`}
              className="p-1.5 rounded-lg text-dark-body hover:text-primary hover:bg-white transition-colors"
            >
              <LogOut className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
