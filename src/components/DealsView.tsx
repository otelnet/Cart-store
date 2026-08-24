import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, PROMO_CODES } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { Tag, Sparkles, Zap, Copy, Check, Clock, ShoppingBag } from 'lucide-react';

export const DealsView: React.FC = () => {
  const { applyPromoCode, addToCart, setIsCartOpen, showToast, formatPrice } = useShop();

  const discountedProducts = PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.price);

  const handleCopyCode = (code: string) => {
    applyPromoCode(code);
    showToast(`Code ${code} copied & applied to your cart!`);
  };

  const bundles = [
    {
      id: 'bundle-brunch',
      name: 'Sunday Gourmet Brunch Bundle',
      description: 'Artisan Wild Sourdough + Grass-Fed French Butter + Sweet Ruby Strawberries + Vanilla Bean Greek Yogurt',
      originalPrice: 24.96,
      bundlePrice: 19.99,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      itemIds: ['prod-2', 'prod-4', 'prod-3', 'prod-5'],
    },
    {
      id: 'bundle-mediterranean',
      name: 'Mediterranean Salad & Olive Oil Box',
      description: 'Organic Hass Avocados + Truffle Burrata Salad Kit + Estate Extra Virgin Olive Oil',
      originalPrice: 36.47,
      bundlePrice: 29.99,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      itemIds: ['prod-1', 'prod-8', 'prod-10'],
    },
  ];

  const handleAddBundle = (bundle: typeof bundles[0]) => {
    bundle.itemIds.forEach((id) => {
      const prod = PRODUCTS.find((p) => p.id === id);
      if (prod) addToCart(prod, 1);
    });
    setIsCartOpen(true);
    showToast(`Added ${bundle.name} to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Deals Hero */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Daily Flash Discounts</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white">
            Super Saver Deals & Coupons
          </h2>
          <p className="text-xs sm:text-sm text-white/90">
            Save up to 30% on seasonal organic harvest, chef-prepared dinner kits, and artisanal pantry items.
          </p>
        </div>
      </div>

      {/* Available Promo Vouchers */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-600" />
          <span>Active Promo Vouchers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROMO_CODES.map((promo) => (
            <div
              key={promo.code}
              className="bg-white rounded-2xl border-2 border-dashed border-emerald-300 p-4 flex flex-col justify-between shadow-xs hover:border-emerald-500 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-sm text-emerald-800 tracking-wider">
                    {promo.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    {promo.discountType === 'percentage' ? `${promo.value}% OFF` : promo.discountType === 'fixed' ? `${formatPrice(promo.value)} OFF` : 'FREE SHIP'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{promo.description}</p>
              </div>

              <button
                onClick={() => handleCopyCode(promo.code)}
                className="mt-3 w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Apply Voucher</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Chef Bundles */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Curated Savings Bundles</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bundles.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-center"
            >
              <img
                src={b.image}
                alt={b.name}
                className="w-full sm:w-36 h-36 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900">
                    {b.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {b.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="font-display font-black text-lg text-slate-900">
                      {formatPrice(b.bundlePrice)}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-2">
                      {formatPrice(b.originalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddBundle(b)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Bundle</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discounted Product Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-900">
          Discounted Daily Harvest & Essentials ({discountedProducts.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {discountedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
