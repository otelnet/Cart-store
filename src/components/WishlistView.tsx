import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { favorites, addToCart, setIsCartOpen, setCurrentTab, showToast } = useShop();

  const favoriteProducts = PRODUCTS.filter((p) => favorites.includes(p.id));

  const handleAddAllToCart = () => {
    if (favoriteProducts.length === 0) return;
    favoriteProducts.forEach((p) => addToCart(p, 1));
    setIsCartOpen(true);
    showToast(`Added ${favoriteProducts.length} favorite items to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Saved Favorites ({favoriteProducts.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your frequently purchased groceries and saved gourmet items.
          </p>
        </div>

        {favoriteProducts.length > 0 && (
          <button
            id="add-all-favs-btn"
            onClick={handleAddAllToCart}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All to Cart</span>
          </button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center mb-3">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
            No saved favorites yet
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Tap the heart icon on any fresh avocado, artisan bread, or cold brew to save it for quick future orders.
          </p>
          <button
            onClick={() => setCurrentTab('discover')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 mx-auto transition-colors"
          >
            <span>Explore Fresh Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
