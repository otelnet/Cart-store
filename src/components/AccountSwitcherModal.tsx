import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Users,
  UserCheck,
  Plus,
  Shield,
  ShoppingBag,
  ArrowRight,
  X,
  Sparkles,
  LogOut,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

export const AccountSwitcherModal: React.FC = () => {
  const {
    user,
    savedAccounts,
    switchAccount,
    removeSavedAccount,
    isAccountSwitcherOpen,
    setIsAccountSwitcherOpen,
    setIsAuthModalOpen,
    logout,
    showToast,
  } = useShop();

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('customer');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isAccountSwitcherOpen) return null;

  const handleCreateAndSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    const formattedName = newName.trim() || newEmail.split('@')[0];
    switchAccount({
      email: newEmail,
      name: formattedName,
      role: newRole,
    });
    setNewEmail('');
    setNewName('');
    setShowAddForm(false);
    setIsAccountSwitcherOpen(false);
  };

  const predefinedAccounts = [
    {
      email: 'otelnetclient@gmail.com',
      name: 'Admin (otelnetclient)',
      role: 'admin' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      badge: 'Current Admin',
    },
    {
      email: 'alex.morgan@cartnovastore.com',
      name: 'Alex Morgan',
      role: 'customer' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      badge: 'Global Customer',
    },
    {
      email: 'chinedu.eze@cartnovastore.com',
      name: 'Chinedu Eze',
      role: 'customer' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      badge: 'Nigeria VIP Customer',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white relative">
            <button
              onClick={() => setIsAccountSwitcherOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-black font-display text-white">Switch User Account</h3>
            </div>
            <p className="text-xs text-slate-300">
              Sign in with a different account or switch seamlessly between admin and customer roles.
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Currently Active Account */}
            {user && (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 truncate">{user.name}</span>
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-black uppercase rounded-md ${
                          user.role === 'admin'
                            ? 'bg-slate-900 text-amber-400'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              </div>
            )}

            {/* Quick Switch Profiles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Available Profiles</span>
                <span>Role</span>
              </div>

              <div className="space-y-2">
                {predefinedAccounts.map((acc, idx) => {
                  const isCurrent = user?.email === acc.email;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isCurrent}
                      onClick={() => {
                        switchAccount({
                          email: acc.email,
                          name: acc.name,
                          role: acc.role,
                        });
                        setIsAccountSwitcherOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-default'
                          : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{acc.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            acc.role === 'admin'
                              ? 'bg-indigo-950 text-amber-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {acc.role === 'admin' ? '🛡️ Admin' : '🛍️ Customer'}
                        </span>
                        {!isCurrent && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Account Sign-In Form toggle */}
            {!showAddForm ? (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Sign in with Another Email / Custom Account</span>
              </button>
            ) : (
              <form onSubmit={handleCreateAndSwitch} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Add New Account</span>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRole('customer')}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        newRole === 'customer'
                          ? 'bg-orange-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRole('admin')}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        newRole === 'admin'
                          ? 'bg-slate-900 text-amber-300'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Sign In & Switch to this Account
                </button>
              </form>
            )}

            {/* Logout button */}
            {user && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsAccountSwitcherOpen(false);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Current Session</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAccountSwitcherOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Open Full Auth Portal
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
