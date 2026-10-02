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
  Lock,
  CreditCard,
  Truck,
  Layers,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

export const AccountSwitcherModal: React.FC = () => {
  const {
    user,
    isAdmin,
    savedAccounts,
    switchAccount,
    removeSavedAccount,
    isAccountSwitcherOpen,
    setIsAccountSwitcherOpen,
    setIsAuthModalOpen,
    logout,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'customer'>('all');
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
      email: newEmail.trim().toLowerCase(),
      name: formattedName,
      role: newRole,
    });
    setNewEmail('');
    setNewName('');
    setShowAddForm(false);
    setIsAccountSwitcherOpen(false);
  };

  const predefinedAdminAccounts = [
    {
      email: 'otelnetclient@gmail.com',
      name: 'Store Administrator',
      role: 'admin' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      badge: 'Root Store Admin',
      description: 'Full store inventory CRUD, live order dispatch tracking, and Paystack gateway keys',
    },
  ];

  const predefinedCustomerAccounts = [
    {
      email: 'alex.morgan@cartnovastore.com',
      name: 'Alex Morgan',
      role: 'customer' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      badge: 'VIP Customer',
      description: 'Cart shopping, Paystack checkout, driver live messaging & delivery addresses',
    },
    {
      email: 'chinedu.eze@cartnovastore.com',
      name: 'Chinedu Eze',
      role: 'customer' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      badge: 'Nigeria Shopper',
      description: 'Local Naira Paystack settlement, Bank Transfer, and Lekki Phase 1 delivery',
    },
  ];

  // Merge predefined accounts with user-saved accounts, deduplicating by email
  const allAdminAccounts = [
    ...predefinedAdminAccounts,
    ...savedAccounts
      .filter((a) => a.role === 'admin' && !predefinedAdminAccounts.some((p) => p.email === a.email))
      .map((a) => ({
        email: a.email,
        name: a.name,
        role: 'admin' as UserRole,
        avatar: a.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        badge: 'Custom Admin',
        description: 'Store operations & management',
      })),
  ];

  const allCustomerAccounts = [
    ...predefinedCustomerAccounts,
    ...savedAccounts
      .filter((a) => a.role === 'customer' && !predefinedCustomerAccounts.some((p) => p.email === a.email))
      .map((a) => ({
        email: a.email,
        name: a.name,
        role: 'customer' as UserRole,
        avatar: a.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        badge: 'Saved Customer',
        description: 'Shopping, cart & personal orders',
      })),
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-5 text-white relative">
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
              <h3 className="text-xl font-black font-display text-white">Account & Role Switcher</h3>
            </div>
            <p className="text-xs text-slate-300">
              Separate accounts for store administrators and customer shoppers with isolated permissions.
            </p>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                All Accounts ({allAdminAccounts.length + allCustomerAccounts.length})
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>Admin ({allAdminAccounts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('customer')}
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'customer'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Customer ({allCustomerAccounts.length})</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4 max-h-[68vh] overflow-y-auto">
            {/* Currently Active Account Banner */}
            {user && (
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isAdmin
                    ? 'bg-amber-500/10 border-amber-400/40 text-slate-900 dark:text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shrink-0"
                    />
                    {isAdmin ? (
                      <Shield className="w-3.5 h-3.5 text-amber-500 fill-amber-500 absolute -bottom-1 -right-1" />
                    ) : (
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-500 absolute -bottom-1 -right-1" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black truncate">{user.name}</span>
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-black uppercase rounded-md ${
                          isAdmin
                            ? 'bg-slate-950 text-amber-300 dark:bg-amber-400 dark:text-slate-950'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isAdmin ? 'Store Admin' : 'Customer'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>

                <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Now
                </span>
              </div>
            )}

            {/* SECTION 1: Administrator Accounts */}
            {(activeTab === 'all' || activeTab === 'admin') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <span>Store Administrator Accounts</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Full Control
                  </span>
                </div>

                <div className="space-y-2">
                  {allAdminAccounts.map((acc, idx) => {
                    const isCurrent = user?.email === acc.email;
                    return (
                      <div
                        key={`admin-${idx}`}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isCurrent
                            ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 hover:bg-amber-50/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={acc.avatar}
                              alt={acc.name}
                              className="w-9 h-9 rounded-full object-cover border border-amber-400/40 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                  {acc.name}
                                </p>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-500 border border-amber-400/30">
                                  {acc.badge}
                                </span>
                              </div>
                              <p className={`text-[11px] truncate ${isCurrent ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                {acc.email}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                                {acc.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCurrent ? (
                              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Current
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  switchAccount({
                                    email: acc.email,
                                    name: acc.name,
                                    role: acc.role,
                                  });
                                  setIsAccountSwitcherOpen(false);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                              >
                                <span>Switch</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 2: Customer Accounts */}
            {(activeTab === 'all' || activeTab === 'customer') && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
                    <span>Customer Shopper Accounts</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Storefront & Checkout
                  </span>
                </div>

                <div className="space-y-2">
                  {allCustomerAccounts.map((acc, idx) => {
                    const isCurrent = user?.email === acc.email;
                    return (
                      <div
                        key={`cust-${idx}`}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isCurrent
                            ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800 shadow-xs'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={acc.avatar}
                              alt={acc.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {acc.name}
                                </p>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {acc.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{acc.email}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                                {acc.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCurrent ? (
                              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Current
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  switchAccount({
                                    email: acc.email,
                                    name: acc.name,
                                    role: acc.role,
                                  });
                                  setIsAccountSwitcherOpen(false);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                              >
                                <span>Switch</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Account Sign-In / Register Form toggle */}
            {!showAddForm ? (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Register or Add a Different Account</span>
              </button>
            ) : (
              <form onSubmit={handleCreateAndSwitch} className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span>Create & Switch to New Account</span>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px]"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRole('customer')}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        newRole === 'customer'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Customer Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRole('admin')}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        newRole === 'admin'
                          ? 'bg-slate-900 dark:bg-slate-100 text-amber-300 dark:text-slate-900 shadow-xs'
                          : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Account</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {newRole === 'admin'
                      ? 'Admin grants access to product inventory, order tracking statuses, and Paystack gateway keys.'
                      : 'Customer accounts enjoy browsing products, adding items to cart, and paying via Paystack.'}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Oluwaseun Davies"
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. seun.davies@example.com"
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Create & Activate This Account
                </button>
              </form>
            )}

            {/* Logout and Auth Portal trigger */}
            {user && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
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
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium"
                >
                  Sign In with Password
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

