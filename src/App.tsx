import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { CATEGORIES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroBanner } from './components/HeroBanner';
import { CategoryScroll } from './components/CategoryScroll';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AddressPickerModal } from './components/AddressPickerModal';
import { DriverContactModal } from './components/DriverContactModal';
import { UpdateOrderAddressModal } from './components/UpdateOrderAddressModal';
import { DietaryFilterModal } from './components/DietaryFilterModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { OrderTrackerView } from './components/OrderTrackerView';
import { OrdersListView } from './components/OrdersListView';
import { DealsView } from './components/DealsView';
import { WishlistView } from './components/WishlistView';
import { CategoriesBrowseView } from './components/CategoriesBrowseView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AtlasApiHeroSpotlight } from './components/AtlasApiHeroSpotlight';
import { AtlasApiView } from './components/AtlasApiView';
import { SourcingFinderModal } from './components/SourcingFinderModal';
import { SourcingEmptySearchCard } from './components/SourcingEmptySearchCard';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AccountSwitcherModal } from './components/AccountSwitcherModal';
import { ToastContainer } from './components/Toast';
import {
  Sparkles,
  SlidersHorizontal,
  Zap,
  Truck,
  ShieldCheck,
  Search,
  X,
  Shield,
  Tag,
  Globe,
  RotateCcw,
  Star,
} from 'lucide-react';

