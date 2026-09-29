import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  StoreSettings, 
  ModestCategory, 
  AbayaLength, 
  ProductColor 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/mockProducts';
import { normalizeWhatsAppNumber } from '../utils/sendWhatsAppOrder';

interface ShopFilters {
  category: ModestCategory;
  sizes: AbayaLength[];
  colors: string[];
  searchQuery: string;
}

const DEFAULT_FILTERS: ShopFilters = {
  category: 'All',
  sizes: [],
  colors: [],
  searchQuery: '',
};

interface ShopContextType {
  // Products
  products: Product[];
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Cart / Inquiries
  cart: CartItem[];
  addToCart: (product: Product, size: AbayaLength, color: ProductColor, customNotes?: string) => boolean;
  updateCartQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders & Inquiries
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber'>) => Order;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;

  // Store
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Search & Filters
  filters: ShopFilters;
  setFilters: React.Dispatch<React.SetStateAction<ShopFilters>>;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Modals & UI States
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  isFlyerModalOpen: boolean;
  setIsFlyerModalOpen: (open: boolean) => void;
  selectedWhatsAppProduct: Product | null;
  selectedWhatsAppColor: ProductColor | null;
  selectedWhatsAppLength: AbayaLength | null;
  selectedWhatsAppIntent: 'buy' | 'inquire';
  openWhatsAppModal: (product?: Product, color?: ProductColor, length?: AbayaLength, intent?: 'buy' | 'inquire') => void;

  // Navigation
  activeTab: 'home' | 'shop' | 'product-detail' | 'checkout' | 'order-success' | 'story';
  setActiveTab: (tab: 'home' | 'shop' | 'product-detail' | 'checkout' | 'order-success' | 'story') => void;
  selectedProductSlug: string | null;
  viewProduct: (slug: string) => void;

  // Helper for obtaining absolute public URL for dress pictures
  getAbsoluteImageUrl: (imagePath?: string) => string;

