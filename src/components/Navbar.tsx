import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Search,
  Heart,
  Globe,
  SlidersHorizontal,
  X,
  User,
  Crown,
  Shield,
  Zap,
  Sparkles,
  Truck,
  RotateCcw,
  Headphones,
  Link as LinkIcon,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { RegionLanguageModal } from './RegionLanguageModal';

interface NavbarProps {
  onOpenFilters?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFilters }) => {
  const {
    totalItemsCount,
    subtotal,
    setIsCartOpen,
    favorites,
    searchQuery,
    setSearchQuery,
    setCurrentTab,
    currentTab,
    selectedDietary,
    activeOrder,
    openOrderTracker,
    formatPrice,
    user,
    isAdmin,
    setIsAuthModalOpen,
    setIsProfileModalOpen,
    minRating,
    onlyInStock,
    onlyOnSale,
    onlyOrganic,
    regionConfig,
    selectedLanguage,
    currency,
    setIsRegionLangModalOpen,
    openSourcingModalWithQuery,
    theme,
    toggleTheme,
    t,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const activeFiltersCount =
    selectedDietary.length +
    (minRating > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyOnSale ? 1 : 0) +
    (onlyOrganic ? 1 : 0);

  const handleUserClick = () => {
    if (user) {
      setIsProfileModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
        {/* Top Micro-Bar: CartNova Global Highlights & Country/Language Switcher */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white text-[11px] font-medium py-1.5 px-3 sm:px-8 border-b border-slate-800 dark:border-slate-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Left Highlights */}
            <div className="flex items-center gap-3 sm:gap-6 overflow-hidden truncate">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold shrink-0">
                <Truck className="w-3.5 h-3.5" />
                <span>{t('freeShippingBanner')}</span>
              </div>
              <button
                onClick={() => openSourcingModalWithQuery('')}
                className="hidden sm:flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Can't find an item? Source from Jumia Nigeria / Global</span>
              </button>
              <div className="hidden lg:flex items-center gap-1 text-slate-300">
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                <span>{t('freeReturns')}</span>
              </div>
            </div>

            {/* Right: Theme, Region / Language Switcher & Admin Status */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {isAdmin && (
                <button
                  onClick={() => setCurrentTab('admin')}
                  className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center gap-1 hover:bg-amber-300 cursor-pointer shadow-xs"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Mode</span>
                </button>
              )}

              {/* Theme Toggle in Top Bar */}
              <button
                id="topbar-theme-toggle-btn"
                onClick={toggleTheme}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer text-xs"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden md:inline text-[10px] font-bold text-amber-300">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                    <span className="hidden md:inline text-[10px] font-bold text-slate-300">Dark</span>
                  </>
                )}
              </button>

              {/* Region & Language Trigger Button */}
              <button
                id="region-lang-navbar-btn"
                onClick={() => setIsRegionLangModalOpen(true)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                title="Change Country, Language & Settlement Currency"
              >
                <span className="text-sm">{regionConfig.flag}</span>
                <span className="font-bold text-white uppercase">{regionConfig.code}</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-300 font-medium">{selectedLanguage.toUpperCase()}</span>
                <span className="text-slate-400">/</span>
                <span className="text-amber-400 font-bold font-mono">{currency}</span>
                <Globe className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Active Order Strip if tracking */}
        {activeOrder && (
          <div
            onClick={() => openOrderTracker(activeOrder.id)}
            className="bg-orange-600 text-white text-xs font-medium py-1.5 px-4 sm:px-8 flex items-center justify-between cursor-pointer hover:bg-orange-700 transition-colors"
          >
            <div className="flex items-center gap-2 max-w-[85%] truncate">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-bold">Live Order #{activeOrder.orderNumber}:</span>
              <span className="truncate opacity-95">
                {activeOrder.status === 'on_the_way'
                  ? `Courier is en route (${activeOrder.estimatedDeliveryTime})`
                  : activeOrder.status === 'picking'
                  ? 'Items are being inspected and verified'
                  : 'Order confirmed and packed with security seal'}
              </span>
            </div>
            <span className="underline text-[11px] font-bold shrink-0">Track Delivery &rarr;</span>
          </div>
        )}

        {/* Main Navbar Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                id="brand-logo-btn"
                onClick={() => {
                  setCurrentTab('atlas_api');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 group text-left cursor-pointer"
              >
                <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all">
                  <span className="font-display font-black text-xl tracking-tighter">CN</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white block font-display">
                      Cart<span className="text-indigo-600 dark:text-indigo-400">Nova</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[10px] font-black uppercase font-mono tracking-wider">
                      Atlas
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      API
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                    Public APIs, Atlas Explorer & Universal Directory
                  </span>
                </div>
              </button>
            </div>

            {/* Search Input on Desktop & Tablet */}
            <div className="flex-1 max-w-xl mx-2 lg:mx-6 hidden sm:block relative">
              <div className="relative flex items-center w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-indigo-500" />
                </div>
                <input
                  id="desktop-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search 1,400+ public APIs, endpoints, tools, or items..."
                  className="w-full bg-slate-50 dark:bg-slate-800/90 border-2 border-indigo-500/80 rounded-full py-2.5 pl-11 pr-24 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner-xs"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => openSourcingModalWithQuery(searchQuery)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[11px] font-black flex items-center gap-1 shadow-xs cursor-pointer"
                    title="Source any unlisted API or item"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Live Search Helper Card when search is typed */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-3 z-40 space-y-2">
                  <div
                    onClick={() => {
                      openSourcingModalWithQuery(searchQuery);
                      setIsSearchFocused(false);
                    }}
                    className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div className="text-xs text-slate-800 dark:text-slate-200 truncate">
                        Looking for <span className="font-bold text-indigo-700 dark:text-indigo-300">"{searchQuery}"</span>?{' '}
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Search 1,400+ public endpoints or request sourcing</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 shrink-0">
                      Explore Results <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Navigation & Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Sourcing Hub button for quick access */}
              <button
                id="sourcing-hub-btn"
                onClick={() => openSourcingModalWithQuery('')}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-bold transition-colors cursor-pointer"
                title="Source unlisted products from Jumia Nigeria or Global suppliers"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 fill-orange-500 dark:fill-orange-400" />
                <span>Source Item / Jumia Link</span>
              </button>

              {/* Light / Dark Mode Toggle */}
              <button
                id="navbar-theme-btn"
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle theme mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* Filter button */}
              {onOpenFilters && (
                <button
                  id="filter-trigger-btn"
                  onClick={onOpenFilters}
                  className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeFiltersCount > 0
                      ? 'bg-orange-50 dark:bg-orange-950/50 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                  title="Search & Filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden md:inline">{t('filter')}</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              )}

              {/* Wishlist / Favorites */}
              <button
                id="favorites-nav-btn"
                onClick={() => setCurrentTab('favorites')}
                className={`p-2 sm:p-2.5 rounded-xl border transition-colors relative cursor-pointer ${
                  currentTab === 'favorites'
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title={t('favorites')}
              >
                <Heart className="w-4 h-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Cart Button with Multi-Currency Live Total */}
              <button
                id="cart-drawer-trigger-btn"
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-600/20 cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {formatPrice(subtotal)}
                </span>
              </button>

              {/* User Account / Auth Button */}
              <button
                id="user-profile-header-btn"
                onClick={handleUserClick}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={user ? `Account: ${user.name} (${user.role})` : 'Sign In'}
              >
                {user ? (
                  <>
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-7 h-7 rounded-full object-cover border-2 ${
                          isAdmin ? 'border-indigo-600 ring-1 ring-indigo-400' : 'border-orange-500'
                        }`}
                      />
                      {isAdmin ? (
                        <Shield className="w-3.5 h-3.5 text-amber-500 fill-amber-500 absolute -bottom-1 -right-1" />
                      ) : user.isPro ? (
                        <Crown className="w-3 h-3 text-amber-500 fill-amber-500 absolute -bottom-1 -right-1" />
                      ) : null}
                    </div>
                    <div className="hidden lg:block text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block max-w-[90px] truncate leading-tight">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none">
                        {user.role}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 px-1">
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="hidden sm:inline">{t('signIn')}</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Bar Strip (PublicAPIs.io Categories & Tabs) */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 py-2.5 overflow-x-auto no-scrollbar text-xs font-bold text-slate-600 dark:text-slate-400 gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <button
                onClick={() => {
                  setCurrentTab('atlas_api');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors flex items-center gap-1.5 px-3 py-1 rounded-lg cursor-pointer ${
                  currentTab === 'atlas_api'
                    ? 'bg-indigo-600 text-white font-extrabold shadow-xs'
                    : 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Atlas API (Featured)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/20 text-white font-bold">REST</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('discover');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors flex items-center gap-1 cursor-pointer ${
                  currentTab === 'discover' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>All APIs & Directory (1,400+)</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('categories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors flex items-center gap-1 cursor-pointer ${
                  currentTab === 'categories' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>50+ Categories</span>
              </button>

              <button
                onClick={() => {
                  openSourcingModalWithQuery('');
                }}
                className="transition-colors flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Submit API / Sourcing Hub</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('deals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors flex items-center gap-1 cursor-pointer ${
                  currentTab === 'deals' ? 'text-orange-600 dark:text-orange-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{t('flashDeals')} & Hardware</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('favorites');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors flex items-center gap-1 cursor-pointer ${
                  currentTab === 'favorites' ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Saved Bookmarks ({favorites.length})</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors cursor-pointer ${
                  currentTab === 'orders' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('myOrders')}
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setCurrentTab('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`transition-colors flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-extrabold cursor-pointer ${
                    currentTab === 'admin' ? 'bg-indigo-600 text-white dark:bg-indigo-600' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Portal</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="hidden sm:inline font-mono">1,400+ Public APIs</span>
              <span className="hidden lg:inline">•</span>
              <span className="hidden lg:inline text-emerald-600 dark:text-emerald-400 font-bold">99.98% Monitored</span>
            </div>
          </div>

          {/* Mobile Search Bar Row (When on Mobile) */}
          <div className="sm:hidden pb-3 space-y-2">
            <div className="relative flex items-center w-full rounded-full bg-slate-50 dark:bg-slate-800 border border-orange-400 dark:border-orange-500 px-3.5 py-2">
              <Search className="w-4 h-4 text-orange-500 shrink-0 mr-2" />
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or paste Jumia URL..."
                className="w-full text-xs bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => openSourcingModalWithQuery(searchQuery)}
                className="px-2 py-0.5 bg-orange-600 text-white rounded-full text-[10px] font-bold"
              >
                Source
              </button>
            </div>

            {searchQuery && (
              <div
                onClick={() => openSourcingModalWithQuery(searchQuery)}
                className="p-2 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 rounded-xl text-[11px] text-orange-900 dark:text-orange-200 font-bold flex items-center justify-between"
              >
                <span>Can't find "{searchQuery}"? Source via Jumia / Global &rarr;</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Region & Language Modal */}
      <RegionLanguageModal />
    </>
  );
};
