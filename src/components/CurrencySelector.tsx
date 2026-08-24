import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { CurrencyCode } from '../types';

export const CurrencySelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currency, setCurrency, currencies, currencyConfig } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="currency-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg border text-slate-700 bg-white hover:bg-slate-50 transition-colors font-semibold ${
          compact
            ? 'px-2 py-1 text-xs border-slate-200'
            : 'px-2.5 py-1.5 text-xs sm:text-sm border-slate-200 shadow-2xs'
        }`}
        title="Change Shopping & Billing Currency"
      >
        <span className="text-base leading-none">{currencyConfig.flag}</span>
        <span className="font-bold">{currencyConfig.code}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pay in Any Currency
            </p>
            <p className="text-[11px] text-slate-500">Real-time live exchange rate</p>
          </div>

          <div className="space-y-0.5 px-1">
            {currencies.map((curr) => {
              const isSelected = curr.code === currency;
              return (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{curr.flag}</span>
                    <div className="text-left">
                      <span className="block font-bold">{curr.code} ({curr.symbol})</span>
                      <span className="text-[10px] text-slate-400 block">{curr.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
