import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  MapPin,
  Plus,
  CheckCircle2,
  Home,
  Building,
  Navigation,
  Key,
  User,
  Phone,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AddressPickerModal: React.FC = () => {
  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    savedAddresses,
    currentAddress,
    setCurrentAddress,
    addNewAddress,
    showToast,
  } = useShop();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newCity, setNewCity] = useState('Lagos State');
  const [newPostalCode, setNewPostalCode] = useState('105102');
  const [newCountry, setNewCountry] = useState('Nigeria');
  const [newLandmark, setNewLandmark] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('Alex Morgan');
  const [newRecipientPhone, setNewRecipientPhone] = useState('+234 (802) 555-0199');
  const [isLocating, setIsLocating] = useState(false);

  if (!isAddressModalOpen) return null;

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast('Geolocation is not supported in this browser', 'error');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setNewStreet(`GPS Pinpoint: Lat ${latitude.toFixed(4)}, Long ${longitude.toFixed(4)}`);
        setNewInstructions('Delivery to verified GPS device coordinates');
        showToast('Exact GPS coordinates captured!', 'success');
      },
      () => {
        setIsLocating(false);
        showToast('Unable to detect location automatically', 'info');
      },
      { timeout: 7000 }
    );
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) {
      showToast('Please enter a street address', 'error');
      return;
    }

    addNewAddress({
      title: newTitle,
      street: newStreet.trim(),
      apartment: newApartment.trim() || undefined,
      city: newCity.trim(),
      postalCode: newPostalCode.trim(),
      country: newCountry.trim(),
      landmark: newLandmark.trim() || undefined,
      instructions: newInstructions.trim() || undefined,
      recipientName: newRecipientName.trim() || undefined,
      recipientPhone: newRecipientPhone.trim() || undefined,
    });

    setIsAddingNew(false);
    setNewStreet('');
    setNewApartment('');
    setNewLandmark('');
    setNewInstructions('');
    setIsAddressModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  Delivery Address & Van Drop-off
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Select or save addresses for your dispatch orders
                </span>
              </div>
            </div>

            <button
              id="close-address-modal-btn"
              onClick={() => setIsAddressModalOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {!isAddingNew ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Saved Delivery Locations ({savedAddresses.length})
                  </span>
                  <button
                    id="add-new-address-toggle"
                    onClick={() => setIsAddingNew(true)}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Address
                  </button>
                </div>

                <div className="space-y-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = currentAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        id={`select-address-${addr.id}`}
                        onClick={() => {
                          setCurrentAddress(addr);
                          setIsAddressModalOpen(false);
                          showToast(`Selected "${addr.title}" delivery address`);
                        }}
                        className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-orange-600 dark:border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 ring-2 ring-orange-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${
                            isSelected
                              ? 'bg-orange-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {addr.title.toLowerCase().includes('home') ? (
                              <Home className="w-4 h-4" />
                            ) : (
                              <Building className="w-4 h-4" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                              <span>{addr.title}</span>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="text-slate-800 dark:text-slate-200 font-medium">
                              {addr.street} {addr.apartment ? `• ${addr.apartment}` : ''}
                            </p>

                            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                              {addr.city}, {addr.postalCode} {addr.country ? `• ${addr.country}` : ''}
                            </p>

                            {addr.landmark && (
                              <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                                📍 Landmark: {addr.landmark}
                              </p>
                            )}

                            {addr.instructions && (
                              <p className="text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-1">
                                <Key className="w-3 h-3 text-amber-500 shrink-0" />
                                <span>{addr.instructions}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveNewAddress} className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Add New Delivery Address
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* GPS Auto-fill */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-pulse" />
                    <span className="text-xs font-bold text-orange-900 dark:text-orange-200">
                      Auto-detect Location Pin
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isLocating ? 'Locating...' : '📍 Use GPS'}
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Address Label
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['Home', 'Office', 'Family', 'Warehouse', 'Other'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setNewTitle(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
                          newTitle === t
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/30 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Apt / Suite / Gate #
                    </label>
                    <input
                      type="text"
                      value={newApartment}
                      onChange={(e) => setNewApartment(e.target.value)}
                      placeholder="e.g. Apt 4B, Gate 2"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/30 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Landmark Clue
                    </label>
                    <input
                      type="text"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      placeholder="e.g. Opposite Domino Pizza"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/30 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Lagos State"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/30 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Postal Code / Country
                    </label>
                    <input
                      type="text"
                      value={newPostalCode}
                      onChange={(e) => setNewPostalCode(e.target.value)}
                      placeholder="105102"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/30 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Delivery Instructions for Van Courier
                  </label>
                  <textarea
                    rows={2}
                    value={newInstructions}
                    onChange={(e) => setNewInstructions(e.target.value)}
                    placeholder="e.g. Ring buzzer #401, leave package at door if not home."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/30 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={newRecipientName}
                      onChange={(e) => setNewRecipientName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/30 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Recipient Phone
                    </label>
                    <input
                      type="text"
                      value={newRecipientPhone}
                      onChange={(e) => setNewRecipientPhone(e.target.value)}
                      placeholder="+234 (802) 555-0199"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/30 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors mt-3 cursor-pointer"
                >
                  Save & Use Address for Orders
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
