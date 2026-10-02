import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  PromoCode,
  DeliveryAddress,
  Order,
  OrderStatus,
  CurrencyCode,
  CurrencyConfig,
  Review,
  UserProfile,
  SavedPaymentMethod,
  DietaryTag,
  RegionCode,
  RegionConfig,
  LanguageCode,
  LanguageConfig,
  UserRole,
  ThemeMode,
  SourcedProductRequest,
  SourcingStatus,
  DriverMessage,
} from '../types';
import {
  PRODUCTS,
  PROMO_CODES,
  DEFAULT_ADDRESSES,
  INITIAL_ORDERS,
  CURRENCIES,
  REGIONS,
  LANGUAGES,
  INITIAL_REVIEWS,
  DEFAULT_CUSTOMER_USER,
  DEFAULT_ADMIN_USER,
  DEFAULT_PAYMENT_METHODS,
  INITIAL_SOURCING_REQUESTS,
} from '../data/mockData';
import { TRANSLATIONS, Translations, getTranslation } from '../utils/translations';
import confetti from 'canvas-confetti';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateAuthProfile,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  User as FirebaseUser,
} from '../lib/firebase';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
  icon?: string;
}

interface RatingSummary {
  average: number;
  count: number;
  breakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  percentageBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

export type TabType = 'discover' | 'categories' | 'atlas_api' | 'deals' | 'orders' | 'favorites' | 'profile' | 'admin';

interface ShopContextType {
  // Products Catalog & Filtered list
  products: Product[];
  allProducts: Product[];

  // Navigation & Modals
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDietary: string[];
  toggleDietaryFilter: (tag: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  onlyOnSale: boolean;
  setOnlyOnSale: (val: boolean) => void;
  onlyOrganic: boolean;
  setOnlyOrganic: (val: boolean) => void;
  sortBy: 'featured' | 'rating' | 'price-low' | 'price-high' | 'most-reviewed' | 'newest';
  setSortBy: (sort: 'featured' | 'rating' | 'price-low' | 'price-high' | 'most-reviewed' | 'newest') => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  clearFilters: () => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;

  // Theme (Light / Dark)
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Region & Language & Currency
  selectedRegion: RegionCode;
  setSelectedRegion: (code: RegionCode) => void;
  regionConfig: RegionConfig;
  regions: RegionConfig[];
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (lang: LanguageCode) => void;
  languageConfig: LanguageConfig;
  languages: LanguageConfig[];
  isRegionLangModalOpen: boolean;
  setIsRegionLangModalOpen: (open: boolean) => void;
  t: (key: keyof Translations) => string;

  // Multi-Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyConfig: CurrencyConfig;
  currencies: CurrencyConfig[];
  convertPrice: (usdAmount: number, targetCode?: CurrencyCode) => number;
  formatPrice: (usdAmount: number, targetCode?: CurrencyCode) => string;

  // Product Reviews & Ratings
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  voteHelpfulReview: (reviewId: string) => void;
  getProductRatingSummary: (productId: string) => RatingSummary;

  // Product Detail
  selectedProduct: Product | null;
  openProductDetail: (prod: Product) => void;
  closeProductDetail: () => void;

  // User Auth & Profiles (Customer vs Admin)
  user: UserProfile | null;
  firebaseAuthUser: FirebaseUser | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  login: (email: string, name?: string, role?: UserRole) => void;
  loginCustomer: (email?: string, name?: string) => void;
  loginAdmin: (email?: string, name?: string) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isAccountSwitcherOpen: boolean;
  setIsAccountSwitcherOpen: (open: boolean) => void;
  savedAccounts: Array<{ id: string; email: string; name: string; role: UserRole; avatar: string }>;
  switchAccount: (accountData: { email: string; name?: string; role: UserRole }) => void;
  removeSavedAccount: (email: string) => void;
  savePaymentMethod: (card: Omit<SavedPaymentMethod, 'id'>) => Promise<void>;
  updatePaymentMethod: (id: string, updates: Partial<SavedPaymentMethod>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  toggleProMembership: () => void;
  addNewAddress: (addr: Omit<DeliveryAddress, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  updateAddress: (address: DeliveryAddress) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  // Admin Actions
  adminAddProduct: (prod: Omit<Product, 'id'>) => void;
  adminUpdateProduct: (id: string, updates: Partial<Product>) => void;
  adminDeleteProduct: (id: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, note?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setPickerNote: (productId: string, note: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Pricing calculations
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  tip: number;
  setTip: (amount: number) => void;
  total: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  totalItemsCount: number;

  // Promo Code
  appliedPromo: PromoCode | null;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  // Addresses
  currentAddress: DeliveryAddress;
  savedAddresses: DeliveryAddress[];
  setCurrentAddress: (addr: DeliveryAddress) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  updateOrderAddress: (orderId: string, address: DeliveryAddress) => void;
  isUpdateOrderAddressModalOpen: boolean;
  setIsUpdateOrderAddressModalOpen: (open: boolean) => void;
  activeUpdateAddressOrderId: string | null;
  openUpdateOrderAddress: (orderId?: string) => void;
  closeUpdateOrderAddress: () => void;

  // Checkout
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  processOrder: (
    deliverySlot: string,
    paymentMethod: string,
    address: DeliveryAddress,
    paymentMeta?: {
      paymentReference?: string;
      paymentGateway?: Order['paymentGateway'];
      paystackDetails?: Order['paystackDetails'];
    }
  ) => Order;

  // Orders & Live Tracking
  orders: Order[];
  activeOrder: Order | null;
  trackingOrderId: string | null;
  openOrderTracker: (orderId: string) => void;
  closeOrderTracker: () => void;
  reorder: (order: Order) => void;
  simulateNextOrderStatus: (orderId: string) => void;

  // Driver Van Dispatch & Real-Time Messaging
  driverMessages: Record<string, DriverMessage[]>;
  sendDriverMessage: (orderId: string, text: string, type?: DriverMessage['type']) => void;
  isDriverContactModalOpen: boolean;
  setIsDriverContactModalOpen: (open: boolean) => void;
  activeDriverContactOrderId: string | null;
  openDriverContact: (orderId?: string) => void;
  closeDriverContact: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Jumia Nigeria & Global Custom Product Sourcing
  sourcingRequests: SourcedProductRequest[];
  submitSourcingRequest: (request: Omit<SourcedProductRequest, 'id' | 'createdAt' | 'status'>) => SourcedProductRequest;
  updateSourcingRequestStatus: (id: string, status: SourcingStatus) => void;
  isSourcingModalOpen: boolean;
  setIsSourcingModalOpen: (open: boolean) => void;
  sourcingQuery: string;
  setSourcingQuery: (query: string) => void;
  openSourcingModalWithQuery: (queryOrUrl: string) => void;
  addSourcedProductToCart: (product: Product, quantity?: number, note?: string) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_DELIVERY_MIN = 25.0;
const BASE_DELIVERY_FEE = 2.99;
const SERVICE_FEE = 1.49;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('discover');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(false);
  const [onlyOrganic, setOnlyOrganic] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-low' | 'price-high' | 'most-reviewed' | 'newest'>('featured');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Theme (Light / Dark)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('cartnova_theme') as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') {
        if (saved === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return saved;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        return 'dark';
      }
      document.documentElement.classList.remove('dark');
      return 'light';
    } catch {
      return 'light';
    }
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('cartnova_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Region & Language
  const [selectedRegion, setSelectedRegionState] = useState<RegionCode>(() => {
    try {
      const saved = localStorage.getItem('temucart_region');
      return (saved as RegionCode) || 'NG';
    } catch {
      return 'NG';
    }
  });

  const [selectedLanguage, setSelectedLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('temucart_language');
      return (saved as LanguageCode) || 'en';
    } catch {
      return 'en';
    }
  });

  const [isRegionLangModalOpen, setIsRegionLangModalOpen] = useState<boolean>(false);

  const regionConfig = REGIONS.find((r) => r.code === selectedRegion) || REGIONS[0];
  const languageConfig = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  const setSelectedRegion = (code: RegionCode) => {
    setSelectedRegionState(code);
    try {
      localStorage.setItem('temucart_region', code);
    } catch (e) {
      console.error(e);
    }
    // Automatically adjust currency to region default
    const rConfig = REGIONS.find((r) => r.code === code);
    if (rConfig) {
      setCurrency(rConfig.defaultCurrency);
    }
    showToast(`Region changed to ${rConfig?.name || code} ${rConfig?.flag || ''}`, 'info');
  };

  const setSelectedLanguage = (lang: LanguageCode) => {
    setSelectedLanguageState(lang);
    try {
      localStorage.setItem('temucart_language', lang);
    } catch (e) {
      console.error(e);
    }
    const lConfig = LANGUAGES.find((l) => l.code === lang);
    showToast(`Language set to ${lConfig?.name || lang}`, 'info');
  };

  const t = (key: keyof Translations): string => {
    return getTranslation(selectedLanguage, key);
  };

  // Multi-Currency
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('temucart_currency');
      return (saved as CurrencyCode) || 'NGN';
    } catch {
      return 'NGN';
    }
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem('temucart_currency', code);
    } catch (e) {
      console.error(e);
    }
  };

