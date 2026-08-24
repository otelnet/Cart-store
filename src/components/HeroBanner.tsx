import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Clock, Zap, ShieldCheck, Truck, Sparkles, Tag, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, applyPromoCode, setCurrentTab, showToast, regionConfig, t } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-temu-1',
      badge: '⚡ Flash Deals • Up to 90% Off',
      title: 'Global Super Sale & Direct Factory Deals',
      subtitle: `Fast doorstep dispatch to ${regionConfig.name} and 190+ countries. Bluetooth gadgets, sneakers, solar energy & smart home tech.`,
      ctaText: 'Shop Lightning Deals',
      category: 'electronics',
      promoCode: 'CARTNOVA',
      bgColor: 'from-orange-700 via-amber-700 to-rose-800',
      image: 'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'slide-temu-2',
      badge: '🇳🇬 Nigeria Mega Express Hub',
      title: 'Top Rated Best Sellers in Nigeria',
      subtitle: 'Solar flood lights, emergency power blenders, luxury watches and trendy fashion direct to Lagos, Abuja & nationwide.',
      ctaText: 'Explore Nigeria Favorites',
      category: 'nigeria',
      promoCode: 'NAIJA10',
      bgColor: 'from-emerald-950 via-slate-900 to-amber-950',
      image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'slide-temu-3',
      badge: '🚚 100% Free Express Shipping',
      title: 'Free Shipping + 90-Day Free Returns',
      subtitle: 'Shop with full escrow buyer protection. Price adjustment guarantee within 30 days if prices drop.',
      ctaText: 'Claim Free Shipping',
      promoCode: 'FREESHIP',
      bgColor: 'from-slate-950 via-indigo-950 to-orange-950',
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  const handleAction = () => {
    if (slide.promoCode) {
      applyPromoCode(slide.promoCode);
    }
    if (slide.category) {
      setSelectedCategory(slide.category);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200/80 bg-slate-950 text-white mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className={`relative bg-gradient-to-br ${slide.bgColor} p-6 sm:p-8 md:p-10 min-h-[260px] sm:min-h-[290px] flex flex-col justify-between`}
        >
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay overflow-hidden pointer-events-none">
            <img
              src={slide.image}
              alt="Background"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black mb-3 backdrop-blur-xs border border-white/20">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{slide.badge}</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight mb-2 text-white">
              {slide.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 sm:line-clamp-3 mb-5 leading-relaxed max-w-lg">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAction}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-950/40 transition-all active:scale-95 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentTab('deals')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-xs transition-colors cursor-pointer"
              >
                {t('flashDeals')} & Coupons
              </button>
            </div>
          </div>

          {/* Slider controls & badges */}
          <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-4 text-[11px] sm:text-xs">
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <Truck className="w-3.5 h-3.5" /> Direct Express Dispatch to {regionConfig.flag} {regionConfig.name}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CartNova Purchase Protection
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-6 bg-orange-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
