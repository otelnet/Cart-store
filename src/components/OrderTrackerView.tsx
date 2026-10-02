import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import {
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Store,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Receipt,
  FileCheck,
  Zap,
  Truck,
  Navigation,
  Key,
  User,
  Star,
  ExternalLink,
  Edit3,
  Check,
  Copy,
} from 'lucide-react';
import { motion } from 'motion/react';

interface OrderTrackerViewProps {
  orderId?: string | null;
  onBack?: () => void;
}

export const OrderTrackerView: React.FC<OrderTrackerViewProps> = ({ orderId, onBack }) => {
  const {
    orders,
    trackingOrderId,
    closeOrderTracker,
    simulateNextOrderStatus,
    reorder,
    openDriverContact,
    openUpdateOrderAddress,
    showToast,
    formatPrice,
  } = useShop();

  const [copiedPlate, setCopiedPlate] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const copyRef = (refText: string) => {
    navigator.clipboard.writeText(refText);
    setCopiedRef(true);
    showToast('Copied Paystack reference!', 'info');
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const targetId = orderId || trackingOrderId;
  const order = orders.find((o) => o.id === targetId) || orders[0];

  if (!order) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        <p className="text-slate-500 dark:text-slate-400">No active order found.</p>
        <button
          onClick={onBack || closeOrderTracker}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const driver = order.driver;

  const statusProgressMap: Record<string, number> = {
    confirmed: 20,
    picking: 45,
    packed: 70,
    on_the_way: 85,
    delivered: 100,
  };

  const currentProgress = statusProgressMap[order.status] || 50;

  const copyPlate = () => {
    navigator.clipboard.writeText(driver.plateNumber);
    setCopiedPlate(true);
    showToast(`License plate ${driver.plateNumber} copied!`, 'success');
    setTimeout(() => setCopiedPlate(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-slate-900 dark:text-slate-100">
      {/* Header with Back and Order Number */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="order-tracker-back-btn"
          onClick={onBack || closeOrderTracker}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Order #{order.orderNumber}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              order.status === 'delivered'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                : 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
            }`}
          >
            {order.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/20 text-xs font-semibold text-orange-100">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Live Van Dispatch Tracking</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="send-address-top-btn"
                onClick={() => openUpdateOrderAddress(order.id)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Update Address</span>
              </button>

              {order.status !== 'delivered' && (
                <button
                  id="simulate-next-step-btn"
                  onClick={() => simulateNextOrderStatus(order.id)}
                  className="px-3 py-1 bg-slate-900/80 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-amber-400/40"
                  title="Advance order delivery status for live preview demonstration"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Next Step</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              {order.status === 'delivered'
                ? 'Order Delivered Successfully 🎉'
                : `Estimated Delivery: ${order.estimatedDeliveryTime}`}
            </h2>
            <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-lg">
              {order.status === 'on_the_way'
                ? `Van Driver ${driver.name} is in transit in the ${driver.vanModel || driver.vehicle} (${driver.plateNumber}).`
                : order.status === 'picking'
                ? `Hub Specialist ${order.shopper.name} is inspecting and testing all ordered items.`
                : order.status === 'packed'
                ? 'Items are sealed in shockproof packaging and assigned to the dispatch van.'
                : 'Order received and being queued at the regional fulfillment center.'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-orange-100 font-semibold">
              <span>Fulfillment & Dispatch Progress</span>
              <span>{currentProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-amber-300 via-yellow-200 to-white rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Driver Contact & Live Map Radar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Simulated Map & Van Driver Contact */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                Live Dispatch Van Radar
              </h4>
            </div>
            <span className="text-xs text-orange-700 dark:text-orange-300 font-semibold bg-orange-50 dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
              {order.status === 'delivered' ? 'Delivery Completed' : `GPS Active • ~${driver.etaMinutes} mins away`}
            </span>
          </div>

          {/* Map Graphic Canvas Mockup */}
          <div className="relative h-60 sm:h-64 bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-4">
            {/* Street Grid SVG Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-35 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            {/* Road path */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 60 180 Q 180 80, 280 140 T 480 60"
                fill="none"
                stroke="#f97316"
                strokeWidth="5"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>

            {/* Hub Location Marker */}
            <div className="absolute left-6 bottom-6 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800">
                <Store className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-[10px] font-bold bg-white/90 dark:bg-slate-800/90 px-1.5 py-0.5 rounded shadow-xs mt-1 text-slate-800 dark:text-slate-200">
                CartNova Hub
              </span>
            </div>

            {/* Live Van Courier Moving Marker */}
            <motion.div
              animate={{
                x: order.status === 'delivered' ? 140 : [0, 8, 0],
                y: order.status === 'delivered' ? -60 : [0, -4, 0],
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute flex flex-col items-center z-10"
              style={{ left: `${Math.min(78, 25 + currentProgress * 0.55)}%`, top: '42%' }}
            >
              <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-xl border-2 border-white dark:border-slate-800 ring-4 ring-orange-400/30">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded-full shadow-md mt-1 whitespace-nowrap">
                Van: {driver.plateNumber}
              </span>
            </motion.div>

            {/* Delivery Destination Pin */}
            <div className="absolute right-6 top-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded shadow-xs mt-1 text-slate-800 dark:text-slate-200 max-w-[120px] truncate text-center">
                {order.address.title || order.address.street}
              </span>
            </div>
          </div>

          {/* Courier Van Driver Profile & Direct Action Card */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md ring-2 ring-orange-500/20"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    {driver.name}
                  </h5>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[11px] font-extrabold text-amber-700 dark:text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {driver.rating}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Truck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  <span>{driver.vanModel || driver.vehicle}</span>
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={copyPlate}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>{driver.plateNumber}</span>
                    {copiedPlate ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>

                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Verified Courier
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Driver Contact Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="contact-driver-voice-btn"
                onClick={() => openDriverContact(order.id)}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Call Driver</span>
              </button>

              <button
                id="contact-driver-msg-btn"
                onClick={() => openDriverContact(order.id)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Van Driver</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tracking Timeline & Address Details Column */}
        <div className="space-y-6">
          {/* Active Delivery Address Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Drop-off Address
                </h4>
              </div>

              <button
                id="edit-order-address-btn"
                onClick={() => openUpdateOrderAddress(order.id)}
                className="px-2.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change / Send Address</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{order.address.title || 'Delivery Destination'}</span>
                {order.address.apartment && (
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Apt: {order.address.apartment}
                  </span>
                )}
              </div>

              <p className="text-slate-700 dark:text-slate-300 font-medium">{order.address.street}</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order.address.city}, {order.address.postalCode} {order.address.country ? `• ${order.address.country}` : ''}
              </p>

              {order.address.landmark && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold pt-1">
                  📍 Landmark: {order.address.landmark}
                </p>
              )}

              {order.address.instructions && (
                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1">
                  <Key className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                  <span>{order.address.instructions}</span>
                </div>
              )}

              {order.address.recipientPhone && (
                <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Recipient: {order.address.recipientName || 'Alex Morgan'} ({order.address.recipientPhone})</span>
                </div>
              )}
            </div>

            <button
              onClick={() => openUpdateOrderAddress(order.id)}
              className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Send New Address / GPS Pin to Van Driver</span>
            </button>
          </div>

          {/* Timeline Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
              Dispatch Timeline Updates
            </h4>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {order.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${
                      step.completed
                        ? 'border-orange-600 bg-orange-600 text-white'
                        : step.current
                        ? 'border-amber-500 bg-amber-500 text-white animate-pulse'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between gap-1">
                      <span
                        className={`text-xs font-bold leading-tight ${
                          step.completed
                            ? 'text-slate-900 dark:text-white'
                            : step.current
                            ? 'text-orange-600 dark:text-orange-400 font-extrabold'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{step.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items Summary & Receipt Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
          <div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Purchased Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Payment via {order.paymentMethod}
              </span>
              {(order.paymentGateway === 'paystack' || order.paymentReference) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>Paystack Verified</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openDriverContact(order.id)}
              className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Driver Chat</span>
            </button>

            <button
              id="reorder-btn"
              onClick={() => reorder(order)}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-Order Basket</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {order.items.map((item) => (
            <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h6 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.product.name}
                  </h6>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatPrice(item.product.price)} × {item.quantity} {item.product.unit}
                  </span>
                  {item.pickerNote && (
                    <span className="block text-[10px] text-orange-600 dark:text-orange-400 font-medium mt-0.5">
                      Note: {item.pickerNote}
                    </span>
                  )}
                </div>
              </div>

              <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Bill Summary */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Van Dispatch Fee</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service & Packaging</span>
            <span>{formatPrice(order.serviceFee)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Promo Discount ({order.promoCodeApplied || 'Discount'})</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          {order.tip > 0 && (
            <div className="flex justify-between">
              <span>Van Driver Tip</span>
              <span>{formatPrice(order.tip)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm sm:text-base font-extrabold text-slate-950 dark:text-white">
            <span>Total Paid</span>
            <span className="text-orange-600 dark:text-orange-400 font-black">{formatPrice(order.total)}</span>
          </div>

          {/* Paystack Gateway Transaction Receipt Box */}
          {(order.paymentGateway === 'paystack' || order.paymentReference) && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 bg-teal-50/70 dark:bg-slate-900/80 p-3 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-extrabold text-xs text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Paystack Gateway Verification</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-600 text-white font-mono text-[10px] font-bold">
                  {order.paymentStatus?.toUpperCase() || 'PAID & SETTLED'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                    Transaction Reference
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {order.paymentReference || order.paystackDetails?.reference || 'N/A'}
                    </span>
                    {(order.paymentReference || order.paystackDetails?.reference) && (
                      <button
                        onClick={() => copyRef(order.paymentReference || order.paystackDetails?.reference || '')}
                        className="p-1 rounded hover:bg-teal-200/50 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 cursor-pointer"
                        title="Copy Reference"
                      >
                        {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                    Payment Channel
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white capitalize">
                    {order.paystackDetails?.channel || 'Online Checkout'}{' '}
                    {order.paystackDetails?.bank ? `(${order.paystackDetails.bank})` : ''}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