const MainShopView: React.FC<{ onOpenFilters: () => void }> = ({ onOpenFilters }) => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedDietary,
    clearFilters,
    activeOrder,
    openOrderTracker,
    formatPrice,
    sortBy,
    setSortBy,
    minRating,
    priceRange,
    onlyOnSale,
    onlyOrganic,
    toggleDietaryFilter,
    regionConfig,
    isAdmin,
    setCurrentTab,
    setIsRegionLangModalOpen,
    openSourcingModalWithQuery,
    t,
  } = useShop();

  const isFiltering =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedDietary.length > 0 ||
    minRating > 0 ||
    onlyOnSale ||
    onlyOrganic ||
    priceRange[1] < 100;

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedDietary.length +
    (minRating > 0 ? 1 : 0) +
    (onlyOnSale ? 1 : 0) +
    (onlyOrganic ? 1 : 0) +
    (priceRange[1] < 100 ? 1 : 0);

  return (
    <div className="flex gap-8 pb-16">
      {/* Sidebar (Desktop lg screens) */}
      <aside className="w-64 space-y-5 hidden lg:block shrink-0">
        {/* Categories Navigation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
            <span>{t('categories')}</span>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">{CATEGORIES.length}</span>
          </div>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`sidebar-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-extrabold ring-1 ring-orange-400/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.name}</span>
                {cat.badge ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-black bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                    {cat.badge}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {cat.id === 'all' ? 'All' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Jumia Nigeria & Global Supply Sourcing Banner */}
        <div
          onClick={() => openSourcingModalWithQuery('')}
          className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-5 text-white shadow-md space-y-2 cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-1.5 text-amber-200 font-extrabold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Direct Sourcing Hub</span>
          </div>
          <h4 className="text-sm font-black font-display leading-tight text-white group-hover:text-amber-100">
            Can't Find an Item on the Store?
          </h4>
          <p className="text-[11px] text-orange-100 leading-relaxed">
            Paste any link from <span className="underline font-bold text-white">jumia.com.ng</span> or type any product name. Direct factory wholesale prices delivered to {regionConfig.name}.
          </p>
          <div className="pt-1 flex items-center justify-between text-xs font-bold text-white">
            <span className="underline">Source Item Now &rarr;</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">Instant Quote</span>
          </div>
        </div>

        {/* Region & Language Fast Switch Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-5 text-white shadow-xs space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider">
              {t('regionAndLanguage')}
            </span>
            <Globe className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">
              {regionConfig.flag} {regionConfig.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direct factory express air & ocean logistics
            </p>
          </div>
          <button
            onClick={() => setIsRegionLangModalOpen(true)}
            className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Change Country / Language
          </button>
        </div>

        {/* Admin Quick Switch (if Admin) */}
        {isAdmin && (
          <div className="bg-indigo-950 rounded-3xl p-5 text-white shadow-xs space-y-2 border border-indigo-800">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>Admin Mode Active</span>
            </div>
            <p className="text-xs text-indigo-200">
              Manage product stock, prices and customer shipments directly.
            </p>
            <button
              onClick={() => setCurrentTab('admin')}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Open Admin Portal
            </button>
          </div>
        )}

        {/* CartNova VIP Guarantee */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
            {t('buyerProtection')}
          </span>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Safe payment with 256-bit encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
              <span>Tracking on all shipments</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>90-day free returns window</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Active Order Live Banner if active */}
        {activeOrder ? (
          <div
            onClick={() => openOrderTracker(activeOrder.id)}
            className="bg-orange-600 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white shadow-md gap-4 cursor-pointer hover:bg-orange-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Active Shipment #{activeOrder.orderNumber}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                {activeOrder.status === 'on_the_way'
                  ? 'Courier is en route to doorstep!'
                  : activeOrder.status === 'picking'
                  ? 'Items are being inspected and verified'
                  : 'Order confirmed & packaged'}
              </h3>
              <p className="text-xs text-orange-100 max-w-md">
                Delivery: {activeOrder.estimatedDeliveryTime} • Dispatch Courier: {activeOrder.driver.name}
              </p>
            </div>

            <div className="bg-white/15 p-4 rounded-2xl backdrop-blur-xs border border-white/20 shrink-0 text-right">
              <div className="text-xs text-orange-100">Total Paid</div>
              <div className="text-xl font-black font-display">{formatPrice(activeOrder.total)}</div>
              <span className="text-[11px] underline text-white font-bold block mt-1">
                View Live Tracking &rarr;
              </span>
            </div>
          </div>
        ) : (
          !isFiltering && (
            <>
              <AtlasApiHeroSpotlight />
              <HeroBanner />
            </>
          )
        )}

        {/* Show spotlight if specifically filtering by atlas */}
        {selectedCategory === 'atlas' && !activeOrder && (
          <AtlasApiHeroSpotlight />
        )}

        {/* Mobile/Tablet Category Pills */}
        <div className="lg:hidden">
          <CategoryScroll />
        </div>

        {/* Header Strip & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory === 'all'
                ? `Trending Deals in ${regionConfig.name} ${regionConfig.flag}`
                : CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Deals'}
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Showing {products.length} verified products • Fast Delivery Available
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onOpenFilters}
              className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            <span className="text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs focus:ring-2 focus:ring-orange-500 outline-none shadow-xs cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="rating">Highest Rated (★)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="most-reviewed">Best Sellers (Most Sold)</option>
            </select>
          </div>
        </div>

        {/* Active Applied Filters Bar */}
        {isFiltering && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-1">
                Category: {selectedCategory}
                <X
                  className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => setSelectedCategory('all')}
                />
              </span>
            )}
            {searchQuery && (
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-1">
                Search: "{searchQuery}"
                <X
                  className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => setSearchQuery('')}
                />
              </span>
            )}
            {minRating > 0 && (
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-1">
                Rating: {minRating}★+
              </span>
            )}
            {onlyOnSale && (
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-1">
                On Sale Only
              </span>
            )}
            {selectedDietary.map((d) => (
              <span
                key={d}
                className="px-2.5 py-1 bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 rounded-lg font-medium flex items-center gap-1"
              >
                {d}
                <X
                  className="w-3 h-3 cursor-pointer text-orange-700 hover:text-orange-950 dark:text-orange-300 dark:hover:text-white"
                  onClick={() => toggleDietaryFilter(d)}
                />
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline ml-auto cursor-pointer"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <SourcingEmptySearchCard
            query={searchQuery}
            onResetFilters={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export function ShopApp() {
  const {
    currentTab,
    trackingOrderId,
    closeOrderTracker,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isAdmin,
  } = useShop();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onOpenFilters={() => setIsFilterModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-5">
        {currentTab === 'discover' && (
          <MainShopView onOpenFilters={() => setIsFilterModalOpen(true)} />
        )}
        {currentTab === 'atlas_api' && <AtlasApiView />}
        {currentTab === 'categories' && <CategoriesBrowseView />}
        {currentTab === 'deals' && <DealsView />}
        {currentTab === 'favorites' && <WishlistView />}
        {currentTab === 'admin' && <AdminDashboardView />}
        {currentTab === 'orders' && (
          trackingOrderId ? (
            <OrderTrackerView orderId={trackingOrderId} onBack={closeOrderTracker} />
          ) : (
            <OrdersListView />
          )
        )}
      </main>

      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-white/20 group"
          title="Chat with CartNova AI Shopping & API Concierge"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black leading-tight flex items-center gap-1">
              <span>CartNova AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </p>
            <p className="text-[10px] text-indigo-200 leading-none">Ask or source anything</p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-16 py-10 px-4 sm:px-8 text-xs text-slate-400 hidden md:block">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                  CN
                </div>
                <span className="text-white font-black text-lg font-display">
                  Cart<span className="text-indigo-400">Nova</span> <span className="text-xs text-emerald-400 font-mono font-semibold">Atlas</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                CartNova is a modern developer ecosystem & universal platform featuring curated public APIs, interactive Atlas API sandbox, hardware sourcing, and global logistics.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Customer Care & Services
              </h5>
              <ul className="space-y-1.5 text-slate-400">
                <li className="hover:text-white cursor-pointer">Track My Package</li>
                <li className="hover:text-white cursor-pointer">Return & Refund Policy</li>
                <li className="hover:text-white cursor-pointer">CartNova Purchase Protection</li>
                <li className="hover:text-white cursor-pointer">Help Center & Live Chat</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Global Regions & Shipping
              </h5>
              <ul className="space-y-1.5 text-slate-400">
                <li className="hover:text-white cursor-pointer">🇳🇬 Nigeria Express Hub (Lagos, Abuja)</li>
                <li className="hover:text-white cursor-pointer">🇺🇸 North America Delivery</li>
                <li className="hover:text-white cursor-pointer">🇬🇧 United Kingdom & Europe</li>
                <li className="hover:text-white cursor-pointer">🌍 190+ Supported Countries</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Payment & Security
              </h5>
              <p className="text-[11px] text-slate-400">
                Supports Paystack, Flutterwave, Naira Debit Cards, Visa, Mastercard, Apple Pay, PayPal & Escrow Protection.
              </p>
              <div className="pt-2 flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 CartNova Store Global Marketplace. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Terms of Use</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Security Center</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <SourcingFinderModal />
      <CartDrawer />
      <CheckoutModal />
      <AddressPickerModal />
      <DriverContactModal />
      <UpdateOrderAddressModal />
      <DietaryFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
      <AuthModal />
      <AccountSwitcherModal />
      <AiAssistantModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <ShopApp />
    </ShopProvider>
  );
}
