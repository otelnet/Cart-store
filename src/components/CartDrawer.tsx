import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  Truck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    serviceFee,
    discount,
    tip,
    setTip,
    total,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen,
    setPickerNote,
    formatPrice,
    currencyConfig,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  const startEditNote = (productId: string, currentNote?: string) => {
    setEditingNoteId(productId);
    setNoteText(currentNote || '');
  };

  const saveNote = (productId: string) => {
    setPickerNote(productId, noteText);
    setEditingNoteId(null);
  };

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsCartOpen(false)}
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Your Cart
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} fresh items • {currencyConfig.code}
                </span>
              </div>
            </div>

            <button
              id="close-cart-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-4 py-3 bg-emerald-50/80 border-b border-emerald-100 text-xs">
            {amountNeededForFreeDelivery > 0 && !appliedPromo?.discountType.includes('free') ? (
              <div>
                <div className="flex items-center justify-between font-semibold text-emerald-950 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Add <strong className="text-emerald-700 font-bold">{formatPrice(amountNeededForFreeDelivery)}</strong> for FREE Express Delivery</span>
                  </span>
                  <span>{freeDeliveryProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-200/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You unlocked FREE Express Delivery! 🎉</span>
              </div>
            )}
          </div>

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 mb-1">
                  Your cart is empty
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5">
                  Explore fresh organic produce, sourdough bakery, and chef-prepped meal kits on CartNova.
                </p>
                <button
                  id="empty-cart-shop-now"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  id={`cart-item-${item.product.id}`}
                  className="pt-3 first:pt-0 flex gap-3 items-start"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {item.product.name}
                        </h5>
                        <span className="text-[11px] text-slate-500 block">
                          {formatPrice(item.product.price)} / {item.product.unit}
                        </span>
                      </div>
                      <span className="font-display font-extrabold text-sm text-slate-900 shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                    {/* Picker Note Section */}
                    {editingNoteId === item.product.id ? (
                      <div className="mt-2 flex items-center gap-1.5">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="e.g. 'Ripe avocados'"
                          className="flex-1 px-2 py-1 text-xs border rounded-lg focus:border-emerald-500 outline-none"
                        />
                        <button
                          onClick={() => saveNote(item.product.id)}
                          className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        {item.pickerNote ? (
                          <span
                            onClick={() => startEditNote(item.product.id, item.pickerNote)}
                            className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer truncate max-w-[170px]"
                            title="Click to edit note"
                          >
                            📝 Note: {item.pickerNote}
                          </span>
                        ) : (
                          <button
                            onClick={() => startEditNote(item.product.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3 h-3" /> Add note
                          </button>
                        )}
                      </div>
                    )}

                    {/* Stepper and Delete */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Promo Code Input Box */}
            {cart.length > 0 && (
              <div className="pt-4">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo Code (e.g. CARTNOVA20)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 uppercase tracking-wider outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{promoError}</p>
                )}

                {appliedPromo && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <span className="font-semibold">
                      🎟️ {appliedPromo.code}: {appliedPromo.description}
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-rose-600 hover:text-rose-800 font-bold ml-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Courier Tip Selector */}
            {cart.length > 0 && (
              <div className="pt-3">
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Courier Appreciation Tip 💚
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2.0, 3.5, 5.0, 0].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTip(amount)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        tip === amount
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {amount === 0 ? 'No Tip' : formatPrice(amount)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Price Breakdown */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging & Service Fee</span>
                  <span className="font-semibold text-slate-900">{formatPrice(serviceFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Driver Tip</span>
                    <span>{formatPrice(tip)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-extrabold text-slate-950">
                  <span>Total Amount</span>
                  <span className="text-emerald-700">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                id="checkout-proceed-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer"
              >
                <span>Checkout Now</span>
                <div className="flex items-center gap-1.5">
                  <span>{formatPrice(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
