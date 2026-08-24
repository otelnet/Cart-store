import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, Plus, Minus, Heart, Zap, Truck, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openProductDetail,
    cart,
    addToCart,
    updateQuantity,
    toggleFavorite,
    isFavorite,
    formatPrice,
    getProductRatingSummary,
    t,
  } = useShop();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;
  const favorited = isFavorite(product.id);
  const ratingSummary = getProductRatingSummary(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-orange-300 transition-all duration-200 flex flex-col justify-between"
    >
      {/* Product Image Container */}
      <div
        onClick={() => openProductDetail(product)}
        className="relative h-44 sm:h-52 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-600 text-white text-[11px] font-black shadow-xs tracking-tight">
              -{discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-extrabold shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          id={`fav-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-xs transition-colors z-10 active:scale-95 cursor-pointer ${
            favorited ? 'text-rose-500 bg-white' : 'text-slate-400 hover:text-rose-500'
          }`}
          aria-label="Save to favorites"
        >
          <Heart
            className={`w-4 h-4 ${favorited ? 'fill-rose-500 stroke-rose-500' : 'stroke-current'}`}
          />
        </button>

        {/* Bottom Delivery Badge / API Status */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {product.itemType === 'api' && product.apiDetails ? (
            <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-xs text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{product.apiDetails.latency || '34ms'}</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-slate-950/75 backdrop-blur-xs text-[10px] text-white font-medium flex items-center gap-1">
              <Truck className="w-3 h-3 text-orange-400" />
              <span>Express Dispatch</span>
            </span>
          )}
          {product.soldCount && (
            <span className="px-1.5 py-0.5 rounded bg-orange-500/90 text-[10px] text-white font-bold">
              {product.soldCount}+ used
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 justify-between">
        <div onClick={() => openProductDetail(product)} className="cursor-pointer">
          {/* Rating & Sold Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-800 text-xs">{ratingSummary.average}</span>
              <span className="text-[10px] text-slate-400">({ratingSummary.count})</span>
            </div>

            {product.itemType === 'api' && product.apiDetails ? (
              <span className="text-[10px] text-indigo-700 font-mono font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                Auth: {product.apiDetails.authType}
              </span>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>In Stock</span>
              </span>
            )}
          </div>

          {/* Product Name */}
          <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h4>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 mb-2">
            {product.tagline}
          </p>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 mt-auto">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-orange-600 font-black text-lg font-display">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {product.unit}
            </span>
          </div>

          {/* Cart Interaction: Add Button or Stepper */}
          {inCart ? (
            <div className="w-full flex items-center justify-between rounded-xl bg-orange-50 border border-orange-200 p-1">
              <button
                id={`cart-decrease-${product.id}`}
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-orange-100 text-orange-900 flex items-center justify-center font-bold text-xs transition-colors shadow-xs cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-xs text-orange-950 font-mono">
                {quantity} in cart
              </span>
              <button
                id={`cart-increase-${product.id}`}
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center font-bold text-xs transition-colors shadow-xs cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`add-btn-${product.id}`}
              onClick={() => addToCart(product, 1)}
              className="w-full py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addToCart')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
