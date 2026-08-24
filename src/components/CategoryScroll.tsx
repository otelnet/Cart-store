import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/mockData';
import {
  Sparkles,
  Smartphone,
  Shirt,
  Home,
  UtensilsCrossed,
  Sparkles as BeautyIcon,
  Flag,
  Apple,
  Zap,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Smartphone,
  Shirt,
  Home,
  UtensilsCrossed,
  BeautyIcon,
  Flag,
  Apple,
  Zap,
};

export const CategoryScroll: React.FC = () => {
  const { selectedCategory, setSelectedCategory, t } = useShop();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h3 className="font-display font-black text-base sm:text-lg text-slate-900">
          {t('exploreCategories')}
        </h3>
        <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline">
          {CATEGORIES.length} Hot Categories
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 border cursor-pointer ${
                isSelected
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-orange-600'}`} />
              <span>{cat.name}</span>
              {cat.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                    isSelected
                      ? 'bg-orange-900 text-orange-100'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
