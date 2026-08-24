import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  lookupOrGenerateSourcedProduct,
  TRENDING_JUMIA_NIGERIA_ITEMS,
  SourcingLookupResult,
} from '../utils/sourcingEngine';
import {
  Search,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Zap,
  ShoppingBag,
  ExternalLink,
  X,
  Package,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  FileText,
  BadgePercent,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SourcingFinderModal: React.FC = () => {
  const {
    isSourcingModalOpen,
    setIsSourcingModalOpen,
    sourcingQuery,
    setSourcingQuery,
    formatPrice,
    addSourcedProductToCart,
    submitSourcingRequest,
    sourcingRequests,
    regionConfig,
    user,
    isAdmin,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'finder' | 'requests'>('finder');
  const [inputVal, setInputVal] = useState<string>('');
  const [analyzedResult, setAnalyzedResult] = useState<SourcingLookupResult | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customNote, setCustomNote] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Synchronize when opened with a query or URL
  useEffect(() => {
    if (isSourcingModalOpen) {
      const initial = sourcingQuery || 'Oraimo 27000mAh Power Bank';
      setInputVal(initial);
      performLookup(initial);
    }
  }, [isSourcingModalOpen, sourcingQuery]);

  const performLookup = (queryOrUrl: string) => {
    if (!queryOrUrl.trim()) return;
    setIsAnalyzing(true);
    setSubmittedSuccess(false);

    setTimeout(() => {
      const res = lookupOrGenerateSourcedProduct(queryOrUrl);
      setAnalyzedResult(res);
      setIsAnalyzing(false);
    }, 350);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(inputVal);
  };

  const handleSelectPreset = (preset: (typeof TRENDING_JUMIA_NIGERIA_ITEMS)[0]) => {
    setInputVal(preset.sampleUrl);
    setSourcingQuery(preset.sampleUrl);
    performLookup(preset.sampleUrl);
  };

  const handleAddToCart = () => {
    if (!analyzedResult) return;
    addSourcedProductToCart(analyzedResult.product, quantity, customNote);
    setIsSourcingModalOpen(false);
  };

  const handleSubmitRequest = () => {
    if (!analyzedResult) return;
    submitSourcingRequest({
      productName: analyzedResult.product.name,
      sourceUrl: analyzedResult.sourceUrl || (inputVal.startsWith('http') ? inputVal : undefined),
      category: analyzedResult.product.category,
      targetBudget: analyzedResult.product.price,
      quantity,
      notes: customNote || 'Standard retail sealed unit verification requested.',
      estimatedPrice: analyzedResult.product.price,
      originalMarketPrice: analyzedResult.marketPrice,
      estimatedDeliveryDays: analyzedResult.estimatedDeliveryDays,
      sourceOrigin: analyzedResult.sourceOrigin,
      imageUrl: analyzedResult.product.image,
      userEmail: user?.email,
      userName: user?.name,
    });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setActiveTab('requests');
    }, 1200);
  };

  if (!isSourcingModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSourcingModalOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-6 relative">
          <button
            onClick={() => setIsSourcingModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="Close sourcing modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-extrabold tracking-wide uppercase flex items-center gap-1.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Jumia Nigeria & Global Sourcing
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-white text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Direct Factory Wholesale Rate
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white">
            Can't Find an Item on the Store?
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-2xl">
            Paste any link from <span className="font-bold underline text-white">jumia.com.ng</span>, Amazon, or enter any product name. Our automated procurement system calculates factory rates and ships direct to your doorstep in {regionConfig.flag} {regionConfig.name}.
          </p>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20">
            <button
              onClick={() => setActiveTab('finder')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'finder'
                  ? 'bg-white text-orange-700 shadow-md font-extrabold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Instant Product Lookup & URL Parser</span>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-white text-orange-700 shadow-md font-extrabold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Sourced Requests ({sourcingRequests.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'finder' ? (
            <>
              {/* Search & URL Input Form */}
              <div className="bg-slate-50 border-2 border-orange-200 rounded-2xl p-3 sm:p-4 shadow-inner-xs">
                <form onSubmit={handleSearchSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        {inputVal.startsWith('http') ? (
                          <LinkIcon className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Search className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Paste Jumia link (https://www.jumia.com.ng/...) or type item name (e.g., Century Blender, Tecno Camon 30)"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isAnalyzing || !inputVal.trim()}
                      className="px-5 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/20 cursor-pointer shrink-0"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Searching Sourcing Network...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Fetch Direct Quote</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-slate-500 text-[11px] flex items-center gap-1 mr-1">
                      <BadgePercent className="w-3.5 h-3.5 text-orange-600" /> Top Jumia Trends:
                    </span>
                    {TRENDING_JUMIA_NIGERIA_ITEMS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="px-2.5 py-1 bg-white hover:bg-orange-100 hover:text-orange-900 border border-slate-200 rounded-lg text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer truncate max-w-[200px]"
                        title={preset.title}
                      >
                        {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </form>
              </div>

              {/* Dynamic Sourcing Result Display */}
              {isAnalyzing ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 animate-pulse space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
                    <Zap className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    Connecting to Jumia Nigeria Supplier & Global Logistics API...
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Retrieving direct factory wholesale price, stock verification, and international shipping rates.
                  </p>
                </div>
              ) : analyzedResult ? (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-6 space-y-6 shadow-xs">
                  {/* Top Bar of Result */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                        {analyzedResult.savingsPercentage}% OFF RETAIL
                      </span>
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Verified Sourcing Partner
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Supplier Rating: <span className="font-bold text-amber-600">★ {analyzedResult.supplierScore}</span> (1,800+ Fulfilled Units)
                    </div>
                  </div>

                  {/* Main Product Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Left: Image Preview */}
                    <div className="md:col-span-4 space-y-2">
                      <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square group">
                        <img
                          src={analyzedResult.product.image}
                          alt={analyzedResult.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-xs rounded-lg text-[10px] font-bold text-white uppercase">
                          {analyzedResult.product.category}
                        </div>
                      </div>
                      <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-orange-950 font-medium flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>{analyzedResult.estimatedDeliveryDays}</span>
                      </div>
                    </div>

                    {/* Right: Pricing & Sourcing Data */}
                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Sourced Item Reference
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display mt-0.5 leading-snug">
                          {analyzedResult.product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {analyzedResult.product.tagline}
                        </p>
                      </div>

                      {/* Pricing Comparison Box */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                          <div className="text-xs text-slate-500 font-medium">Factory Direct Sourced Price</div>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-2xl sm:text-3xl font-black text-orange-600 font-display">
                              {formatPrice(analyzedResult.product.price * quantity)}
                            </span>
                            <span className="text-sm text-slate-400 line-through font-semibold">
                              {formatPrice(analyzedResult.marketPrice * quantity)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-600">
                            You Save {formatPrice((analyzedResult.marketPrice - analyzedResult.product.price) * quantity)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {quantity > 1 ? `(${formatPrice(analyzedResult.product.price)} each)` : 'Includes import clearance'}
                          </div>
                        </div>
                      </div>

                      {/* Source Origin & External Link if provided */}
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-orange-600" />
                          <span className="font-bold">Source Hub:</span>
                          <span className="text-slate-800 font-medium">{analyzedResult.sourceOrigin}</span>
                        </div>
                        {analyzedResult.sourceUrl && (
                          <div className="flex items-center gap-1.5 text-blue-600 truncate">
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <a
                              href={analyzedResult.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline font-mono text-[11px] truncate max-w-sm"
                            >
                              {analyzedResult.sourceUrl}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Specifications Summary */}
                      <div className="border-t border-slate-100 pt-3">
                        <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                          Procurement Specifications
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {analyzedResult.specs.map((spec, i) => (
                            <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-slate-400 block text-[10px] font-bold">{spec.label}</span>
                              <span className="text-slate-800 font-bold block">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quantity & Notes Form */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Quantity Needed
                          </label>
                          <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                            <button
                              type="button"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="flex-1 text-center font-black text-sm text-slate-900">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(quantity + 1)}
                              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Specific Requests / Sizing / Color
                          </label>
                          <input
                            type="text"
                            value={customNote}
                            onChange={(e) => setCustomNote(e.target.value)}
                            placeholder="e.g. Size 42, Color Black, UK Pin plug..."
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className="w-full sm:flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add Sourced Item to Cart ({formatPrice(analyzedResult.product.price * quantity)})</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSubmitRequest}
                          className="w-full sm:w-auto py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-amber-400" />
                          <span>Save Procurement Ticket</span>
                        </button>
                      </div>

                      {submittedSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Procurement ticket saved successfully! Redirecting to your requests overview...
                          </span>
                        </motion.div>
                      )}

                      {/* Buyer Guarantee Footnote */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          CartNova 100% Sourcing Escrow Protection
                        </span>
                        <span className="hidden sm:inline">
                          Full refund if item doesn't match specs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            /* My Sourced Requests Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900 font-display">
                    Your Sourced Product Quotes & Tickets
                  </h4>
                  <p className="text-xs text-slate-500">
                    Track custom items requested from Jumia Nigeria, Amazon, or international suppliers.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('finder')}
                  className="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Sourcing Search</span>
                </button>
              </div>

              {sourcingRequests.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h5 className="font-bold text-sm text-slate-800">No sourcing requests yet</h5>
                  <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm mx-auto">
                    Search for any product from Jumia Nigeria or paste a link to get factory direct pricing.
                  </p>
                  <button
                    onClick={() => setActiveTab('finder')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700"
                  >
                    Start Sourcing Search
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sourcingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={req.imageUrl}
                          alt={req.productName}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                req.status === 'dispatched'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : req.status === 'in_procurement'
                                  ? 'bg-blue-100 text-blue-800'
                                  : req.status === 'approved'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {req.status.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Ticket #{req.id.slice(-6)}
                            </span>
                          </div>
                          <h5 className="text-sm font-black text-slate-900 truncate mt-0.5">
                            {req.productName}
                          </h5>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Qty: {req.quantity}</span>
                            <span>•</span>
                            <span className="font-bold text-orange-600 font-display">
                              {formatPrice(req.estimatedPrice * req.quantity)}
                            </span>
                            <span>•</span>
                            <span>{req.sourceOrigin}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => {
                            setInputVal(req.sourceUrl || req.productName);
                            setActiveTab('finder');
                            performLookup(req.sourceUrl || req.productName);
                          }}
                          className="px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Quote</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
