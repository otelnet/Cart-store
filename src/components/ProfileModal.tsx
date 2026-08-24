import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  User,
  MapPin,
  CreditCard,
  Crown,
  LogOut,
  Plus,
  Trash2,
  Shield,
  Edit2,
  Save,
  Check,
  Globe,
  Truck,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DietaryTag } from '../types';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    setIsAccountSwitcherOpen,
    user,
    logout,
    updateProfile,
    savedAddresses,
    addNewAddress,
    deleteAddress,
    setCurrentAddress,
    currentAddress,
    savePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    formatPrice,
    orders,
    setCurrentTab,
    isAdmin,
    setIsRegionLangModalOpen,
    regionConfig,
    selectedLanguage,
    t,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payments' | 'region'>('profile');

  // Edit profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // New Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrApartment, setNewAddrApartment] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Lagos Island, Lagos');
  const [newAddrZip, setNewAddrZip] = useState('101241');
  const [newAddrInstructions, setNewAddrInstructions] = useState('');

  // New Card Form State
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardHolder, setCardHolder] = useState(user?.name || 'Tunde Adebayo');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'verve'>('mastercard');

  if (!isProfileModalOpen || !user) return null;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setIsEditingInfo(false);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) return;
    addNewAddress({
      title: newAddrTitle,
      street: newAddrStreet,
      apartment: newAddrApartment || undefined,
      city: newAddrCity,
      postalCode: newAddrZip,
      instructions: newAddrInstructions || undefined,
      isDefault: false,
    });
    setNewAddrStreet('');
    setNewAddrApartment('');
    setNewAddrInstructions('');
    setShowAddAddress(false);
  };

  const handleCreatePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '5821';
    savePaymentMethod({
      type: 'card',
      brand: cardBrand,
      holderName: cardHolder,
      last4,
      expiry: cardExpiry || '11/29',
      isDefault: (user.savedPaymentMethods?.length || 0) === 0,
    });
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setShowAddCard(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 25 }}
          className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={`w-12 h-12 rounded-2xl object-cover border-2 ${
                    isAdmin ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-orange-500'
                  }`}
                />
                {isAdmin ? (
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full ring-2 ring-slate-900">
                    <Shield className="w-3.5 h-3.5" />
                  </span>
                ) : user.isPro ? (
                  <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-0.5 rounded-full ring-2 ring-slate-900">
                    <Crown className="w-3.5 h-3.5" />
                  </span>
                ) : null}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white leading-tight">{user.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                      isAdmin
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                    }`}
                  >
                    {user.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsAccountSwitcherOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Switch between Admin and Customer accounts"
              >
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Switch Account</span>
              </button>

              <button
                id="close-profile-modal-btn"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex border-b border-slate-100 bg-slate-50 px-4 sm:px-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'addresses'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses ({(savedAddresses || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'payments'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Saved Cards & Wallets ({(user.savedPaymentMethods || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('region')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'region'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Region & Language</span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-white">
            {/* TAB 1: PERSONAL INFO */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Admin Mode Quick Access */}
                {isAdmin && (
                  <div className="p-4 rounded-2xl bg-indigo-900 text-white flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-sm">Administrator Control Hub</span>
                      </div>
                      <p className="text-xs text-indigo-200">
                        You have privileges to add products, change prices, adjust stock, and update customer order status.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(false);
                        setCurrentTab('admin');
                      }}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Open Admin
                    </button>
                  </div>
                )}

                {/* Account Details Form */}
                <div className="border border-slate-200 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-slate-900">Account Details</h4>
                    {!isEditingInfo ? (
                      <button
                        onClick={() => {
                          setName(user.name);
                          setEmail(user.email);
                          setPhone(user.phone);
                          setIsEditingInfo(true);
                        }}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveInfo}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Changes
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Full Name
                      </label>
                      {isEditingInfo ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Email Address
                      </label>
                      {isEditingInfo ? (
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-xs font-semibold text-slate-800">{user.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Phone Number
                      </label>
                      {isEditingInfo ? (
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-xs font-semibold text-slate-800">{user.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Account Role
                      </label>
                      <p className="text-xs font-bold text-orange-600 uppercase">
                        {user.role} ({user.memberSince})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lifetime Savings Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-100">
                    <span className="text-[11px] font-bold text-orange-800 block">
                      Lifetime Deal Discounts
                    </span>
                    <span className="font-extrabold text-xl text-orange-950 font-display">
                      {formatPrice(user.totalSaved)}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-600 block">Orders Placed</span>
                    <span className="font-extrabold text-xl text-slate-900 font-display">
                      {orders.length} Shipments
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Your Delivery Addresses</h4>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleCreateAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-xs text-slate-900">Add New Delivery Location</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Label (e.g. Home, Office, Lagos Hub)</label>
                        <input
                          type="text"
                          value={newAddrTitle}
                          onChange={(e) => setNewAddrTitle(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={newAddrZip}
                          onChange={(e) => setNewAddrZip(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Street Address</label>
                      <input
                        type="text"
                        placeholder="Plot 14 Admiralty Way, Lekki Phase 1"
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Suite / Flat (Optional)</label>
                        <input
                          type="text"
                          placeholder="Flat 4B"
                          value={newAddrApartment}
                          onChange={(e) => setNewAddrApartment(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">City, State / Region</label>
                        <input
                          type="text"
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Save Delivery Address
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const isCurrent = currentAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        className={`p-3.5 rounded-2xl border transition-all relative ${
                          isCurrent
                            ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-600" />
                            <span className="font-bold text-xs text-slate-900">{addr.title}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-bold">
                                Active
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {!isCurrent && (
                              <button
                                onClick={() => setCurrentAddress(addr)}
                                className="text-[11px] font-bold text-orange-700 hover:underline px-1.5 cursor-pointer"
                              >
                                Select
                              </button>
                            )}
                            {savedAddresses.length > 1 && (
                              <button
                                onClick={() => deleteAddress(addr.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete address"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 font-medium">{addr.street}</p>
                        {addr.apartment && <p className="text-[11px] text-slate-500">{addr.apartment}</p>}
                        <p className="text-[11px] text-slate-400">{addr.city}, {addr.postalCode}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: PAYMENT METHODS */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Saved Cards & Wallets</h4>
                  <button
                    onClick={() => setShowAddCard(!showAddCard)}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddCard ? 'Cancel' : 'Add Card'}</span>
                  </button>
                </div>

                {showAddCard && (
                  <form onSubmit={handleCreatePaymentMethod} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-xs text-slate-900">Add Payment Card</h5>
                    <div className="flex gap-2">
                      {(['visa', 'mastercard', 'verve'] as const).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setCardBrand(b)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                            cardBrand === b
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-600'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Save Card Encrypted
                    </button>
                  </form>
                )}

                <div className="space-y-2.5">
                  {(user.savedPaymentMethods || []).map((pm) => (
                    <div
                      key={pm.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        pm.isDefault ? 'border-orange-500 bg-orange-50/30' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase">
                          {pm.brand || pm.type}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {pm.type === 'card'
                                ? `${(pm.brand || 'Card').toUpperCase()} •••• ${pm.last4}`
                                : pm.type === 'paypal'
                                ? `PayPal (${pm.email})`
                                : 'Apple Pay Wallet'}
                            </span>
                            {pm.isDefault && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          {pm.expiry && <p className="text-[10px] text-slate-400">Expires {pm.expiry}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!pm.isDefault && (
                          <button
                            onClick={() => setDefaultPaymentMethod(pm.id)}
                            className="text-[11px] font-bold text-orange-700 hover:underline cursor-pointer"
                          >
                            Make Default
                          </button>
                        )}
                        <button
                          onClick={() => removePaymentMethod(pm.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove payment method"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REGION & LANGUAGE */}
            {activeTab === 'region' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Current Region Configuration</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{regionConfig.flag}</span>
                    <div>
                      <h4 className="font-bold text-base text-slate-900">
                        {regionConfig.name} ({regionConfig.currency})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Interface Language: {selectedLanguage.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    setIsRegionLangModalOpen(true);
                  }}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>Switch Country, Language or Currency</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                id="profile-logout-btn"
                onClick={() => {
                  logout();
                  setIsProfileModalOpen(false);
                }}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('signOut')}</span>
              </button>

              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsAccountSwitcherOpen(true);
                }}
                className="px-3 py-2 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Switch Account</span>
              </button>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
