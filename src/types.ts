export type DietaryTag = 'vegan' | 'gluten-free' | 'organic' | 'keto' | 'dairy-free' | 'low-carb' | 'non-gmo';

export type ThemeMode = 'light' | 'dark';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'CHF' | 'SGD' | 'AED' | 'NGN' | 'KES' | 'ZAR' | 'GHS' | 'CNY' | 'BRL';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // exchange rate relative to 1 USD
  flag: string;
}

export type RegionCode = 'NG' | 'US' | 'GB' | 'CA' | 'EU' | 'KE' | 'ZA' | 'GH' | 'AE' | 'JP' | 'CN' | 'IN' | 'AU' | 'BR';

export interface RegionConfig {
  code: RegionCode;
  name: string;
  flag: string;
  defaultCurrency: CurrencyCode;
  defaultLanguage: LanguageCode;
  shippingNotice: string;
  phonePrefix: string;
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'ja' | 'pt' | 'ha' | 'yo' | 'ig' | 'sw' | 'zh';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export type UserRole = 'customer' | 'admin';

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  tags?: string[];
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer' | 'paystack';
  brand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'verve';
  last4?: string;
  holderName?: string;
  expiry?: string;
  email?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  isPro: boolean;
  proExpiryDate?: string;
  totalSaved: number;
  dietaryPreferences: DietaryTag[];
  savedAddresses: DeliveryAddress[];
  savedPaymentMethods: SavedPaymentMethod[];
  notifications: {
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promoAlerts: boolean;
  };
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  sampleParams?: Record<string, string>;
  sampleResponse?: any;
}

export interface ApiDetails {
  baseUrl: string;
  docsUrl: string;
  authType: 'No Auth / Free' | 'Bearer Token' | 'API Key' | 'OAuth 2.0' | 'Custom';
  https: boolean;
  cors: boolean;
  uptime: string;
  latency: string;
  endpoints: ApiEndpoint[];
}

export type ItemType = 'api' | 'developer_tool' | 'hardware' | 'physical_goods' | 'sourced_item';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  rating: number;
  reviewsCount: number;
  soldCount?: number;
  isOrganic?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isFlashDeal?: boolean;
  badge?: string;
  stockCount: number;
  dietary: DietaryTag[];
  description: string;
  origin: string;
  farmStory: string;
  nutrition: NutritionInfo;
  allergens: string[];
  storageTips: string;
  ingredients: string;
  pairsWithIds?: string[];
  sourceUrl?: string;
  sourcePlatform?: string; // e.g. 'Jumia Nigeria (jumia.com.ng)', 'Global Supplier Hub', 'Direct Factory Export'
  isCustomSourced?: boolean;
  itemType?: ItemType;
  apiDetails?: ApiDetails;
  tags?: string[];
}

export type SourcingStatus = 'quoted' | 'approved' | 'in_procurement' | 'dispatched';

export interface SourcedProductRequest {
  id: string;
  productName: string;
  sourceUrl?: string;
  category: string;
  targetBudget?: number;
  quantity: number;
  notes?: string;
  status: SourcingStatus;
  estimatedPrice: number;
  originalMarketPrice?: number;
  estimatedDeliveryDays: string;
  sourceOrigin: string; // e.g. 'Jumia Nigeria (jumia.com.ng)', 'Global Supplier Hub'
  imageUrl: string;
  createdAt: string;
  userEmail?: string;
  userName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  pickerNote?: string;
}

export type OrderStatus = 'confirmed' | 'picking' | 'packed' | 'on_the_way' | 'delivered';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface DeliveryAddress {
  id: string;
  title: string;
  street: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country?: string;
  instructions?: string;
  landmark?: string;
  recipientName?: string;
  recipientPhone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault?: boolean;
}

export interface DriverMessage {
  id: string;
  orderId: string;
  sender: 'user' | 'driver' | 'system';
  text: string;
  time: string;
  type?: 'text' | 'address_update' | 'location_pin' | 'gate_code' | 'call_log';
}

export interface DriverInfo {
  name: string;
  avatar: string;
  vehicle: string;
  plateNumber: string;
  rating: number;
  phone: string;
  etaMinutes: number;
  progressPercent: number;
  vanModel?: string;
  vanColor?: string;
  statusNote?: string;
  dispatchHub?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  discount: number;
  promoCodeApplied?: string;
  total: number;
  currency: CurrencyCode;
  currencyRate: number;
  address: DeliveryAddress;
  timeSlot: string;
  paymentMethod: string;
  estimatedDeliveryTime: string;
  shopper: {
    name: string;
    avatar: string;
    rating: number;
    phone: string;
  };
  driver: DriverInfo;
  trackingSteps: TrackingStep[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  description: string;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderValue: number;
  description: string;
}