  const currencyConfig = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const convertPrice = (usdAmount: number, targetCode?: CurrencyCode): number => {
    const config = targetCode ? CURRENCIES.find((c) => c.code === targetCode) || currencyConfig : currencyConfig;
    return usdAmount * config.rate;
  };

  const formatPrice = (usdAmount: number, targetCode?: CurrencyCode): string => {
    const config = targetCode ? CURRENCIES.find((c) => c.code === targetCode) || currencyConfig : currencyConfig;
    const converted = usdAmount * config.rate;
    if (config.code === 'JPY' || config.code === 'NGN' || config.code === 'KES') {
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  // Product List (Admin can edit/add/delete)
  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('temucart_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('temucart_products', JSON.stringify(productList));
    } catch (e) {
      console.error(e);
    }
  }, [productList]);

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('temucart_recent_searches');
      return saved ? JSON.parse(saved) : ['Wireless Earbuds', 'Smartwatch', 'Solar Flood Light', 'Blender', 'Sneakers', 'Vegetable Chopper'];
    } catch {
      return ['Earbuds', 'Smartwatch', 'Solar Light'];
    }
  });

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('temucart_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('temucart_recent_searches');
    } catch (e) {
      console.error(e);
    }
  };

  // User Profile and Auth (Customer vs Admin)
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('temucart_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CUSTOMER_USER,
          ...parsed,
          role: parsed.role || 'customer',
          savedAddresses: Array.isArray(parsed.savedAddresses) && parsed.savedAddresses.length > 0 ? parsed.savedAddresses : DEFAULT_ADDRESSES,
          savedPaymentMethods: Array.isArray(parsed.savedPaymentMethods) ? parsed.savedPaymentMethods : DEFAULT_PAYMENT_METHODS,
          dietaryPreferences: Array.isArray(parsed.dietaryPreferences) ? parsed.dietaryPreferences : ['organic'],
        };
      }
      return DEFAULT_CUSTOMER_USER;
    } catch {
      return DEFAULT_CUSTOMER_USER;
    }
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseAuthUser(fbUser);
      setIsAuthLoading(false);
      if (fbUser) {
        try {
          const remoteProfile = await getUserProfileFromFirestore(fbUser.uid);
          if (remoteProfile) {
            setUser({
              ...remoteProfile,
              authProvider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'password',
            });
            if (remoteProfile.savedAddresses && remoteProfile.savedAddresses.length > 0) {
              setSavedAddresses(remoteProfile.savedAddresses);
              const def = remoteProfile.savedAddresses.find((a) => a.isDefault) || remoteProfile.savedAddresses[0];
              setCurrentAddress(def);
            }
          } else {
            // First time sign-in: bootstrap initial profile in Firestore
            const isRootAdmin = fbUser.email === 'otelnetclient@gmail.com';
            const initialProfile: UserProfile = {
              id: fbUser.uid,
              role: isRootAdmin ? 'admin' : 'customer',
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'CartNova Shopper',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+234 (803) 492-1844',
              avatar:
                fbUser.photoURL ||
                (isRootAdmin
                  ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
              memberSince: 'Today',
              isPro: true,
              proExpiryDate: 'Dec 31, 2026',
              totalSaved: isRootAdmin ? 940.0 : 42.5,
              dietaryPreferences: ['organic'],
              savedAddresses: DEFAULT_ADDRESSES,
              savedPaymentMethods: DEFAULT_PAYMENT_METHODS,
              authProvider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'password',
              notifications: {
                email: true,
                sms: true,
                orderUpdates: true,
                promoAlerts: true,
              },
            };
            setUser(initialProfile);
            setSavedAddresses(DEFAULT_ADDRESSES);
            setCurrentAddress(DEFAULT_ADDRESSES[0]);
            await saveUserProfileToFirestore(initialProfile);
          }
        } catch (err) {
          console.warn('Could not sync user profile from Firestore:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState<boolean>(false);

  // Saved accounts for quick multi-account switching
  const [savedAccounts, setSavedAccounts] = useState<Array<{ id: string; email: string; name: string; role: UserRole; avatar: string }>>(() => {
    try {
      const saved = localStorage.getItem('temucart_saved_accounts');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'acc-admin',
          email: 'otelnetclient@gmail.com',
          name: 'Store Administrator (Admin)',
          role: 'admin' as UserRole,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'acc-alex',
          email: 'alex.morgan@cartnovastore.com',
          name: 'Alex Morgan',
          role: 'customer' as UserRole,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'acc-chinedu',
          email: 'chinedu.eze@cartnovastore.com',
          name: 'Chinedu Eze',
          role: 'customer' as UserRole,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('temucart_saved_accounts', JSON.stringify(savedAccounts));
    } catch (e) {
      console.error(e);
    }
  }, [savedAccounts]);

  const switchAccount = (accountData: { email: string; name?: string; role: UserRole }) => {
    login(accountData.email, accountData.name, accountData.role);
    // Add to saved accounts if not present
    setSavedAccounts((prev) => {
      const exists = prev.find((a) => a.email.toLowerCase() === accountData.email.toLowerCase());
      if (exists) {
        return prev.map((a) =>
          a.email.toLowerCase() === accountData.email.toLowerCase()
            ? { ...a, role: accountData.role, name: accountData.name || a.name }
            : a
        );
      }
      return [
        {
          id: `acc-${Date.now()}`,
          email: accountData.email,
          name: accountData.name || accountData.email.split('@')[0],
          role: accountData.role,
          avatar:
            accountData.role === 'admin'
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        ...prev,
      ];
    });
  };

  const removeSavedAccount = (email: string) => {
    setSavedAccounts((prev) => prev.filter((a) => a.email.toLowerCase() !== email.toLowerCase()));
    showToast(`Removed account ${email}`, 'info');
  };

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('temucart_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('temucart_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const isAdmin = user?.role === 'admin';

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      setFirebaseAuthUser(fbUser);
      const isRootAdmin = fbUser.email?.toLowerCase() === 'otelnetclient@gmail.com';
      const existing = await getUserProfileFromFirestore(fbUser.uid);
      const profileToUse: UserProfile = existing || {
        id: fbUser.uid,
        role: isRootAdmin ? 'admin' : 'customer',
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'CartNova Shopper',
        email: fbUser.email || '',
        phone: fbUser.phoneNumber || '+234 (803) 492-1844',
        avatar:
          fbUser.photoURL ||
          (isRootAdmin
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
        memberSince: 'Today',
        isPro: true,
        proExpiryDate: 'Dec 31, 2026',
        totalSaved: isRootAdmin ? 940.0 : 42.5,
        dietaryPreferences: ['organic'],
        savedAddresses: DEFAULT_ADDRESSES,
        savedPaymentMethods: DEFAULT_PAYMENT_METHODS,
        authProvider: 'google',
        notifications: {
          email: true,
          sms: true,
          orderUpdates: true,
          promoAlerts: true,
        },
      };
      setUser(profileToUse);
      if (profileToUse.savedAddresses && profileToUse.savedAddresses.length > 0) {
        setSavedAddresses(profileToUse.savedAddresses);
        const def = profileToUse.savedAddresses.find((a) => a.isDefault) || profileToUse.savedAddresses[0];
        setCurrentAddress(def);
      }
      await saveUserProfileToFirestore(profileToUse);
      setIsAuthModalOpen(false);
      showToast(
        isRootAdmin
          ? `🛡️ Signed in with Google as Store Administrator: ${profileToUse.name}`
          : `✨ Welcome, ${profileToUse.name}! Signed in with Google`,
        'success'
      );
    } catch (err: any) {
      console.error('Google sign in error:', err);
      const msg = err.message || 'Google sign in was canceled or failed';
      showToast(msg, 'error');
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, role: UserRole = 'customer') => {
    let fbUid = '';
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    const isRootAdmin = cleanEmail === 'otelnetclient@gmail.com' || role === 'admin';

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateAuthProfile(cred.user, { displayName: cleanName });
      fbUid = cred.user.uid;
      setFirebaseAuthUser(cred.user);
    } catch (authErr: any) {
      if (authErr.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password not active in console. Using client authenticated profile.');
        fbUid = `usr-email-${Date.now()}`;
      } else {
        let msg = authErr.message || 'Failed to sign up';
        if (authErr.code === 'auth/email-already-in-use') {
          msg = 'An account with this email already exists. Please sign in.';
        } else if (authErr.code === 'auth/weak-password') {
          msg = 'Password is too weak. Please use at least 6 characters.';
        } else if (authErr.code === 'auth/invalid-email') {
          msg = 'Please provide a valid email address.';
        }
        showToast(msg, 'error');
        throw new Error(msg);
      }
    }

    const newProfile: UserProfile = {
      id: fbUid,
      role: isRootAdmin ? 'admin' : 'customer',
      name: cleanName,
      email: cleanEmail,
      phone: isRootAdmin ? '+1 (800) 555-ADMIN' : '+234 (803) 492-1844',
      avatar: isRootAdmin
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      memberSince: 'Today',
      isPro: true,
      proExpiryDate: 'Dec 31, 2026',
      totalSaved: isRootAdmin ? 940.0 : 42.5,
      dietaryPreferences: ['organic'],
      savedAddresses: DEFAULT_ADDRESSES,
      savedPaymentMethods: DEFAULT_PAYMENT_METHODS,
      authProvider: 'password',
      notifications: {
        email: true,
        sms: true,
        orderUpdates: true,
        promoAlerts: true,
      },
    };

    setUser(newProfile);
    setSavedAddresses(DEFAULT_ADDRESSES);
    setCurrentAddress(DEFAULT_ADDRESSES[0]);

    if (auth.currentUser) {
      try {
        await saveUserProfileToFirestore(newProfile);
      } catch (e) {
        console.warn('Firestore write error during signup:', e);
      }
    }

    // Save to quick accounts
    setSavedAccounts((prev) => {
      if (prev.some((a) => a.email.toLowerCase() === cleanEmail)) return prev;
      return [
        {
          id: `acc-${Date.now()}`,
          email: cleanEmail,
          name: cleanName,
          role: newProfile.role,
          avatar: newProfile.avatar,
        },
        ...prev,
      ];
    });

    setIsAuthModalOpen(false);
    showToast(`🎉 Welcome to CartNova, ${newProfile.name}! Account created.`, 'success');
  };

  const signInWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      setFirebaseAuthUser(cred.user);
      const existing = await getUserProfileFromFirestore(cred.user.uid);
      if (existing) {
        setUser({ ...existing, authProvider: 'password' });
        if (existing.savedAddresses && existing.savedAddresses.length > 0) {
          setSavedAddresses(existing.savedAddresses);
          const def = existing.savedAddresses.find((a) => a.isDefault) || existing.savedAddresses[0];
          setCurrentAddress(def);
        }
        setIsAuthModalOpen(false);
        showToast(`👋 Welcome back, ${existing.name}!`, 'success');
        return;
      }
    } catch (authErr: any) {
      if (
        authErr.code === 'auth/operation-not-allowed' ||
        authErr.code === 'auth/invalid-credential' ||
        authErr.code === 'auth/user-not-found'
      ) {
        // Fallback for demo credentials or quick accounts
        const isRootAdmin = cleanEmail === 'otelnetclient@gmail.com';
        login(cleanEmail, undefined, isRootAdmin ? 'admin' : 'customer');
        return;
      }
      let msg = authErr.message || 'Sign in failed';
      if (authErr.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      }
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const login = (email: string, name?: string, role: UserRole = 'customer') => {
    const formattedName = name || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const newUser: UserProfile = {
      id: role === 'admin' ? 'usr-admin-root' : `usr-cust-${Date.now()}`,
      role,
      name: formattedName,
      email,
      phone: role === 'admin' ? '+1 (800) 555-ADMIN' : '+234 (803) 492-1844',
      avatar: role === 'admin'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      memberSince: 'Today',
      isPro: true,
      proExpiryDate: 'Dec 31, 2026',
      totalSaved: role === 'admin' ? 940.0 : 42.5,
      dietaryPreferences: ['organic'],
      savedAddresses: DEFAULT_ADDRESSES,
      savedPaymentMethods: DEFAULT_PAYMENT_METHODS,
      authProvider: 'demo',
      notifications: {
        email: true,
        sms: true,
        orderUpdates: true,
        promoAlerts: true,
      },
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast(
      role === 'admin'
        ? `🛡️ Signed in as Administrator: ${formattedName}`
        : `👋 Welcome back, ${formattedName}!`,
      'success'
    );
  };

  const loginCustomer = (email = 'customer@cartnovastore.com', name = 'Alex Morgan') => {
    login(email, name, 'customer');
  };

  const loginAdmin = (email = 'admin@cartnovastore.com', name = 'Store Administrator') => {
    login(email, name, 'admin');
    setCurrentTab('admin');
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
    setUser(null);
    setFirebaseAuthUser(null);
    showToast('Signed out of CartNova Store', 'info');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    showToast('Profile updated successfully', 'success');
    if (auth.currentUser || user.id) {
      try {
        await saveUserProfileToFirestore(updatedUser);
      } catch (e) {
        console.warn('Firestore update profile error:', e);
      }
    }
  };

  const savePaymentMethod = async (cardData: Omit<SavedPaymentMethod, 'id'>) => {
    if (!user) return;
    const newCard: SavedPaymentMethod = {
      id: `pay-${Date.now()}`,
      ...cardData,
    };
    const updatedCards = cardData.isDefault
      ? [newCard, ...user.savedPaymentMethods.map((c) => ({ ...c, isDefault: false }))]
      : [...user.savedPaymentMethods, newCard];
    const updatedUser: UserProfile = { ...user, savedPaymentMethods: updatedCards };
    setUser(updatedUser);
    showToast('Payment method saved securely', 'success');
    if (auth.currentUser || user.id) {
      try {
        await saveUserProfileToFirestore(updatedUser);
      } catch (e) {
        console.warn('Firestore write payment method error:', e);
      }
    }
  };

  const updatePaymentMethod = async (id: string, updates: Partial<SavedPaymentMethod>) => {
    if (!user) return;
    const updatedCards = user.savedPaymentMethods.map((c) => (c.id === id ? { ...c, ...updates } : c));
    const updatedUser: UserProfile = { ...user, savedPaymentMethods: updatedCards };
    setUser(updatedUser);
    showToast('Payment method updated', 'success');
    if (auth.currentUser || user.id) {
      try {
        await saveUserProfileToFirestore(updatedUser);
      } catch (e) {
        console.warn('Firestore update payment method error:', e);
      }
    }
  };

  const removePaymentMethod = async (id: string) => {
    if (!user) return;
    const updatedCards = user.savedPaymentMethods.filter((c) => c.id !== id);
    const updatedUser: UserProfile = { ...user, savedPaymentMethods: updatedCards };
    setUser(updatedUser);
    showToast('Payment method removed', 'info');
    if (auth.currentUser || user.id) {
      try {
        await saveUserProfileToFirestore(updatedUser);
      } catch (e) {
        console.warn('Firestore remove payment method error:', e);
      }
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    if (!user) return;
    const updatedCards = user.savedPaymentMethods.map((c) => ({
      ...c,
      isDefault: c.id === id,
    }));
    const updatedUser: UserProfile = { ...user, savedPaymentMethods: updatedCards };
    setUser(updatedUser);
    showToast('Default payment method updated', 'success');
    if (auth.currentUser || user.id) {
      try {
        await saveUserProfileToFirestore(updatedUser);
      } catch (e) {
        console.warn('Firestore set default payment method error:', e);
      }
    }
  };

  const toggleProMembership = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const newPro = !user.isPro;
    const updatedUser: UserProfile = {
      ...user,
      isPro: newPro,
      proExpiryDate: newPro ? 'Dec 31, 2026' : undefined,
    };
    setUser(updatedUser);
    if (auth.currentUser || user.id) {
      saveUserProfileToFirestore(updatedUser).catch(console.warn);
    }
    showToast(newPro ? '🎉 CartNova VIP Pro Activated! Unlimited Free Express Delivery.' : 'VIP Pro paused', 'success');
  };

  // Admin Catalog Methods
  const adminAddProduct = (newProdData: Omit<Product, 'id'>) => {
    const id = `prod-custom-${Date.now()}`;
    const newProduct: Product = { id, ...newProdData };
    setProductList((prev) => [newProduct, ...prev]);
    showToast(`Added product "${newProduct.name}" to store catalog!`, 'success');
  };

  const adminUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProductList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product updated successfully', 'success');
  };

  const adminDeleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const adminUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: newStatus,
          trackingSteps: ord.trackingSteps.map((step) => {
            const statusOrder: OrderStatus[] = ['confirmed', 'picking', 'packed', 'on_the_way', 'delivered'];
            const stepIdx = statusOrder.indexOf(step.status);
            const newIdx = statusOrder.indexOf(newStatus);
            if (stepIdx < newIdx) {
              return { ...step, completed: true, current: false };
            } else if (stepIdx === newIdx) {
              return { ...step, completed: newStatus === 'delivered', current: newStatus !== 'delivered', timestamp: 'Updated by Admin' };
            } else {
              return { ...step, completed: false, current: false };
            }
          }),
        };
      })
    );
    showToast(`Order status changed to ${newStatus}`, 'success');
  };

  // Product Reviews & Ratings
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('temucart_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('temucart_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0,
      ...reviewData,
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast('Thank you! Your verified review was published.', 'success');
  };

  const voteHelpfulReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast('Marked review as helpful 👍', 'info');
  };

  const getProductRatingSummary = (productId: string): RatingSummary => {
    const prodReviews = getProductReviews(productId);
    if (prodReviews.length === 0) {
      const prod = productList.find((p) => p.id === productId);
      const fallbackRating = prod ? prod.rating : 4.9;
      const fallbackCount = prod ? prod.reviewsCount : 50;
      return {
        average: fallbackRating,
        count: fallbackCount,
        breakdown: { 5: Math.round(fallbackCount * 0.8), 4: Math.round(fallbackCount * 0.15), 3: Math.round(fallbackCount * 0.05), 2: 0, 1: 0 },
        percentageBreakdown: { 5: 85, 4: 12, 3: 3, 2: 0, 1: 0 },
      };
    }

    const count = prodReviews.length;
    const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Number((sum / count).toFixed(1));

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    prodReviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      breakdown[rounded] = (breakdown[rounded] || 0) + 1;
    });

    const percentageBreakdown = {
      5: Math.round((breakdown[5] / count) * 100),
      4: Math.round((breakdown[4] / count) * 100),
      3: Math.round((breakdown[3] / count) * 100),
      2: Math.round((breakdown[2] / count) * 100),
      1: Math.round((breakdown[1] / count) * 100),
    };

    return { average, count, breakdown, percentageBreakdown };
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Cart & Local storage state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('temucart_cart');
      return saved ? JSON.parse(saved) : [
        { product: PRODUCTS[0], quantity: 1, pickerNote: 'Black edition' },
        { product: PRODUCTS[3], quantity: 1 },
      ];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('temucart_favs');
      return saved ? JSON.parse(saved) : ['prod-temu-1', 'prod-temu-2', 'prod-temu-5'];
    } catch {
      return ['prod-temu-1', 'prod-temu-5'];
    }
  });

  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>(() => {
    try {
      const saved = localStorage.getItem('temucart_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  const [currentAddress, setCurrentAddress] = useState<DeliveryAddress>(savedAddresses[0] || DEFAULT_ADDRESSES[0]);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('temucart_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [tip, setTip] = useState<number>(1.50);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('temucart_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('temucart_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('temucart_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('temucart_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  // Driver Dispatch Messaging & Address Modal States
  const [driverMessages, setDriverMessages] = useState<Record<string, DriverMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('temucart_driver_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      'ord-10293': [
        {
          id: 'msg-init-1',
          orderId: 'ord-10293',
          sender: 'driver',
          text: 'Hello! I am Tunde, your CartNova Dispatch Van Driver in the Mercedes Sprinter (LAG-482-XY). Your items are safely stored in our climate-controlled compartment. Feel free to send live gate codes, parking tips, or GPS pins here!',
          time: '2:48 PM',
          type: 'text',
        },
      ],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('temucart_driver_messages', JSON.stringify(driverMessages));
    } catch (e) {
      console.error(e);
    }
  }, [driverMessages]);

  const [isDriverContactModalOpen, setIsDriverContactModalOpen] = useState(false);
  const [activeDriverContactOrderId, setActiveDriverContactOrderId] = useState<string | null>(null);

  const [isUpdateOrderAddressModalOpen, setIsUpdateOrderAddressModalOpen] = useState(false);
  const [activeUpdateAddressOrderId, setActiveUpdateAddressOrderId] = useState<string | null>(null);

  const openDriverContact = (orderId?: string) => {
    const target = orderId || trackingOrderId || orders.find((o) => o.status !== 'delivered')?.id || orders[0]?.id || null;
    setActiveDriverContactOrderId(target);
    setIsDriverContactModalOpen(true);
  };

  const closeDriverContact = () => {
    setIsDriverContactModalOpen(false);
  };

  const openUpdateOrderAddress = (orderId?: string) => {
    const target = orderId || trackingOrderId || orders.find((o) => o.status !== 'delivered')?.id || orders[0]?.id || null;
    setActiveUpdateAddressOrderId(target);
    setIsUpdateOrderAddressModalOpen(true);
  };

  const closeUpdateOrderAddress = () => {
    setIsUpdateOrderAddressModalOpen(false);
  };

  const sendDriverMessage = (orderId: string, text: string, type: DriverMessage['type'] = 'text') => {
    const newMsg: DriverMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      sender: 'user',
      text,
      time: 'Just now',
      type,
    };

    setDriverMessages((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), newMsg],
    }));

    // Realistic driver AI reply after ~1 second
    setTimeout(() => {
      const order = orders.find((o) => o.id === orderId);
      const driverName = order?.driver?.name || 'Driver Tunde';
      let replyText = `Received loud and clear! Thanks for keeping me updated for order #${order?.orderNumber || ''}.`;
      const lower = text.toLowerCase();

      if (type === 'location_pin' || lower.includes('gps') || lower.includes('pin') || lower.includes('coordinates')) {
        replyText = `📍 Live location coordinates received! Route recalibrated directly to your drop-off pinpoint.`;
      } else if (type === 'gate_code' || lower.includes('gate') || lower.includes('buzzer') || lower.includes('code')) {
        replyText = `🏢 Gate & buzzer code noted! I will dial this upon arrival at the gatehouse.`;
      } else if (type === 'address_update' || lower.includes('address') || lower.includes('street')) {
        replyText = `✅ Dispatch address updated in my navigation tablet. Heading to the new location now.`;
      } else if (lower.includes('call') || lower.includes('phone') || lower.includes('ring')) {
        replyText = `📞 No problem! I will call your phone as soon as the dispatch van pulls up.`;
      } else if (lower.includes('door') || lower.includes('porch') || lower.includes('leave') || lower.includes('concierge')) {
        replyText = `📦 Understood! I will leave the package safely at the specified drop-off point with photo confirmation.`;
      } else if (lower.includes('van') || lower.includes('parking') || lower.includes('bay')) {
        replyText = `🚗 Thank you for the parking note! The Mercedes Sprinter van will pull into the loading bay.`;
      } else if (lower.includes('eta') || lower.includes('time') || lower.includes('when')) {
        replyText = `Current ETA is approx ${order?.driver?.etaMinutes || 12} minutes. Moving smoothly through traffic.`;
      }

      const driverReply: DriverMessage = {
        id: `msg-${Date.now() + 1}`,
        orderId,
        sender: 'driver',
        text: replyText,
        time: 'Just now',
        type: 'text',
      };

      setDriverMessages((prev) => ({
        ...prev,
        [orderId]: [...(prev[orderId] || []), driverReply],
      }));
    }, 1100);
  };

  const updateOrderAddress = (orderId: string, newAddress: DeliveryAddress) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            address: newAddress,
          };
        }
        return order;
      })
    );

    // Also send an address update event to the driver message thread
    sendDriverMessage(
      orderId,
      `📍 Updated Address: ${newAddress.street}, ${newAddress.city}${newAddress.instructions ? ` • Note: ${newAddress.instructions}` : ''}${newAddress.landmark ? ` • Landmark: ${newAddress.landmark}` : ''}`,
      'address_update'
    );

    showToast('Delivery address & instructions sent to dispatch driver!', 'success');
  };

  // Jumia Nigeria & Global Custom Product Sourcing State
  const [isSourcingModalOpen, setIsSourcingModalOpen] = useState<boolean>(false);
  const [sourcingQuery, setSourcingQuery] = useState<string>('');
  const [sourcingRequests, setSourcingRequests] = useState<SourcedProductRequest[]>(() => {
    try {
      const saved = localStorage.getItem('temucart_sourcing_reqs');
      return saved ? JSON.parse(saved) : INITIAL_SOURCING_REQUESTS;
    } catch {
      return INITIAL_SOURCING_REQUESTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('temucart_sourcing_reqs', JSON.stringify(sourcingRequests));
    } catch (e) {
      console.error(e);
    }
  }, [sourcingRequests]);

  const openSourcingModalWithQuery = (queryOrUrl: string) => {
    setSourcingQuery(queryOrUrl);
    setIsSourcingModalOpen(true);
  };

  const addSourcedProductToCart = (product: Product, quantity = 1, note?: string) => {
    setProductList((prev) => {
      if (!prev.some((p) => p.id === product.id)) {
        return [product, ...prev];
      }
      return prev;
    });

    addToCart(product, quantity, note || 'Direct Sourced via Jumia / Global Hub');
    setIsCartOpen(true);
    showToast(`Added sourced "${product.name}" to cart!`, 'success');
  };

  const submitSourcingRequest = (requestData: Omit<SourcedProductRequest, 'id' | 'createdAt' | 'status'>): SourcedProductRequest => {
    const newReq: SourcedProductRequest = {
      id: `src-req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'quoted',
      ...requestData,
      userName: requestData.userName || user?.name || 'Customer Shopper',
      userEmail: requestData.userEmail || user?.email || 'customer@cartnovastore.com',
    };

    setSourcingRequests((prev) => [newReq, ...prev]);
    showToast(`Sourcing quote created for "${newReq.productName}"!`, 'success');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    return newReq;
  };

  const updateSourcingRequestStatus = (id: string, newStatus: SourcingStatus) => {
    setSourcingRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
    showToast(`Sourcing request #${id.slice(-4)} updated to ${newStatus}`, 'info');
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, note?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          pickerNote: note || updated[existingIndex].pickerNote,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, pickerNote: note }];
      }
    });
    showToast(`Added ${quantity}x ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed ${item.product.name}`, 'info');
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const setPickerNote = (productId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, pickerNote: note } : item))
    );
    showToast('Note saved', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isFreeDeliveryQualified =
    (user && user.isPro) ||
    subtotal >= FREE_DELIVERY_MIN ||
    appliedPromo?.discountType === 'free_shipping';

  const deliveryFee = cart.length === 0 ? 0 : isFreeDeliveryQualified ? 0 : BASE_DELIVERY_FEE;
  const serviceFee = cart.length === 0 ? 0 : SERVICE_FEE;

  let calculatedDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      calculatedDiscount = (subtotal * appliedPromo.value) / 100;
    } else if (appliedPromo.discountType === 'fixed') {
      calculatedDiscount = Math.min(subtotal, appliedPromo.value);
    }
  }
  const discount = calculatedDiscount;

  const total = Math.max(0, subtotal - discount + deliveryFee + serviceFee + tip);
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_MIN - subtotal);

  // Promo code
  const applyPromoCode = (codeStr: string): boolean => {
    setPromoError(null);
    const cleaned = codeStr.trim().toUpperCase();
    const found = PROMO_CODES.find((p) => p.code.toUpperCase() === cleaned);
    if (!found) {
      setPromoError('Invalid coupon code. Try TEMU90, FREESHIP, or NAIJA10');
      showToast('Invalid promo code', 'error');
      return false;
    }
    if (subtotal < found.minOrderValue) {
      const err = `Minimum spend of $${found.minOrderValue.toFixed(2)} required for this coupon.`;
      setPromoError(err);
      showToast(err, 'error');
      return false;
    }
    setAppliedPromo(found);
    showToast(`Code ${found.code} applied! Saved discount.`, 'success');
    return true;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
    showToast('Promo code removed', 'info');
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Addresses
  const addNewAddress = async (newAddrData: Omit<DeliveryAddress, 'id'>) => {
    const id = `addr-${Date.now()}`;
    const newAddr: DeliveryAddress = { id, ...newAddrData };
    const updated = newAddrData.isDefault
      ? [newAddr, ...savedAddresses.map((a) => ({ ...a, isDefault: false }))]
      : [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    if (newAddrData.isDefault || savedAddresses.length === 0) {
      setCurrentAddress(newAddr);
    }
    if (user) {
      const updatedUser: UserProfile = { ...user, savedAddresses: updated };
      setUser(updatedUser);
      if (auth.currentUser || user.id) {
        try {
          await saveUserProfileToFirestore(updatedUser);
        } catch (e) {
          console.warn('Firestore write address error:', e);
        }
      }
    }
    showToast('New delivery address saved!', 'success');
  };

  const updateAddress = async (address: DeliveryAddress) => {
    const updated = savedAddresses.map((a) => (a.id === address.id ? address : a));
    setSavedAddresses(updated);
    if (currentAddress.id === address.id) {
      setCurrentAddress(address);
    }
    if (user) {
      const updatedUser: UserProfile = { ...user, savedAddresses: updated };
      setUser(updatedUser);
      if (auth.currentUser || user.id) {
        try {
          await saveUserProfileToFirestore(updatedUser);
        } catch (e) {
          console.warn('Firestore update address error:', e);
        }
      }
    }
    showToast('Address updated successfully', 'success');
  };

  const deleteAddress = async (id: string) => {
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    if (currentAddress.id === id) {
      const remaining = savedAddresses.filter((a) => a.id !== id);
      if (remaining.length > 0) setCurrentAddress(remaining[0]);
    }
    if (user) {
      const updatedUser: UserProfile = { ...user, savedAddresses: updated };
      setUser(updatedUser);
      if (auth.currentUser || user.id) {
        try {
          await saveUserProfileToFirestore(updatedUser);
        } catch (e) {
          console.warn('Firestore delete address error:', e);
        }
      }
    }
    showToast('Address removed', 'info');
  };

  const setDefaultAddress = async (id: string) => {
    const target = savedAddresses.find((a) => a.id === id);
    if (!target) return;
    const updated = savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setSavedAddresses(updated);
    setCurrentAddress({ ...target, isDefault: true });
    if (user) {
      const updatedUser: UserProfile = { ...user, savedAddresses: updated };
      setUser(updatedUser);
      if (auth.currentUser || user.id) {
        try {
          await saveUserProfileToFirestore(updatedUser);
        } catch (e) {
          console.warn('Firestore set default address error:', e);
        }
      }
    }
    showToast(`"${target.title}" set as default delivery address`, 'success');
  };

  // Process checkout & create order
  const processOrder = (
    deliverySlot: string,
    paymentMethod: string,
    address: DeliveryAddress,
    paymentMeta?: {
      paymentReference?: string;
      paymentGateway?: Order['paymentGateway'];
      paystackDetails?: Order['paystackDetails'];
    }
  ): Order => {
    const newOrderNumber = `CN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      createdAt: 'Just now',
      status: 'confirmed',
      items: [...cart],
      subtotal,
      deliveryFee,
      serviceFee,
      tip,
      discount,
      promoCodeApplied: appliedPromo?.code,
      total,
      currency: currencyConfig.code,
      currencyRate: currencyConfig.rate,
      address,
      timeSlot: deliverySlot,
      paymentMethod,
      paymentReference: paymentMeta?.paymentReference,
      paymentGateway: paymentMeta?.paymentGateway || (paymentMethod.toLowerCase().includes('paystack') ? 'paystack' : undefined),
      paymentStatus: 'paid',
      paystackDetails: paymentMeta?.paystackDetails,
      estimatedDeliveryTime: 'Dispatch in progress (24-48h)',
      shopper: {
        name: 'Chinedu Okafor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 4.98,
        phone: '+234 (802) 392-8812',
      },
      driver: {
        name: 'Tunde Bakare',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        vehicle: 'Express Dispatch Van',
        plateNumber: 'LAG-482-XY',
        rating: 4.96,
        phone: '+234 (809) 481-9023',
        etaMinutes: 40,
        progressPercent: 20,
      },
      trackingSteps: [
        {
          status: 'confirmed',
          title: 'Order Confirmed & Paid',
          description: 'Payment processed and transmitted to fulfillment hub',
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'picking',
          title: 'Quality Testing & Inspection',
          description: 'Items carefully checked, power tested and boxed',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'packed',
          title: 'Anti-Shock Sealed & Barcoded',
          description: 'Protected inside shockproof bubble-air packaging',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'on_the_way',
          title: 'Courier Tunde is On the Way',
          description: 'Out for final doorstep dispatch with live route updates',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'delivered',
          title: 'Delivered to Recipient',
          description: 'Delivered safely to recipient with delivery signature proof',
          timestamp: 'Est. 24-48h',
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update user stats
    if (user) {
      setUser((prev) => (prev ? { ...prev, totalSaved: prev.totalSaved + (discount > 0 ? discount : 4.99) } : null));
    }

    clearCart();
    setIsCheckoutOpen(false);
    setTrackingOrderId(newOrder.id);
    setCurrentTab('orders');

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ea580c', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    showToast(`🎉 Order ${newOrder.orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  // Reorder items
  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.pickerNote);
    });
    setIsCartOpen(true);
    showToast(`Added ${order.items.length} items from ${order.orderNumber} to cart!`);
  };

  // Simulate next order status
  const simulateNextOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const statusFlow: OrderStatus[] = ['confirmed', 'picking', 'packed', 'on_the_way', 'delivered'];
        const currentIndex = statusFlow.indexOf(order.status);
        if (currentIndex < statusFlow.length - 1) {
          const nextStatus = statusFlow[currentIndex + 1];
          const newSteps = order.trackingSteps.map((step) => {
            const stepIdx = statusFlow.indexOf(step.status);
            const targetIdx = statusFlow.indexOf(nextStatus);
            if (stepIdx < targetIdx) {
              return { ...step, completed: true, current: false, timestamp: 'Completed' };
            } else if (stepIdx === targetIdx) {
              return { ...step, completed: nextStatus === 'delivered', current: nextStatus !== 'delivered', timestamp: 'Just now' };
            } else {
              return { ...step, completed: false, current: false };
            }
          });

          const progressPercent =
            nextStatus === 'confirmed' ? 20 :
            nextStatus === 'picking' ? 45 :
            nextStatus === 'packed' ? 70 :
            nextStatus === 'on_the_way' ? 85 : 100;

          const etaMinutes = nextStatus === 'delivered' ? 0 : Math.max(5, order.driver.etaMinutes - 8);

          return {
            ...order,
            status: nextStatus,
            driver: {
              ...order.driver,
              progressPercent,
              etaMinutes,
            },
            trackingSteps: newSteps,
          };
        }
        return order;
      })
    );
    showToast('Updated order tracking status', 'info');
  };

  const openProductDetail = (prod: Product) => setSelectedProduct(prod);
  const closeProductDetail = () => setSelectedProduct(null);

  const openOrderTracker = (orderId: string) => setTrackingOrderId(orderId);
  const closeOrderTracker = () => setTrackingOrderId(null);

  const toggleDietaryFilter = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDietary([]);
    setSearchQuery('');
    setPriceRange([0, 100]);
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyOnSale(false);
    setOnlyOrganic(false);
    setSortBy('featured');
    showToast('Filters cleared', 'info');
  };

  // Filter and Sort Products
  const products = React.useMemo(() => {
    let result = [...productList];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.dietary.some((d) => d.toLowerCase().includes(q))
      );
    }

    // Filter by Dietary Requirements
    if (selectedDietary.length > 0) {
      result = result.filter((p) =>
        selectedDietary.every((diet) =>
          p.dietary.includes(diet as DietaryTag) || (diet === 'organic' && p.isOrganic)
        )
      );
    }

    // Filter by Price Range [min, max]
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Filter by Minimum Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Filter by In-Stock Only
    if (onlyInStock) {
      result = result.filter((p) => p.stockCount > 0);
    }

    // Filter by On Sale Only
    if (onlyOnSale) {
      result = result.filter((p) => !!p.originalPrice && p.originalPrice > p.price);
    }

    // Filter by Organic Only
    if (onlyOrganic) {
      result = result.filter((p) => p.isOrganic || p.dietary.includes('organic'));
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'most-reviewed') {
      result.sort((a, b) => (b.soldCount || b.reviewsCount) - (a.soldCount || a.reviewsCount));
    }

    return result;
  }, [
    productList,
    selectedCategory,
    searchQuery,
    selectedDietary,
    priceRange,
    minRating,
    onlyInStock,
    onlyOnSale,
    onlyOrganic,
    sortBy,
  ]);

  const activeOrder = orders.find((o) => o.status !== 'delivered') || null;

  return (
    <ShopContext.Provider
      value={{
        products,
        allProducts: productList,
        currentTab,
        setCurrentTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedDietary,
        toggleDietaryFilter,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        onlyInStock,
        setOnlyInStock,
        onlyOnSale,
        setOnlyOnSale,
        onlyOrganic,
        setOnlyOrganic,
        sortBy,
        setSortBy,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        clearFilters,
        isFilterModalOpen,
        setIsFilterModalOpen,
        theme,
        setTheme,
        toggleTheme,
        selectedRegion,
        setSelectedRegion,
        regionConfig,
        regions: REGIONS,
        selectedLanguage,
        setSelectedLanguage,
        languageConfig,
        languages: LANGUAGES,
        isRegionLangModalOpen,
        setIsRegionLangModalOpen,
        t,
        currency,
        setCurrency,
        currencyConfig,
        currencies: CURRENCIES,
        convertPrice,
        formatPrice,
        reviews,
        getProductReviews,
        addReview,
        voteHelpfulReview,
        getProductRatingSummary,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
        user,
        firebaseAuthUser,
        isAuthLoading,
        isAuthenticated: !!user,
        isAdmin,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        login,
        loginCustomer,
        loginAdmin,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAccountSwitcherOpen,
        setIsAccountSwitcherOpen,
        savedAccounts,
        switchAccount,
        removeSavedAccount,
        savePaymentMethod,
        updatePaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        toggleProMembership,
        addNewAddress,
        deleteAddress,
        updateAddress,
        setDefaultAddress,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminUpdateOrderStatus,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        setPickerNote,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        deliveryFee,
        serviceFee,
        discount,
        tip,
        setTip,
        total,
        freeDeliveryThreshold: FREE_DELIVERY_MIN,
        amountNeededForFreeDelivery,
        totalItemsCount,
        appliedPromo,
        promoError,
        applyPromoCode,
        removePromoCode,
        currentAddress,
        savedAddresses,
        setCurrentAddress,
        isAddressModalOpen,
        setIsAddressModalOpen,
        updateOrderAddress,
        isUpdateOrderAddressModalOpen,
        setIsUpdateOrderAddressModalOpen,
        activeUpdateAddressOrderId,
        openUpdateOrderAddress,
        closeUpdateOrderAddress,
        isCheckoutOpen,
        setIsCheckoutOpen,
        processOrder,
        orders,
        activeOrder,
        trackingOrderId,
        openOrderTracker,
        closeOrderTracker,
        reorder,
        simulateNextOrderStatus,
        driverMessages,
        sendDriverMessage,
        isDriverContactModalOpen,
        setIsDriverContactModalOpen,
        activeDriverContactOrderId,
        openDriverContact,
        closeDriverContact,
        favorites,
        toggleFavorite,
        isFavorite,
        sourcingRequests,
        submitSourcingRequest,
        updateSourcingRequestStatus,
        isSourcingModalOpen,
        setIsSourcingModalOpen,
        sourcingQuery,
        setSourcingQuery,
        openSourcingModalWithQuery,
        addSourcedProductToCart,
        toasts,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
