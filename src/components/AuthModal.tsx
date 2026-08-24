import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, Shield, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, t } = useShop();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (isSignUp && selectedRole === 'customer' && !name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    setError('');
    login(email, isSignUp ? name : undefined, selectedRole);
  };

  const handleQuickLogin = (userEmail: string, userName: string, role: UserRole) => {
    login(userEmail, userName, role);
  };

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
          <div
            className={`p-6 text-white text-center relative transition-colors ${
              selectedRole === 'admin'
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900'
                : 'bg-gradient-to-br from-orange-600 via-amber-600 to-rose-600'
            }`}
          >
            <button
              id="close-auth-modal-btn"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs border border-white/20">
              {selectedRole === 'admin' ? (
                <Shield className="w-6 h-6 text-amber-300" />
              ) : (
                <Sparkles className="w-6 h-6 text-white" />
              )}
            </div>

            <h3 className="text-2xl font-black font-display tracking-tight text-white">
              {selectedRole === 'admin'
                ? 'Admin Management Portal'
                : isSignUp
                ? 'Create Customer Account'
                : 'Welcome to CartNova Store'}
            </h3>
            <p className="text-xs text-white/90 mt-1 max-w-xs mx-auto">
              {selectedRole === 'admin'
                ? 'Full store oversight, product catalog editor, order fulfillment and live store revenue.'
                : isSignUp
                ? 'Sign up to track packages, save addresses & enjoy free express delivery.'
                : 'Sign in to access your orders, wishlist, VIP Pro perks and payment methods.'}
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Account Role Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('customer');
                    setError('');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'customer'
                      ? 'bg-white text-orange-600 shadow-xs ring-1 ring-orange-500/20'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setIsSignUp(false);
                    setError('');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Portal</span>
                </button>
              </div>
            </div>

            {/* Mode switch for Customer (Sign in vs Sign up) */}
            {selectedRole === 'customer' && (
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !isSignUp ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Customer Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isSignUp ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && selectedRole === 'customer' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Chinedu Eze"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {selectedRole === 'admin' ? 'Admin Email' : 'Customer Email'}
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'admin@temucart.com' : 'customer@temucart.com'}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-auth-btn"
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                }`}
              >
                <span>
                  {selectedRole === 'admin'
                    ? 'Sign In to Admin Dashboard'
                    : isSignUp
                    ? 'Register Customer Account'
                    : 'Sign In as Customer'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Switchers */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Quick 1-Click Fast Login
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('chinedu.eze@temucart.com', 'Chinedu Eze (Nigeria)', 'customer')}
                  className="p-2.5 border border-orange-200 bg-orange-50/50 hover:bg-orange-100/70 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="text-xl">🇳🇬</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Customer (Chinedu)</p>
                    <p className="text-[10px] text-orange-700 font-medium">Lagos Shopper</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('alex.morgan@temucart.com', 'Alex Morgan (US)', 'customer')}
                  className="p-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="text-xl">🇺🇸</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Customer (Alex)</p>
                    <p className="text-[10px] text-slate-500 font-medium">Global Shopper</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@temucart.com', 'Store Administrator', 'admin')}
                  className="sm:col-span-2 p-2.5 border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <p className="text-xs font-bold text-indigo-950">Store Administrator</p>
                      <p className="text-[10px] text-indigo-700 font-medium">
                        Manage products, stock, live orders & sales
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-[10px]">
                    Admin Root
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-Region SSL Encrypted Authentication</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
