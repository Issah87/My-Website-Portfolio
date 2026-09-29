export type ModestCategory = 
  | 'All'
  | 'Abayas'
  | 'Straight Abayas & Dresses'
  | 'Gathered Abayas'
  | 'Pleated Abayas'
  | 'Capelet & Two-Piece Sets';

export type AbayaLength = '50"' | '52"' | '54"' | '56"' | '58"' | '60"' | 'Custom Fit';

export interface ProductColor {
  name: string;
  hex: string;
  secondaryHex?: string;
  image?: string;
}

export interface SizeInventory {
  size: AbayaLength;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ModestCategory;
  priceText: string; // e.g. "Price on Request / Contact via WhatsApp"
  colors: ProductColor[];
  sizes: AbayaLength[];
  inventory: SizeInventory[];
  description: string;
  details: string[];
  fabricCare: string[];
  images: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  bestseller?: boolean;
  badge?: string;
  customSewingAvailable?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  priceText: string;
  image: string;
  size: AbayaLength;
  color: ProductColor;
  quantity: number;
  customNotes?: string;
}

export type PaymentMethod = 'momo' | 'cod' | 'whatsapp';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  altPhone?: string;
  email?: string;
  region: string; // Greater Accra, Ashanti, etc.
  townCity: string; // Oforikrom, Kumasi, Accra, Madina, etc.
  landmarkAddress: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending Verification' | 'MoMo Confirmed' | 'Pay on Pickup/Delivery';
  orderStatus: 'Inquiry Received' | 'Sewing in Progress' | 'Ready for Pickup / Dispatch' | 'Delivered';
  trackingNumber: string;
  createdAt: string;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  primaryDomain: string;
  location: string;
  addressDetails: string;
  email: string; // issahn712@gmail.com
  phones: string[];
  ownerWhatsApp: string; // 233501273875 (050 127 3875)
  secondaryWhatsApp: string; // 233242842090 (024 284 2090)
  altPhone: string; // 026 446 0744
  services: string[];
}
