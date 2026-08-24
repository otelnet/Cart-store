import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  lookupOrGenerateSourcedProduct,
  TRENDING_JUMIA_NIGERIA_ITEMS,
} from '../utils/sourcingEngine';
import {
  Search,
  Sparkles,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Zap,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface SourcingEmptySearchCardProps {
  query?: string;
  onResetFilters: () => void;
}

export const SourcingEmptySearchCard: React.FC<SourcingEmptySearchCardProps> = ({
  query,
  onResetFilters,
}) => {
  const {
    formatPrice,
    addSourcedProductToCart,
    openSourcingModalWithQuery,
    regionConfig,
  } = useShop();

  const activeQuery = query && query.trim().length > 0 ? query.trim() : 'Tecno Camon 30 Pro';
  const sourcedResult = lookupOrGenerateSourcedProduct(activeQuery);

  const handleInstantAddToCart = () => {
    addSourcedProductToCart(sourcedResult.product, 1);
  };

  const handleOpenDetailedModal = () => {
    openSourcingModalWithQuery(activeQuery);
  };

  return (
    <div className="bg-gradient-to-b from-orange-50/70 via-white to-amber-50/40 border-2 border-orange-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-orange-200/70">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Instant Sourcing from Jumia Nigeria & Global Supply</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Item not in standard warehouse stock? We can source it for you!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            {query ? (
              <>
                We found direct manufacturer supply for{' '}
                <span className="font-bold text-orange-700 font-mono">"{query}"</span> matching Nigerian retail specifications with factory savings.
              </>
            ) : (
              <>
                Search for any item from <span className="font-bold underline">jumia.com.ng</span>, Amazon, or international stores. We inspect and deliver direct to {regionConfig.flag} {regionConfig.name}.
              </>
            )}
          </p>
        </div>

        <button
          onClick={handleOpenDetailedModal}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <span>Paste Jumia Link / Sourcing Hub</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* Sourced Item Dynamic Preview Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center shadow-xs">
        {/* Left: Product Image */}
        <div className="md:col-span-4 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video md:aspect-square group">
          <img
            src={sourcedResult.product.image}
            alt={sourcedResult.product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 left-2 px-2.5 py-1 bg-orange-600 text-white text-[10px] font-black rounded-lg uppercase shadow-xs">
            {sourcedResult.savingsPercentage}% Off Market Rate
          </span>
        </div>

        {/* Right: Sourcing Details */}
        <div className="md:col-span-8 space-y-3">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Direct Sourcing Match
            </div>
            <h4 className="text-base sm:text-lg font-black text-slate-900 font-display">
              {sourcedResult.product.name}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              {sourcedResult.product.description}
            </p>
          </div>

          {/* Pricing Row */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-black text-orange-600 font-display">
              {formatPrice(sourcedResult.product.price)}
            </span>
            <span className="text-xs text-slate-400 line-through font-semibold">
              {formatPrice(sourcedResult.marketPrice)}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs">
              Save {formatPrice(sourcedResult.marketPrice - sourcedResult.product.price)}
            </span>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>3-5 Days Doorstep Delivery in {regionConfig.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>CartNova 100% Escrow Guarantee</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleInstantAddToCart}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Sourced Item to Cart ({formatPrice(sourcedResult.product.price)})</span>
            </button>

            <button
              onClick={handleOpenDetailedModal}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Customize Specs / Sizing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Sourcing Trends from Jumia Nigeria */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Popular Jumia Nigeria Sourcing Requests:
          </span>
          <button
            onClick={onResetFilters}
            className="text-orange-600 font-bold hover:underline cursor-pointer"
          >
            Clear Search & Show All Warehouse Stock
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TRENDING_JUMIA_NIGERIA_ITEMS.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              onClick={() => openSourcingModalWithQuery(item.sampleUrl)}
              className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 hover:border-orange-400 hover:shadow-xs transition-all cursor-pointer group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                  {item.title}
                </h5>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xs font-black text-orange-600 font-display">
                    {formatPrice(item.directPrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatPrice(item.marketPrice)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
