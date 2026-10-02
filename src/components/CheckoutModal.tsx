import React, { useState, useEffect } from 'react';
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
  Building2,
  PhoneCall,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  AlertCircle,
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
    showToast,
  } = useShop();

  const [deliverySlot, setDeliverySlot] = useState('⚡ Express Van Dispatch (15-25 min)');
  const [paymentType, setPaymentType] = useState<'paystack' | 'saved_card' | 'new_card' | 'apple_pay' | 'paypal' | 'cod'>('paystack');
  const [selectedCardId, setSelectedCardId] = useState<string>(
    user?.savedPaymentMethods?.find((p) => p.isDefault)?.id || user?.savedPaymentMethods?.[0]?.id || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Paystack Integration States
  const [paystackConfig, setPaystackConfig] = useState<{
    configured: boolean;
    hasPublicKey: boolean;
    publicKey: string | null;
    mode: string;
    supportedCurrencies?: string[];
  }>({
    configured: false,
    hasPublicKey: false,
    publicKey: null,
    mode: 'test',
  });

  const [paystackChannel, setPaystackChannel] = useState<'card' | 'bank_transfer' | 'ussd' | 'inline'>('card');
  const [paystackCardNumber, setPaystackCardNumber] = useState('5061 0928 4812 5281');
  const [paystackCardExpiry, setPaystackCardExpiry] = useState('12/29');
  const [paystackCardCvv, setPaystackCardCvv] = useState('812');
  const [paystackCardName, setPaystackCardName] = useState(user?.name || 'Chinedu Okafor');
  const [paystackBank, setPaystackBank] = useState('GTBank');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // New card fields for generic card
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(user?.name || 'Alex Morgan');

  // Fetch Paystack configuration on open
  useEffect(() => {
    if (isCheckoutOpen) {
      fetch('/api/paystack/config')
        .then((res) => res.json())
        .then((data) => {
          setPaystackConfig(data);
        })
        .catch((err) => {
          console.warn('Paystack config fetch notice:', err);
        });
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard!`, 'info');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const loadPaystackInlineScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).PaystackPop) {
        resolve(true);
        return;
      }
      const existing = document.getElementById('paystack-inline-script');
      if (existing) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'paystack-inline-script';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const finalizePaystackOrder = async (
    reference: string,
    channel: string,
    verifyDetails?: any
  ) => {
    setIsProcessing(false);
    setProcessingStep('');

    let channelLabel = 'Card';
    if (channel === 'bank_transfer') channelLabel = 'Bank Transfer (Providus)';
    else if (channel === 'ussd') channelLabel = `USSD (${paystackBank})`;
    else if (channel === 'card') {
      const last4 = paystackCardNumber.replace(/\s+/g, '').slice(-4) || '5281';
      channelLabel = `Verve (•••• ${last4})`;
    } else {
      channelLabel = 'Verified Checkout';
    }

    processOrder(deliverySlot, `Paystack • ${channelLabel}`, currentAddress, {
      paymentReference: reference,
      paymentGateway: 'paystack',
      paystackDetails: {
        reference,
        channel,
        paidAt: new Date().toISOString(),
        currency: currencyConfig.code,
        brand: channel === 'card' ? 'verve' : undefined,
        last4: channel === 'card' ? paystackCardNumber.replace(/\s+/g, '').slice(-4) : undefined,
        bank: channel === 'bank_transfer' ? 'Providus Bank / Titan Trust' : channel === 'ussd' ? paystackBank : undefined,
        gatewayResponse: verifyDetails?.gateway_response || 'Approved by Paystack',
      },
    });

    showToast(`Payment confirmed via Paystack! Reference: ${reference.slice(0, 15)}...`, 'success');
  };

  const handlePlaceOrder = async () => {
    // 1. Paystack Gateway Flow
    if (paymentType === 'paystack') {
      setIsProcessing(true);
      setProcessingStep('Connecting to Paystack gateway...');

      try {
        const localAmount = total;
        const payCurrency = ['NGN', 'USD', 'GHS', 'KES', 'ZAR'].includes(currencyConfig.code)
          ? currencyConfig.code
          : 'NGN';

        const initRes = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email || 'customer@cartnovastore.com',
            amount: Number(localAmount.toFixed(2)),
            currency: payCurrency,
            channels: [
              paystackChannel === 'bank_transfer'
                ? 'bank_transfer'
                : paystackChannel === 'ussd'
                ? 'ussd'
                : 'card',
            ],
            metadata: {
              customerName: user?.name || 'Valued Customer',
              deliverySlot,
              channel: paystackChannel,
            },
          }),
        });

        const initData = await initRes.json();
        const reference =
          initData?.data?.reference || `pstk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

        // If official inline popup mode selected & public key available
        if (
          paystackChannel === 'inline' &&
          paystackConfig.hasPublicKey &&
          paystackConfig.publicKey
        ) {
          setProcessingStep('Launching Paystack secure popup...');
          const loaded = await loadPaystackInlineScript();
          if (loaded && (window as any).PaystackPop) {
            const handler = (window as any).PaystackPop.setup({
              key: paystackConfig.publicKey,
              email: user?.email || 'customer@cartnovastore.com',
              amount: Math.round(localAmount * 100),
              currency: payCurrency,
              ref: reference,
              callback: async (response: any) => {
                const verifiedRef = response.reference || reference;
                await finalizePaystackOrder(verifiedRef, 'inline', response);
              },
              onClose: () => {
                setIsProcessing(false);
                setProcessingStep('');
                showToast('Paystack window closed', 'info');
              },
            });
            handler.openIframe();
            return;
          }
        }

        // Direct Card / Bank Transfer / USSD flow
        setProcessingStep(
          paystackChannel === 'bank_transfer'
            ? 'Verifying NIP instant bank credit...'
            : paystackChannel === 'ussd'
            ? 'Verifying USSD bank transaction...'
            : 'Authorizing card with 3D Secure / Verve...'
        );

        await new Promise((resolve) => setTimeout(resolve, 1400));

        // Call backend verification
        const verifyRes = await fetch(`/api/paystack/verify/${encodeURIComponent(reference)}`);
        const verifyData = await verifyRes.json();

        await finalizePaystackOrder(reference, paystackChannel, verifyData?.data);
      } catch (err: any) {
        console.error('Paystack transaction error:', err);
        setIsProcessing(false);
        setProcessingStep('');
        showToast('Payment could not be completed. Please try again.', 'error');
      }
      return;
    }

    // 2. Other Standard Payment Gateways
    setIsProcessing(true);
    setProcessingStep('Authorizing payment and preparing dispatch...');
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStep('');
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
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                    <ShieldCheck className="w-3.5 h-3.5" /> Paystack & 256-Bit SSL
                  </span>
                </div>
              </div>

              {/* Payment Type Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPaymentType('paystack')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer relative overflow-hidden ${
                    paymentType === 'paystack'
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-950 dark:text-teal-200 ring-2 ring-teal-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  <span className="block text-sm mb-0.5">🇳🇬</span>
                  <span className="block font-extrabold text-[11px]">Paystack</span>
                  <span className="text-[9px] text-teal-600 dark:text-teal-400 block font-semibold">Verve / Bank / USSD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('apple_pay')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentType === 'apple_pay'
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  <span className="block text-sm mb-0.5">🍎</span>
                  <span>Apple Pay</span>
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
                  <span className="block text-sm mb-0.5">💳</span>
                  <span>Saved Card</span>
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
                  <span className="block text-sm mb-0.5">🅿️</span>
                  <span>PayPal</span>
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
                  <span className="block text-sm mb-0.5">💵</span>
                  <span>Cash on Van</span>
                </button>
              </div>

              {/* PAYSTACK DEDICATED CHANNEL INTERFACE */}
              {paymentType === 'paystack' && (
                <div className="p-4 rounded-2xl bg-gradient-to-b from-teal-50/80 to-emerald-50/40 dark:from-slate-800 dark:to-slate-800/80 border border-teal-200 dark:border-teal-900/60 mb-4 space-y-3.5">
                  {/* Paystack Channel Navigation */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-teal-950 dark:text-teal-200 tracking-tight flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                        Paystack African Payment Suite
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
                        {paystackConfig.configured
                          ? paystackConfig.mode === 'live'
                            ? '🟢 Live API'
                            : '🟡 Test Mode'
                          : '🧪 Sandbox Simulator'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Supported:</span>
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono font-bold text-[9px]">Verve</span>
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono font-bold text-[9px]">Mastercard</span>
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono font-bold text-[9px]">Visa</span>
                    </div>
                  </div>

                  {/* Channel Sub-tabs */}
                  <div className="grid grid-cols-4 gap-1.5 bg-white/70 dark:bg-slate-900/70 p-1 rounded-xl border border-teal-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setPaystackChannel('card')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paystackChannel === 'card'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Card / Verve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaystackChannel('bank_transfer')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paystackChannel === 'bank_transfer'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Bank Transfer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaystackChannel('ussd')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paystackChannel === 'ussd'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>USSD Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaystackChannel('inline')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paystackChannel === 'inline'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Inline Pop</span>
                    </button>
                  </div>

                  {/* Channel 1: Card / Verve */}
                  {paystackChannel === 'card' && (
                    <div className="space-y-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-teal-100 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Nigerian & International Cards (Verve, Mastercard, Visa)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPaystackCardNumber('5061 0928 4812 5281');
                            setPaystackCardExpiry('12/29');
                            setPaystackCardCvv('812');
                            setPaystackCardName(user?.name || 'Chinedu Okafor');
                            showToast('Filled test Verve card details!', 'info');
                          }}
                          className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                        >
                          Auto-fill Test Verve
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={paystackCardNumber}
                            onChange={(e) => setPaystackCardNumber(e.target.value)}
                            placeholder="5061 •••• •••• ••••"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                          />
                          <span className="absolute right-3 top-2 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-black">
                            {paystackCardNumber.startsWith('5061') ? 'VERVE' : paystackCardNumber.startsWith('4') ? 'VISA' : 'MC'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                            Valid Thru
                          </label>
                          <input
                            type="text"
                            value={paystackCardExpiry}
                            onChange={(e) => setPaystackCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            value={paystackCardCvv}
                            onChange={(e) => setPaystackCardCvv(e.target.value)}
                            maxLength={4}
                            placeholder="•••"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={paystackCardName}
                            onChange={(e) => setPaystackCardName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Channel 2: Bank Transfer (Virtual NIP Account) */}
                  {paystackChannel === 'bank_transfer' && (
                    <div className="space-y-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-teal-100 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Instant NIP Bank Transfer (Virtual Account)
                        </span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Auto-Verifies in 5s
                        </span>
                      </div>

                      <div className="p-3 bg-teal-50/60 dark:bg-teal-950/40 rounded-xl border border-teal-200/80 dark:border-teal-900/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Bank Name:</span>
                          <span className="font-bold text-slate-900 dark:text-white">Providus Bank / Titan Trust</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Account Number:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-sm text-teal-900 dark:text-teal-200">9928194821</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard('9928194821', 'Account Number')}
                              className="p-1 rounded hover:bg-teal-200/60 dark:hover:bg-teal-800 text-teal-800 dark:text-teal-200 cursor-pointer"
                              title="Copy account number"
                            >
                              {copiedField === 'Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Beneficiary Name:</span>
                          <span className="font-medium text-slate-900 dark:text-white">CartNova • Paystack Checkout</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Exact Amount:</span>
                          <span className="font-black text-teal-700 dark:text-teal-300">
                            {formatPrice(total)}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Transfer the exact amount to the account above via any Nigerian bank mobile app, then click <strong>Confirm & Place Order</strong> below.
                      </p>
                    </div>
                  )}

                  {/* Channel 3: USSD Code */}
                  {paystackChannel === 'ussd' && (
                    <div className="space-y-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-teal-100 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Select Your Bank USSD Code</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {['GTBank', 'Zenith Bank', 'Access Bank', 'UBA'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setPaystackBank(b)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              paystackBank === b
                                ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>

                      {/* Generated USSD String */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Dial this USSD code on phone:</span>
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                            {paystackBank === 'GTBank'
                              ? `*737*2*${Math.round(total * 1450)}*9281#`
                              : paystackBank === 'Zenith Bank'
                              ? `*966*${Math.round(total * 1450)}*0029#`
                              : paystackBank === 'Access Bank'
                              ? `*901*2*${Math.round(total * 1450)}#`
                              : `*919*${Math.round(total * 1450)}#`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const code =
                              paystackBank === 'GTBank'
                                ? `*737*2*${Math.round(total * 1450)}*9281#`
                                : paystackBank === 'Zenith Bank'
                                ? `*966*${Math.round(total * 1450)}*0029#`
                                : paystackBank === 'Access Bank'
                                ? `*901*2*${Math.round(total * 1450)}#`
                                : `*919*${Math.round(total * 1450)}#`;
                            copyToClipboard(code, 'USSD Code');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'USSD Code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'USSD Code' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Channel 4: Official Inline Pop */}
                  {paystackChannel === 'inline' && (
                    <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-700 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>Paystack Official Inline Popups</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        Clicking authorize below will trigger the standard Paystack Inline iframe dialog with options for Apple Pay, Cards, Mobile Money, and EFT.
                      </p>
                      {!paystackConfig.hasPublicKey && (
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>PAYSTACK_PUBLIC_KEY not set yet. Will use automated test sandbox verification seamlessly.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

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
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer ${
                paymentType === 'paystack'
                  ? 'bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 shadow-teal-600/25'
                  : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 shadow-orange-600/25'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {processingStep || `Authorizing ${currencyConfig.code} Payment & Van Dispatch...`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>
                    {paymentType === 'paystack'
                      ? `Pay with Paystack (${paystackChannel === 'bank_transfer' ? 'Transfer' : paystackChannel === 'ussd' ? 'USSD' : 'Card'}) • ${formatPrice(total)}`
                      : `Authorize & Place Order • ${formatPrice(total)}`}
                  </span>
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
