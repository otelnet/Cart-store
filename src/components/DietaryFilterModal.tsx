import React from 'react';
import { useShop } from '../context/ShopContext';
import { DietaryTag } from '../types';
import {
  X,
  Check,
  SlidersHorizontal,
  Star,
  DollarSign,
  Sparkles,
  ArrowUpDown,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../data/mockData';

interface DietaryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIETARY_OPTIONS: { id: DietaryTag; label: string; icon: string }[] = [
  { id: 'organic', label: '100% Organic', icon: '🌿' },
  { id: 'vegan', label: 'Plant-Based / Vegan', icon: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'keto', label: 'Keto Friendly', icon: '🥑' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'low-carb', label: 'Low-Carb', icon: '⚡' },
  { id: 'non-gmo', label: 'Non-GMO Verified', icon: '🛡️' },
];

export const DietaryFilterModal: React.FC<DietaryFilterModalProps> = ({ isOpen, onClose }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedDietary,
    toggleDietaryFilter,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    onlyInStock,
    setOnlyInStock,
    onlyOnSale,
    setOnlyOnSale,
    onlyOrganic,
    setOnlyOrganic,
    sortBy,
    setSortBy,
    clearFilters,
    formatPrice,
    currencyConfig,
  } = useShop();

  if (!isOpen) return null;

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedDietary.length +
    (minRating > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyOnSale ? 1 : 0) +
    (onlyOrganic ? 1 : 0) +
    (priceRange[1] < 50 || priceRange[0] > 0 ? 1 : 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 leading-tight">
                  Search & Filter
                </h3>
                <span className="text-xs text-slate-500">Refine by diet, budget, rating and category</span>
              </div>
            </div>

            <button
              id="close-filter-modal-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filter Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Sort Order */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sort Results</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'featured', label: 'Featured Picks' },
                  { id: 'rating', label: 'Highest Rated' },
                  { id: 'price-low', label: 'Price: Low → High' },
                  { id: 'price-high', label: 'Price: High → Low' },
                  { id: 'most-reviewed', label: 'Most Reviewed' },
                  { id: 'newest', label: 'Fresh Harvest' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSortBy(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      sortBy === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Maximum Price</span>
                </label>
                <span className="text-xs font-bold text-emerald-700">
                  Up to {formatPrice(priceRange[1])}
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="50"
                step="1"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{formatPrice(3)}</span>
                <span>{formatPrice(25)}</span>
                <span>{formatPrice(50)}+</span>
              </div>
            </div>

            {/* Minimum Customer Rating */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Customer Star Rating</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { r: 0, label: 'All Ratings' },
                  { r: 3.5, label: '3.5★ +' },
                  { r: 4.0, label: '4.0★ +' },
                  { r: 4.5, label: '4.5★ +' },
                ].map((item) => (
                  <button
                    key={item.r}
                    onClick={() => setMinRating(item.r)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1 ${
                      minRating === item.r
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {item.r > 0 && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Toggles (In stock, on sale, organic) */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Special Offers & Status
              </label>
              <div className="space-y-2">
                <div
                  onClick={() => setOnlyOnSale(!onlyOnSale)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    onlyOnSale ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">Discounted & On Sale Only</span>
                  </div>
                  <input type="checkbox" checked={onlyOnSale} onChange={() => {}} className="accent-emerald-600" />
                </div>

                <div
                  onClick={() => setOnlyOrganic(!onlyOrganic)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    onlyOrganic ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">Certified 100% Organic Farms</span>
                  </div>
                  <input type="checkbox" checked={onlyOrganic} onChange={() => {}} className="accent-emerald-600" />
                </div>
              </div>
            </div>

            {/* Dietary Requirements */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Dietary & Allergen Preferences
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIETARY_OPTIONS.map((opt) => {
                  const isChecked = selectedDietary.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleDietaryFilter(opt.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all text-left ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{opt.icon}</span>
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
            >
              Reset Filters
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
