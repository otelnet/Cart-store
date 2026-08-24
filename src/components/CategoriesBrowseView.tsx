import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/mockData';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  Globe,
  Database,
  Code,
  Cloud,
  Smartphone,
  Apple,
  ShoppingBag,
  Cpu,
  Layers,
  Search,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Globe,
  Database,
  Code,
  Cloud,
  Smartphone,
  Apple,
  ShoppingBag,
  Cpu,
  Layers,
};

export const CategoriesBrowseView: React.FC = () => {
  const { selectedCategory, setSelectedCategory, products, searchQuery, setSearchQuery } = useShop();

  const currentCategoryData = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Category Visual Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            PublicAPIs & Goods Directory Explorer
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            {currentCategoryData.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {currentCategoryData.description}
          </p>
        </div>
      </div>

      {/* Categories Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? products.length
              : products.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600/20 shadow-xs'
                  : 'border-slate-200/90 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {count}
                </span>
              </div>

              <div>
                <span
                  className={`font-display font-bold text-xs sm:text-sm block truncate ${
                    isSelected ? 'text-indigo-950' : 'text-slate-900'
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Product Results in Active Category */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900">
            {currentCategoryData.name} ({filteredProducts.length} items)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
