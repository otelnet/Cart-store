import React from 'react';
import { useShop, TabType } from '../context/ShopContext';
import { Store, Layers, Tag, ClipboardList, ShoppingBag, Shield, Heart, Globe } from 'lucide-react';

interface BottomNavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: string;
  hasActiveDot?: boolean;
}

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, totalItemsCount, subtotal, activeOrder, setIsCartOpen, formatPrice, isAdmin, t } = useShop();

  const navItems: BottomNavItem[] = [
    { id: 'atlas_api', label: 'Atlas API', icon: Globe, badge: 'REST' },
    { id: 'discover', label: t('discover'), icon: Store },
    { id: 'categories', label: t('categories'), icon: Layers },
    { id: 'deals', label: t('flashDeals'), icon: Tag, badge: '-90%' },
    { id: 'orders', label: t('myOrders'), icon: ClipboardList, hasActiveDot: !!activeOrder },
    { id: 'favorites', label: t('favorites'), icon: Heart },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield, badge: 'Hub' });
  }

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => {
                setCurrentTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.hasActiveDot && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 text-[8px] font-black bg-orange-600 text-white rounded-full leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 max-w-[50px] truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Floating Quick Cart in Bottom Nav */}
        <button
          id="bottom-nav-cart-btn"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-2 text-slate-700 dark:text-slate-300 relative cursor-pointer"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-slate-950 text-white text-[9px] font-extrabold flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400 mt-0.5">
            {subtotal > 0 ? formatPrice(subtotal) : t('cart')}
          </span>
        </button>
      </div>
    </nav>
  );
};
