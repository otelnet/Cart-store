import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { DeliveryAddress } from '../types';
import {
  X,
  MapPin,
  Navigation,
  CheckCircle2,
  Building,
  Home,
  Sparkles,
  Phone,
  User,
  Key,
  Truck,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UpdateOrderAddressModal: React.FC = () => {
  const {
    isUpdateOrderAddressModalOpen,
    closeUpdateOrderAddress,
    activeUpdateAddressOrderId,
    orders,
    savedAddresses,
    updateOrderAddress,
    showToast,
  } = useShop();

  const order = orders.find((o) => o.id === activeUpdateAddressOrderId) || orders.find((o) => o.status !== 'delivered') || orders[0];

  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [instructions, setInstructions] = useState('');
  const [landmark, setLandmark] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (order) {
      setTitle(order.address.title || 'Current Delivery Location');
      setStreet(order.address.street || '');
      setApartment(order.address.apartment || '');
      setCity(order.address.city || '');
      setPostalCode(order.address.postalCode || '');
      setCountry(order.address.country || 'Nigeria');
      setInstructions(order.address.instructions || '');
      setLandmark(order.address.landmark || '');
      setRecipientName(order.address.recipientName || 'Alex Morgan');
      setRecipientPhone(order.address.recipientPhone || '+234 (802) 555-0199');
    }
  }, [order, isUpdateOrderAddressModalOpen]);

  if (!isUpdateOrderAddressModalOpen || !order) return null;

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setStreet(`GPS Pinpoint: Lat ${latitude.toFixed(4)}, Long ${longitude.toFixed(4)}`);
        setInstructions((prev) =>
          prev ? `${prev} (GPS Geolocation Verified)` : 'Deliver to exact GPS coordinates provided'
        );
        showToast('Exact GPS coordinates captured!', 'success');
      },
      (err) => {
        setIsLocating(false);
        showToast('Unable to retrieve location. Please type manually.', 'info');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectSaved = (addr: DeliveryAddress) => {
    setTitle(addr.title);
    setStreet(addr.street);
    setApartment(addr.apartment || '');
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setCountry(addr.country || 'Nigeria');
    setInstructions(addr.instructions || '');
    setLandmark(addr.landmark || '');
    setRecipientName(addr.recipientName || recipientName);
    setRecipientPhone(addr.recipientPhone || recipientPhone);
    showToast(`Loaded ${addr.title} address`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) {
      showToast('Please enter a valid street address', 'error');
      return;
    }

    const updatedAddr: DeliveryAddress = {
      id: order.address.id || `addr-upd-${Date.now()}`,
      title: title || 'Updated Delivery Address',
      street: street.trim(),
      apartment: apartment.trim() || undefined,
      city: city.trim() || order.address.city,
      postalCode: postalCode.trim() || order.address.postalCode,
      country: country.trim() || order.address.country,
      instructions: instructions.trim() || undefined,
      landmark: landmark.trim() || undefined,
      recipientName: recipientName.trim() || undefined,
      recipientPhone: recipientPhone.trim() || undefined,
    };

    updateOrderAddress(order.id, updatedAddr);
    closeUpdateOrderAddress();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 35, scale: 0.96 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-white leading-tight">
                  Send / Update Delivery Address
                </h3>
                <span className="text-xs text-emerald-100">
                  Transmits live drop-off location directly to Dispatch Van #{order.orderNumber}
                </span>
              </div>
            </div>

            <button
              id="close-update-address-btn"
              onClick={closeUpdateOrderAddress}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1">
            {/* Quick Pick From Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Quick Select from Saved Addresses
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectSaved(addr)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{addr.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GPS Geolocation Auto-Fill Button */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                    Use GPS Coordinates Pin
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Auto-detects current device location for driver navigation
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                {isLocating ? 'Locating...' : '📍 Use GPS'}
              </button>
            </div>

            {/* Street Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            {/* Apartment / Suite & Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Apt, Suite, Gate or Unit #
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="e.g. Block B, Apt 302"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nearby Landmark / Visual Clue
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Domino Pizza / Blue gate"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* City & Postal Code */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City / State</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lagos State"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Postal Code / Country</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 105102"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Gate Code & Drop-off Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Gate / Buzzer Code & Drop-off Instructions</span>
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Gate code #4012. Ring buzzer or leave package with estate security gate."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            {/* Recipient Contact Information for Courier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recipient Name</span>
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recipient Phone</span>
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="e.g. +234 (802) 555-0199"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                id="save-and-send-address-btn"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Address to Dispatch Driver ({order.driver.name.split(' ')[0]})</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
