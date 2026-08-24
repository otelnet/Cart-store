import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Globe, MapPin, DollarSign, Check, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RegionCode, LanguageCode, CurrencyCode } from '../types';

export const RegionLanguageModal: React.FC = () => {
  const {
    isRegionLangModalOpen,
    setIsRegionLangModalOpen,
    selectedRegion,
    setSelectedRegion,
    regions,
    selectedLanguage,
    setSelectedLanguage,
    languages,
    currency,
    setCurrency,
    currencies,
    t,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'region' | 'language' | 'currency'>('region');

  if (!isRegionLangModalOpen) return null;

  const currentRegion = regions.find((r) => r.code === selectedRegion);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">
                  {t('regionAndLanguage')}
                </h3>
                <p className="text-xs text-slate-300">
                  {currentRegion?.flag} {currentRegion?.name} • {selectedLanguage.toUpperCase()} • {currency}
                </p>
              </div>
            </div>

            <button
              id="close-region-modal-btn"
              onClick={() => setIsRegionLangModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('region')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'region'
                  ? 'border-orange-600 text-orange-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Country / Region ({regions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('language')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'language'
                  ? 'border-orange-600 text-orange-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Language ({languages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('currency')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'currency'
                  ? 'border-orange-600 text-orange-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Currency ({currencies.length})</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
            {/* TAB 1: REGION */}
            {activeTab === 'region' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3">
                  <Truck className="w-5 h-5 text-orange-600 shrink-0" />
                  <p className="text-xs text-orange-950 font-medium leading-relaxed">
                    Selecting your country sets regional delivery hubs, estimated arrival times, and automatically adjusts your local settlement currency.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {regions.map((reg) => {
                    const isSelected = selectedRegion === reg.code;
                    return (
                      <button
                        key={reg.code}
                        onClick={() => setSelectedRegion(reg.code as RegionCode)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-white border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{reg.flag}</span>
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">
                              {reg.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Currency: <span className="font-semibold text-slate-600">{reg.defaultCurrency}</span>
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">{reg.code}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: LANGUAGE */}
            {activeTab === 'language' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-950 font-medium">
                    Enjoy seamless shopping in your native language including Nigerian languages (Hausa, Yoruba, Igbo), English, French, Spanish, and more.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {languages.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code as LanguageCode)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span>
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">
                              {lang.nativeName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {lang.name}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: CURRENCY */}
            {activeTab === 'currency' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-950 font-medium">
                    Prices, coupons, discounts and checkout totals will be automatically converted using live benchmark exchange rates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currencies.map((curr) => {
                    const isSelected = currency === curr.code;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => setCurrency(curr.code as CurrencyCode)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{curr.flag}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-slate-900">{curr.code}</span>
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-mono">
                                {curr.symbol}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">{curr.name}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Selected:</span>
              <span className="font-bold text-slate-900">
                {currentRegion?.flag} {currentRegion?.name} ({currency})
              </span>
            </div>

            <button
              onClick={() => setIsRegionLangModalOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              {t('saveChanges')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
