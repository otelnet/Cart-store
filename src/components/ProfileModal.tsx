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
  Building,
  Home,
  CheckCircle2,
  Bell,
  Sparkles,
  Phone,
  Mail,
  Camera,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DietaryTag, DeliveryAddress, SavedPaymentMethod, UserProfile } from '../types';

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
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setCurrentAddress,
    currentAddress,
    savePaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    toggleProMembership,
    formatPrice,
    orders,
    setCurrentTab,
    isAdmin,
    setIsRegionLangModalOpen,
    regionConfig,
    selectedLanguage,
    t,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payments' | 'preferences'>('profile');

  // Edit profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);

  // Address Forms State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Add Address Form Fields
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrApartment, setNewAddrApartment] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Lagos Island, Lagos');
  const [newAddrZip, setNewAddrZip] = useState('101241');
  const [newAddrCountry, setNewAddrCountry] = useState('Nigeria');
  const [newAddrRecipientName, setNewAddrRecipientName] = useState(user?.name || '');
  const [newAddrRecipientPhone, setNewAddrRecipientPhone] = useState(user?.phone || '');
  const [newAddrInstructions, setNewAddrInstructions] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  // Edit Address Form Fields
  const [editAddrTitle, setEditAddrTitle] = useState('');
  const [editAddrStreet, setEditAddrStreet] = useState('');
  const [editAddrApartment, setEditAddrApartment] = useState('');
  const [editAddrCity, setEditAddrCity] = useState('');
  const [editAddrZip, setEditAddrZip] = useState('');
  const [editAddrCountry, setEditAddrCountry] = useState('');
  const [editAddrRecipientName, setEditAddrRecipientName] = useState('');
  const [editAddrRecipientPhone, setEditAddrRecipientPhone] = useState('');
  const [editAddrInstructions, setEditAddrInstructions] = useState('');
  const [editAddrLandmark, setEditAddrLandmark] = useState('');

  // Payment Methods Form State
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardHolder, setCardHolder] = useState(user?.name || 'Tunde Adebayo');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'verve' | 'amex'>('mastercard');
  const [cardType, setCardType] = useState<'card' | 'bank_transfer' | 'paypal'>('card');
  const [cardIsDefault, setCardIsDefault] = useState(true);

  if (!isProfileModalOpen || !user) return null;

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      phone: phone.trim() || user.phone,
      avatar: avatar || user.avatar,
    });
    setIsEditingInfo(false);
  };

  const handleAvatarSelect = (newAvatarUrl: string) => {
    setAvatar(newAvatarUrl);
    updateProfile({ avatar: newAvatarUrl });
    setIsSelectingAvatar(false);
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) return;
    await addNewAddress({
      title: newAddrTitle,
      street: newAddrStreet.trim(),
      apartment: newAddrApartment.trim() || undefined,
      city: newAddrCity.trim(),
      postalCode: newAddrZip.trim(),
      country: newAddrCountry.trim(),
      recipientName: newAddrRecipientName.trim() || user.name,
      recipientPhone: newAddrRecipientPhone.trim() || user.phone,
      instructions: newAddrInstructions.trim() || undefined,
      landmark: newAddrLandmark.trim() || undefined,
      isDefault: newAddrIsDefault,
    });
    setNewAddrStreet('');
    setNewAddrApartment('');
    setNewAddrInstructions('');
    setNewAddrLandmark('');
    setShowAddAddress(false);
  };

  const startEditAddress = (addr: DeliveryAddress) => {
    setEditingAddressId(addr.id);
    setEditAddrTitle(addr.title);
    setEditAddrStreet(addr.street);
    setEditAddrApartment(addr.apartment || '');
    setEditAddrCity(addr.city);
    setEditAddrZip(addr.postalCode);
    setEditAddrCountry(addr.country || 'Nigeria');
    setEditAddrRecipientName(addr.recipientName || user.name);
    setEditAddrRecipientPhone(addr.recipientPhone || user.phone);
    setEditAddrInstructions(addr.instructions || '');
    setEditAddrLandmark(addr.landmark || '');
  };

  const handleSaveEditedAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddressId || !editAddrStreet.trim()) return;
    const existing = savedAddresses.find((a) => a.id === editingAddressId);
    if (!existing) return;

    await updateAddress({
      ...existing,
      title: editAddrTitle.trim() || existing.title,
      street: editAddrStreet.trim(),
      apartment: editAddrApartment.trim() || undefined,
      city: editAddrCity.trim(),
      postalCode: editAddrZip.trim(),
      country: editAddrCountry.trim(),
      recipientName: editAddrRecipientName.trim() || undefined,
      recipientPhone: editAddrRecipientPhone.trim() || undefined,
      instructions: editAddrInstructions.trim() || undefined,
      landmark: editAddrLandmark.trim() || undefined,
    });
    setEditingAddressId(null);
  };

  const handleCreatePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '5821';
    await savePaymentMethod({
      type: cardType,
      brand: cardBrand,
      holderName: cardHolder.trim() || user.name,
      last4,
      expiry: cardExpiry || '11/29',
      isDefault: cardIsDefault || (user.savedPaymentMethods?.length || 0) === 0,
    });
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setShowAddCard(false);
  };

  const handleFormatCardInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));

    // Auto-detect brand
    if (raw.startsWith('4')) setCardBrand('visa');
    else if (raw.startsWith('5')) setCardBrand('mastercard');
    else if (raw.startsWith('506') || raw.startsWith('650') || raw.startsWith('507')) setCardBrand('verve');
    else if (raw.startsWith('3')) setCardBrand('amex');
  };

  const handleFormatExpiryInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const toggleDietaryPref = (tag: DietaryTag) => {
    const current = user.dietaryPreferences || [];
    const exists = current.includes(tag);
    const updated = exists ? current.filter((t) => t !== tag) : [...current, tag];
    updateProfile({ dietaryPreferences: updated });
  };

  const toggleNotification = (key: keyof UserProfile['notifications']) => {
    const current = user.notifications || {
      email: true,
      sms: true,
      orderUpdates: true,
      promoAlerts: true,
    };
    const updated = {
      ...current,
      [key]: !current[key],
    };
    updateProfile({ notifications: updated });
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 25 }}
          className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-100"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative group">
                <img
                  src={user.avatar || avatarPresets[0]}
                  alt={user.name}
                  className={`w-12 h-12 rounded-2xl object-cover border-2 transition-all ${
                    isAdmin ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsSelectingAvatar(!isSelectingAvatar)}
                  className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="Change profile avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
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
                    {user.role === 'admin' ? 'Store Administrator' : 'Verified Shopper'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-400">{user.email}</p>
                  {user.authProvider && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {user.authProvider === 'google' ? 'Google Auth' : 'Verified'}
                    </span>
                  )}
                </div>
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

          {/* Avatar selector modal/drawer */}
          {isSelectingAvatar && (
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-xs text-slate-300 font-bold shrink-0">Choose Avatar:</span>
              <div className="flex items-center gap-2">
                {avatarPresets.map((uri, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAvatarSelect(uri)}
                    className="w-8 h-8 rounded-xl overflow-hidden border-2 hover:scale-105 transition-transform border-slate-600 hover:border-orange-500 cursor-pointer shrink-0"
                  >
                    <img src={uri} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsSelectingAvatar(false)}
                className="text-xs text-slate-400 hover:text-white shrink-0 ml-2"
              >
                Close
              </button>
            </div>
          )}

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
              <span>Saved Addresses ({(savedAddresses || []).length})</span>
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
              <span>Payment Methods ({(user.savedPaymentMethods || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preferences'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Preferences & VIP</span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-white">
            {/* TAB 1: PERSONAL INFO */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Admin Quick Link */}
                {isAdmin && (
                  <div className="p-4 rounded-2xl bg-indigo-900 text-white flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-sm">Administrator Control Center</span>
                      </div>
                      <p className="text-xs text-indigo-200">
                        Full oversight: manage products, live stock levels, order status dispatch, and Paystack gateway keys.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(false);
                        setCurrentTab('admin');
                      }}
                      className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Open Admin
                    </button>
                  </div>
                )}

                {/* Account Details Form */}
                <div className="border border-slate-200 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Personal Information</h4>
                      <p className="text-[11px] text-slate-400">Manage your name, contact details and synced profile</p>
                    </div>
                    {!isEditingInfo ? (
                      <button
                        onClick={() => {
                          setName(user.name);
                          setEmail(user.email);
                          setPhone(user.phone);
                          setAvatar(user.avatar);
                          setIsEditingInfo(true);
                        }}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveInfo}
                        className="text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-lg shadow-xs"
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
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
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
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
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
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
                        />
                      ) : (
                        <p className="text-xs font-semibold text-slate-800">{user.phone || '+234 (803) 492-1844'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Account Role & Member Status
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-orange-600 uppercase">
                          {user.role}
                        </span>
                        <span className="text-xs text-slate-400">({user.memberSince})</span>
                        {user.isPro && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-0.5">
                            <Crown className="w-3 h-3 text-amber-600" /> VIP PRO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lifetime Savings & Orders Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-100">
                    <span className="text-[11px] font-bold text-orange-800 block">
                      Lifetime Deal Savings
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

                {/* Firestore Cloud Persistence Status */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Profile securely synchronized with Firebase Cloud Firestore</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    Encrypted
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: SAVED DELIVERY ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Your Saved Delivery Addresses</h4>
                    <p className="text-[11px] text-slate-400">Used for fast 1-click checkout and van dispatch routing</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setShowAddAddress(!showAddAddress);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
                  </button>
                </div>

                {/* ADD ADDRESS FORM */}
                {showAddAddress && (
                  <form onSubmit={handleCreateAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>Add New Delivery Location</span>
                    </h5>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Label (e.g. Home, Office, Lagos Hub)
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrTitle}
                          onChange={(e) => setNewAddrTitle(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          value={newAddrZip}
                          onChange={(e) => setNewAddrZip(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Street Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
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
                          placeholder="Flat 4B, 2nd Floor"
                          value={newAddrApartment}
                          onChange={(e) => setNewAddrApartment(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">City, State / Region</label>
                        <input
                          type="text"
                          required
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Recipient Name</label>
                        <input
                          type="text"
                          value={newAddrRecipientName}
                          onChange={(e) => setNewAddrRecipientName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Recipient Phone</label>
                        <input
                          type="text"
                          value={newAddrRecipientPhone}
                          onChange={(e) => setNewAddrRecipientPhone(e.target.value)}
                          placeholder="+234 (802) 555-0199"
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Landmark Clue</label>
                        <input
                          type="text"
                          placeholder="Opposite Domino's Pizza"
                          value={newAddrLandmark}
                          onChange={(e) => setNewAddrLandmark(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Courier Instructions</label>
                        <input
                          type="text"
                          placeholder="Ring bell #3, leave with security"
                          value={newAddrInstructions}
                          onChange={(e) => setNewAddrInstructions(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="new-addr-default"
                        checked={newAddrIsDefault}
                        onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                        className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <label htmlFor="new-addr-default" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Set as primary default delivery address
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Save Delivery Address to Firestore
                    </button>
                  </form>
                )}

                {/* EDIT ADDRESS FORM */}
                {editingAddressId && (
                  <form onSubmit={handleSaveEditedAddress} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                        <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Edit Delivery Address</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => setEditingAddressId(null)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Label</label>
                        <input
                          type="text"
                          required
                          value={editAddrTitle}
                          onChange={(e) => setEditAddrTitle(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          value={editAddrZip}
                          onChange={(e) => setEditAddrZip(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={editAddrStreet}
                        onChange={(e) => setEditAddrStreet(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Apartment / Suite</label>
                        <input
                          type="text"
                          value={editAddrApartment}
                          onChange={(e) => setEditAddrApartment(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">City, State</label>
                        <input
                          type="text"
                          required
                          value={editAddrCity}
                          onChange={(e) => setEditAddrCity(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Recipient Name</label>
                        <input
                          type="text"
                          value={editAddrRecipientName}
                          onChange={(e) => setEditAddrRecipientName(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Recipient Phone</label>
                        <input
                          type="text"
                          value={editAddrRecipientPhone}
                          onChange={(e) => setEditAddrRecipientPhone(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Courier Instructions</label>
                      <input
                        type="text"
                        value={editAddrInstructions}
                        onChange={(e) => setEditAddrInstructions(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Update Address in Firestore
                    </button>
                  </form>
                )}

                {/* ADDRESSES LIST */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const isCurrent = currentAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        className={`p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                          isCurrent
                            ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              {addr.title.toLowerCase().includes('home') ? (
                                <Home className="w-3.5 h-3.5 text-orange-600" />
                              ) : (
                                <Building className="w-3.5 h-3.5 text-indigo-600" />
                              )}
                              <span className="font-bold text-xs text-slate-900">{addr.title}</span>
                              {addr.isDefault && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                                  Default
                                </span>
                              )}
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-bold">
                                  Active Drop-off
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => startEditAddress(addr)}
                                className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                title="Edit address"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {savedAddresses.length > 1 && (
                                <button
                                  type="button"
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
                          <p className="text-[11px] text-slate-400">
                            {addr.city}, {addr.postalCode} {addr.country ? `• ${addr.country}` : ''}
                          </p>

                          {addr.recipientName && (
                            <p className="text-[11px] text-slate-600 mt-1">
                              👤 {addr.recipientName} {addr.recipientPhone ? `(${addr.recipientPhone})` : ''}
                            </p>
                          )}

                          {addr.instructions && (
                            <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg mt-1.5">
                              📝 {addr.instructions}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                          {!isCurrent ? (
                            <button
                              type="button"
                              onClick={() => setCurrentAddress(addr)}
                              className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                            >
                              Set as Active Drop-off
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Selected
                            </span>
                          )}

                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              Make Default
                            </button>
                          )}
                        </div>
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
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Saved Cards & Payment Methods</h4>
                    <p className="text-[11px] text-slate-400">Securely saved for fast 1-click Paystack & Card Checkout</p>
                  </div>
                  <button
                    onClick={() => setShowAddCard(!showAddCard)}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddCard ? 'Cancel' : 'Add Card / Method'}</span>
                  </button>
                </div>

                {/* ADD PAYMENT METHOD FORM */}
                {showAddCard && (
                  <form onSubmit={handleCreatePaymentMethod} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-orange-600" />
                      <span>Add New Payment Method</span>
                    </h5>

                    {/* Type selection */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCardType('card')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          cardType === 'card'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        Debit / Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardType('bank_transfer')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          cardType === 'bank_transfer'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        Bank Transfer
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardType('paypal')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          cardType === 'paypal'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        PayPal Wallet
                      </button>
                    </div>

                    {cardType === 'card' && (
                      <>
                        <div className="flex gap-2">
                          {(['mastercard', 'visa', 'verve', 'amex'] as const).map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setCardBrand(b)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                                cardBrand === b
                                  ? 'bg-orange-600 text-white'
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
                            required
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            placeholder="5399 •••• •••• ••••"
                            value={cardNumber}
                            onChange={(e) => handleFormatCardInput(e.target.value)}
                            maxLength={19}
                            className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 font-mono tracking-wider"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => handleFormatExpiryInput(e.target.value)}
                              maxLength={5}
                              className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">CVV / CVC</label>
                            <input
                              type="password"
                              required
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                              maxLength={4}
                              className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 font-mono"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {cardType === 'paypal' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">PayPal Account Email</label>
                        <input
                          type="email"
                          required
                          placeholder="billing@example.com"
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    )}

                    {cardType === 'bank_transfer' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Bank Name & Account Label</label>
                        <input
                          type="text"
                          required
                          placeholder="GTBank Nigeria - Primary Savings"
                          className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="card-default"
                        checked={cardIsDefault}
                        onChange={(e) => setCardIsDefault(e.target.checked)}
                        className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <label htmlFor="card-default" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Set as primary default payment method
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Save Card & Tokenize in Firestore
                    </button>
                  </form>
                )}

                {/* SAVED CARDS LIST */}
                <div className="space-y-2.5">
                  {(user.savedPaymentMethods || []).map((pm) => (
                    <div
                      key={pm.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        pm.isDefault ? 'border-orange-500 bg-orange-50/30' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[11px] uppercase tracking-wider">
                          {pm.brand || pm.type}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {pm.type === 'card'
                                ? `${(pm.brand || 'Card').toUpperCase()} •••• ${pm.last4}`
                                : pm.type === 'paypal'
                                ? `PayPal Wallet`
                                : pm.type === 'bank_transfer'
                                ? `Bank Transfer`
                                : 'Paystack Virtual Account'}
                            </span>
                            {pm.isDefault && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            {pm.holderName && <span>{pm.holderName}</span>}
                            {pm.expiry && <span>• Exp: {pm.expiry}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!pm.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultPaymentMethod(pm.id)}
                            className="text-[11px] font-bold text-orange-700 hover:underline cursor-pointer"
                          >
                            Make Default
                          </button>
                        )}
                        <button
                          type="button"
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

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px] text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>256-Bit Bank Grade Tokenization & Zero Raw Card Storage</span>
                </div>
              </div>
            )}

            {/* TAB 4: PREFERENCES & VIP */}
            {activeTab === 'preferences' && (
              <div className="space-y-5">
                {/* VIP Membership Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-200" />
                      <span className="font-extrabold text-base">CartNova VIP Pro Membership</span>
                    </div>
                    <p className="text-xs text-amber-100 max-w-sm">
                      Unlimited Free Express Doorstep Delivery, VIP flash deals, and priority order dispatch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleProMembership}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer shrink-0 shadow-md ${
                      user.isPro
                        ? 'bg-white text-slate-900 hover:bg-slate-100'
                        : 'bg-slate-950 text-amber-300 hover:bg-slate-900'
                    }`}
                  >
                    {user.isPro ? 'Active Pro' : 'Activate VIP'}
                  </button>
                </div>

                {/* Dietary Tags Preferences */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-slate-900">Dietary & Grocery Preferences</h5>
                    <span className="text-[10px] text-slate-400">Auto-filters catalog recommendations</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(['organic', 'vegan', 'gluten-free', 'keto', 'dairy-free', 'low-carb', 'non-gmo'] as DietaryTag[]).map((tag) => {
                      const selected = (user.dietaryPreferences || []).includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleDietaryPref(tag)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                            selected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tag} {selected ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h5 className="font-bold text-xs text-slate-900">Communication & Tracking Notifications</h5>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800">Email Order Confirmations</p>
                        <p className="text-[10px] text-slate-400">Receive digital receipts and invoice PDFs</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.notifications?.email ?? true}
                        onChange={() => toggleNotification('email')}
                        className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800">SMS Driver Dispatch Alerts</p>
                        <p className="text-[10px] text-slate-400">Real-time driver ETA and doorstep drop alerts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.notifications?.sms ?? true}
                        onChange={() => toggleNotification('sms')}
                        className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800">Order Status Milestones</p>
                        <p className="text-[10px] text-slate-400">Picking, packing, transit, and delivery updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.notifications?.orderUpdates ?? true}
                        onChange={() => toggleNotification('orderUpdates')}
                        className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
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
