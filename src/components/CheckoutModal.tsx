import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Plus,
  Lock,
  Globe,
  Sparkles,
  Truck,
  Key,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CurrencySelector } from './CurrencySelector';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    deliveryFee,
    serviceFee,
    discount,
    tip,
    setTip,
    total,
    currentAddress,
    savedAddresses,
    setCurrentAddress,
    setIsAddressModalOpen,
    processOrder,
    formatPrice,
    currencyConfig,
    user,
  } = useShop();

  const [deliverySlot, setDeliverySlot] = useState('⚡ Express Van Dispatch (15-25 min)');
  const [paymentType, setPaymentType] = useState<'saved_card' | 'new_card' | 'apple_pay' | 'paypal' | 'cod'>('apple_pay');
  const [selectedCardId, setSelectedCardId] = useState<string>(
    user?.savedPaymentMethods?.find((p) => p.isDefault)?.id || user?.savedPaymentMethods?.[0]?.id || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // New card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(user?.name || 'Alex Morgan');

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      let paymentLabel = 'Apple Pay / Digital Wallet';
      if (paymentType === 'saved_card') {
        const found = user?.savedPaymentMethods?.find((c) => c.id === selectedCardId);
        paymentLabel = found ? `${(found.brand || 'Card').toUpperCase()} •••• ${found.last4}` : 'Credit Card';
      } else if (paymentType === 'new_card') {
        const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4242';
        paymentLabel = `Visa ending in ${last4}`;
      } else if (paymentType === 'paypal') {
        paymentLabel = 'PayPal Express (Verified)';
      } else if (paymentType === 'cod') {
        paymentLabel = 'Cash on Delivery (Pay at Doorstep)';
      }

      processOrder(deliverySlot, paymentLabel, currentAddress);
    }, 1200);
  };

  const deliveryOptions = [
    {
      id: 'express',
      title: '⚡ Express Van Dispatch',
      time: '15-25 min',
      badge: 'Fastest',
      subtext: 'Items dispatched in climate-controlled Mercedes Sprinter van',
    },
    {
      id: 'evening',
      title: '🕒 Scheduled Evening Slot',
      time: '6:00 PM - 7:30 PM',
      subtext: 'Convenient delivery window after work hours',
    },
    {
      id: 'tomorrow',
      title: '☀️ Tomorrow Morning Dispatch',
      time: '8:00 AM - 9:30 AM',
      subtext: 'Fresh morning fulfillment right to your doorstep',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  CartNova Checkout & Dispatch
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  256-Bit SSL Encrypted • Multi-Currency Gateway
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CurrencySelector compact />
              <button
                id="close-checkout-btn"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
            {/* Step 1: Delivery Address */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>1. Delivery Address & Recipient</span>
                </h4>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Change / Add
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {savedAddresses.map((addr) => {
                  const isSelected = currentAddress.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setCurrentAddress(addr)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-orange-600 dark:border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                        <span>{addr.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 truncate font-medium">{addr.street}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                        {addr.city}, {addr.postalCode} {addr.country ? `• ${addr.country}` : ''}
                      </p>
                      {addr.landmark && (
                        <p className="text-[10px] text-amber-700 dark:text-amber-300 font-medium truncate mt-0.5">
                          📍 {addr.landmark}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Delivery Slot */}
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>2. Select Dispatch Window</span>
              </h4>

              <div className="space-y-2">
                {deliveryOptions.map((opt) => {
                  const isSelected = deliverySlot.includes(opt.time);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setDeliverySlot(`${opt.title} (${opt.time})`)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-orange-600 dark:border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{opt.title}</span>
                          {opt.badge && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-extrabold text-[10px]">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">{opt.subtext}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-orange-600 dark:text-orange-400 block">{opt.time}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 ml-auto mt-1" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>3. Payment Gateway ({currencyConfig.code})</span>
                </h4>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Stripe & Apple Pay Verified
                </span>
              </div>

              {/* Payment Type Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPaymentType('apple_pay')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentType === 'apple_pay'
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  🍎 Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('saved_card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentType === 'saved_card'
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  💳 Saved Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('paypal')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentType === 'paypal'
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  🅿️ PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('cod')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentType === 'cod'
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  💵 Cash on Van
                </button>
              </div>

              {/* Saved Card Selector */}
              {paymentType === 'saved_card' && user?.savedPaymentMethods && (
                <div className="space-y-2 mb-3">
                  {user.savedPaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedCardId(method.id)}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer ${
                        selectedCardId === method.id
                          ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/50 text-orange-900 dark:text-orange-200'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        <span className="font-bold uppercase">{method.brand} •••• {method.last4}</span>
                        <span className="text-slate-400">Exp {method.expiry}</span>
                      </div>
                      {selectedCardId === method.id && <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Van Driver Tip Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tip Van Dispatch Courier (100% goes to driver)
                </span>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{formatPrice(tip)}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 2.50, 4.00, 6.00].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTip(t)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      tip === t
                        ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/50 text-orange-900 dark:text-orange-200'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t === 0 ? 'No Tip' : formatPrice(t)}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h5 className="font-display font-bold text-xs text-slate-900 dark:text-white mb-2">
                Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </h5>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {cart.map((i) => (
                  <div
                    key={i.product.id}
                    className="flex items-center gap-2 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs shrink-0"
                  >
                    <img
                      src={i.product.image}
                      alt={i.product.name}
                      className="w-7 h-7 rounded object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                      {i.product.name}
                    </span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">x{i.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Footer Action */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>
                Total Amount ({currencyConfig.code}):
              </span>
              <span className="font-display font-black text-xl text-orange-600 dark:text-orange-400">
                {formatPrice(total)}
              </span>
            </div>

            <button
              id="confirm-place-order-btn"
              disabled={isProcessing}
              onClick={handlePlaceOrder}
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 active:scale-98 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing {currencyConfig.code} Payment & Van Dispatch...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Authorize & Place Order • {formatPrice(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