  // Helper for quick WhatsApp message with dress details & picture
  getWhatsAppOrderUrl: (
    productOrText?: Product | string, 
    size?: string, 
    color?: string | ProductColor, 
    customNotes?: string,
    intent?: 'buy' | 'inquire'
  ) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const getAbsoluteImageUrl = (imagePath?: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${origin}${cleanPath}`;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persisted Products (v5 includes matching images for each color)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('alikhlas_gh_products_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
          return parsed;
        }
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Persisted Cart / Inquiry bag
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('alikhlas_gh_cart_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persisted Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('alikhlas_gh_wishlist_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // Store Settings (Flyer, Oforikrom, Accra Town, WhatsApp 050 127 3875 / 024 284 2090, email issahn712@gmail.com)
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('alikhlas_gh_settings_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          email: 'issahn712@gmail.com',
          ownerWhatsApp: '233501273875',
          secondaryWhatsApp: '233242842090',
        };
      } catch {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  // Orders / Sewing Inquiries
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('alikhlas_gh_orders_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'ord-101',
        orderNumber: 'AIFC-GH-104',
        customer: {
          fullName: 'Hajia Mariama Baako',
          phone: '024 456 7890',
          region: 'Ashanti Region (Kumasi, Oforikrom, Asokwa, Bantama, etc.)',
          townCity: 'Oforikrom, Kumasi',
          landmarkAddress: 'Near Central Mosque, Accra Town',
          preferredContact: 'WhatsApp',
        },
        items: [
          {
            id: 'item-1',
            productId: 'prod-001',
            name: 'Two-Tone Teal Capelet Pleated Maxi Abaya Dress',
            priceText: 'Price on Request',
            image: products[0]?.images[0] || '',
            size: '56"',
            color: { name: 'Petrol Teal & Sand Beige', hex: '#1B5B66' },
            quantity: 1,
            customNotes: 'Please ensure length touches shoes for Eid prayer.',
          }
        ],
        paymentMethod: 'whatsapp',
        paymentStatus: 'Pending Verification',
        orderStatus: 'Sewing in Progress',
        trackingNumber: 'AIFC-KMS-0042',
        createdAt: new Date().toISOString(),
      }
    ];
  });

  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'product-detail' | 'checkout' | 'order-success' | 'story'>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [selectedWhatsAppProduct, setSelectedWhatsAppProduct] = useState<Product | null>(null);
  const [selectedWhatsAppColor, setSelectedWhatsAppColor] = useState<ProductColor | null>(null);
  const [selectedWhatsAppLength, setSelectedWhatsAppLength] = useState<AbayaLength | null>(null);
  const [selectedWhatsAppIntent, setSelectedWhatsAppIntent] = useState<'buy' | 'inquire'>('buy');

  // Filters
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);

  // Storage synchronization
  useEffect(() => {
    localStorage.setItem('alikhlas_gh_products_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_cart_v3', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_wishlist_v3', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_settings_v4', JSON.stringify(settings));
  }, [settings]);

  // Cart operations
  const addToCart = (product: Product, size: AbayaLength, color: ProductColor, customNotes?: string): boolean => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id && item.size === size && item.color.name === color.name);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + 1,
          customNotes: customNotes || updated[existingIdx].customNotes,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `${product.id}-${size}-${color.name}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          priceText: product.priceText,
          image: color.image || product.images[0] || '',
          size,
          color,
          quantity: 1,
          customNotes,
        }
      ];
    });
    setIsCartDrawerOpen(true);
    return true;
  };

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Product management
  const saveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [product, ...prev];
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `AIFC-GH-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: `AIFC-GH-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Filters
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filteredProducts = products.filter(p => {
    if (filters.category !== 'All' && p.category !== filters.category) return false;
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    if (filters.sizes.length > 0) {
      const hasSize = p.sizes.some(s => filters.sizes.includes(s));
      if (!hasSize) return false;
    }
    if (filters.colors.length > 0) {
      const hasColor = p.colors.some(c => filters.colors.includes(c.name));
      if (!hasColor) return false;
    }
    return true;
  });

  const viewProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsAppModal = (
    product?: Product, 
    color?: ProductColor, 
    length?: AbayaLength,
    intent: 'buy' | 'inquire' = 'buy'
  ) => {
    setSelectedWhatsAppProduct(product || null);
    setSelectedWhatsAppColor(color || product?.colors[0] || null);
    setSelectedWhatsAppLength(length || product?.sizes[2] || '54"');
    setSelectedWhatsAppIntent(intent);
    setIsWhatsAppModalOpen(true);
  };

  // Helper for generating custom WhatsApp link directly
  const getWhatsAppOrderUrl = (
    productOrText?: Product | string, 
    size?: string, 
    color?: string | ProductColor, 
    customNotes?: string,
    intent: 'buy' | 'inquire' = 'buy'
  ): string => {
    let msg = '';
    if (typeof productOrText === 'string') {
      msg = productOrText;
    } else if (productOrText) {
      const colorName = typeof color === 'object' && color !== null 
        ? color.name 
        : (color || productOrText.colors[0]?.name || 'As pictured');
      const colorImg = typeof color === 'object' && color !== null ? color.image : undefined;
      const lengthVal = size || '54"';
      const isBuying = intent === 'buy';
      const photoSrc = colorImg || productOrText.images[0];
      const photoUrl = photoSrc ? getAbsoluteImageUrl(photoSrc) : '';
      
      msg = `🌟 AL-IKHLAS FASHION CENTER · GHANA 🌟\n` +
            `Shop Location: Oforikrom, Accra Town Behind Central Mosque\n\n` +
            `Hello! I want to ${isBuying ? 'BUY / PLACE AN ORDER' : 'INQUIRE ABOUT PRICING & SEWING'} for this dress:\n\n` +
            `👗 Dress Model: "${productOrText.name}"\n` +
            `🎨 Chosen Color / Shade: ${colorName}\n` +
            `📏 Selected Length: ${lengthVal}\n` +
            `🏷️ Category: ${productOrText.category}\n`;
      if (photoUrl) {
        msg += `📸 Attached Dress Picture (${colorName}): ${photoUrl}\n`;
      }
      if (customNotes?.trim()) {
        msg += `📝 Tailoring / Measurements Notes: ${customNotes.trim()}\n`;
      }
      if (isBuying) {
        msg += `\nI am ready to buy. Please provide the final price quote, MoMo / cash payment details, and estimated turnaround time so sewing can begin!`;
      } else {
        msg += `\nPlease provide the price quote and sewing turnaround time. Thank you!`;
      }
    } else {
      msg = `Hello Al-Ikhlas Fashion Center (Oforikrom, Accra Town Behind Central Mosque)! I would like to inquire about buying straight dresses, gathered & pleated abayas with my chosen colors.`;
    }
    const targetPhone = normalizeWhatsAppNumber(settings.ownerWhatsApp || '233501273875');
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        saveProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        wishlist,
        toggleWishlist,
        orders,
        createOrder,
        lastCreatedOrder,
        setLastCreatedOrder,
        settings,
        updateSettings,
        filters,
        setFilters,
        resetFilters,
        filteredProducts,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        isFlyerModalOpen,
        setIsFlyerModalOpen,
        selectedWhatsAppProduct,
        selectedWhatsAppColor,
        selectedWhatsAppLength,
        selectedWhatsAppIntent,
        openWhatsAppModal,
        activeTab,
        setActiveTab,
        selectedProductSlug,
        viewProduct,
        getAbsoluteImageUrl,
        getWhatsAppOrderUrl,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
