import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Shield,
  ShoppingBag,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    login,
    t,
  } = useShop();

  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in was canceled or failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }
      if (!agreeTerms) {
        setError('Please agree to the CartNova Terms of Service and Privacy Policy');
        return;
      }

      setIsLoading(true);
      try {
        await signUpWithEmail(cleanEmail, password, name.trim(), selectedRole);
      } catch (err: any) {
        setError(err.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        await signInWithEmail(cleanEmail, password);
      } catch (err: any) {
        setError(err.message || 'Invalid email or password');
      } finally {
        setIsLoading(false);
      }
    }
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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8"
        >
          {/* Header Banner */}
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
                ? 'Create CartNova Account'
                : 'Welcome to CartNova'}
            </h3>
            <p className="text-xs text-white/90 mt-1 max-w-xs mx-auto">
              {selectedRole === 'admin'
                ? 'Store inventory editor, live order fulfillment status, revenue metrics & Paystack keys.'
                : isSignUp
                ? 'Sign up to save delivery addresses, secure payment cards & enjoy fast dispatch.'
                : 'Sign in to access your orders, saved addresses, wallet methods & VIP Pro benefits.'}
            </p>
          </div>

          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* 1-Click Google Authentication */}
            <div>
              <button
                type="button"
                id="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {isGoogleLoading
                    ? 'Connecting to Google...'
                    : 'Continue with Google (1-Click)'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Or with Email & Password
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

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
                  Sign In
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chinedu Eze"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {selectedRole === 'admin' ? 'Admin Email' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'otelnetclient@gmail.com' : 'you@example.com'}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Min 6 characters</span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && selectedRole === 'customer' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {isSignUp && (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="terms-checkbox" className="text-[11px] text-slate-500 cursor-pointer leading-tight">
                    I agree to CartNova's Terms of Service and Privacy Policy for address saving and payment security.
                  </label>
                </div>
              )}

              <button
                type="submit"
                id="submit-auth-btn"
                disabled={isLoading || isGoogleLoading}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 ${
                  selectedRole === 'admin'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {selectedRole === 'admin'
                        ? 'Sign In to Admin Dashboard'
                        : isSignUp
                        ? 'Create Customer Account'
                        : 'Sign In as Customer'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Fast Accounts */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Quick 1-Click Instant Profiles
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('chinedu.eze@cartnovastore.com', 'Chinedu Eze', 'customer')}
                  className="p-2.5 border border-orange-200 bg-orange-50/50 hover:bg-orange-100/70 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="text-xl">🇳🇬</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Chinedu Eze</p>
                    <p className="text-[10px] text-orange-700 font-medium">Customer (Lekki, Lagos)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('alex.morgan@cartnovastore.com', 'Alex Morgan', 'customer')}
                  className="p-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="text-xl">🛍️</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Alex Morgan</p>
                    <p className="text-[10px] text-slate-500 font-medium">Customer (Standard)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('otelnetclient@gmail.com', 'Store Administrator', 'admin')}
                  className="sm:col-span-2 p-2.5 border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <p className="text-xs font-bold text-indigo-950">Store Administrator (otelnetclient@gmail.com)</p>
                      <p className="text-[10px] text-indigo-700 font-medium">
                        Catalog CRUD, stock management & Paystack Gateway
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
              <span>Firebase Auth & Firestore SSL Encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
