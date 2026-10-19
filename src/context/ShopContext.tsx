import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderMessage,
  WebsiteInquiry,
  StoreSettings, 
  ModestCategory, 
  AbayaLength, 
  ProductColor 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/mockProducts';

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

  // Orders
  orders: Order[];
  customerOrders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  addOrderMessage: (orderId: string, text: string, sender: 'customer' | 'owner', senderName?: string) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;

  // Customer session
  currentCustomerEmail: string;
  setCurrentCustomerEmail: (email: string) => void;

  // Owner authentication
  isOwnerAuthenticated: boolean;
  loginAsOwner: (pinOrEmail: string) => boolean;
  logoutOwner: () => void;

  // Website Inquiries (Concierge)
  inquiries: WebsiteInquiry[];
  submitInquiry: (data: {
    customerName: string;
    customerEmail: string;
    subject?: string;
    productName?: string;
    colorName?: string;
    length?: string;
    message: string;
  }) => WebsiteInquiry;
  replyToInquiry: (inquiryId: string, replyText: string) => void;

  // Store Settings
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
  isFlyerModalOpen: boolean;
  setIsFlyerModalOpen: (open: boolean) => void;
  isCategoriesModalOpen: boolean;
  setIsCategoriesModalOpen: (open: boolean) => void;
  selectCategory: (category: ModestCategory | string) => void;
  
  // On-Website Inquiry Modal (replaces phone WhatsApp modal)
  isInquiryModalOpen: boolean;
  setIsInquiryModalOpen: (open: boolean) => void;
  selectedInquiryProduct: Product | null;
  selectedInquiryColor: ProductColor | null;
  selectedInquiryLength: AbayaLength | null;
  selectedInquiryIntent: 'buy' | 'inquire';
  openInquiryModal: (product?: Product, color?: ProductColor, length?: AbayaLength, intent?: 'buy' | 'inquire') => void;

  // Backwards compatibility aliases
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  selectedWhatsAppProduct: Product | null;
  selectedWhatsAppColor: ProductColor | null;
  selectedWhatsAppLength: AbayaLength | null;
  selectedWhatsAppIntent: 'buy' | 'inquire';
  openWhatsAppModal: (product?: Product, color?: ProductColor, length?: AbayaLength, intent?: 'buy' | 'inquire') => void;

  // Navigation
  activeTab: 'home' | 'shop' | 'product-detail' | 'checkout' | 'order-success' | 'story' | 'my-orders' | 'owner-portal';
  setActiveTab: (tab: 'home' | 'shop' | 'product-detail' | 'checkout' | 'order-success' | 'story' | 'my-orders' | 'owner-portal') => void;
  selectedProductSlug: string | null;
  viewProduct: (slug: string) => void;

  // Public Image URL helper
  getAbsoluteImageUrl: (imagePath?: string) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const normalizeCategory = (cat?: string): ModestCategory => {
  if (!cat) return 'All';
  const c = cat.toLowerCase().trim();
  if (c === 'all') return 'All';
  if (c.includes('straight')) return 'Straight Abayas & Dresses';
  if (c.includes('gather') || c.includes('boubou') || c.includes('tier')) return 'Gathered Abayas';
  if (c.includes('pleat')) return 'Pleated Abayas';
  if (c.includes('capelet') || c.includes('two-piece') || c.includes('set')) return 'Capelet & Two-Piece Sets';
  if (c.includes('abaya')) return 'Abayas';
  return 'All';
};

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
  // Persisted Products (v6 with unique IDs for all 26 custom dresses)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      localStorage.removeItem('alikhlas_gh_products_v5');
    } catch {
      // ignore
    }
    const saved = localStorage.getItem('alikhlas_gh_products_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
          const ids = new Set(parsed.map(p => p.id));
          if (ids.size === parsed.length) {
            return parsed;
          }
        }
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Persisted Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('alikhlas_gh_cart_v4');
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
    const saved = localStorage.getItem('alikhlas_gh_wishlist_v4');
    return saved ? JSON.parse(saved) : [];
  });

  // Store Settings (No phone numbers, only email: issahn712@gmail.com)
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('alikhlas_gh_settings_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          email: 'issahn712@gmail.com',
        };
      } catch {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  // Active Customer Email Session (so customer can see only their orders)
  const [currentCustomerEmail, setCurrentCustomerEmail] = useState<string>(() => {
    return localStorage.getItem('alikhlas_customer_email') || 'mariama.baako@example.com';
  });

  // Owner Authentication Session (Owner: issahn712@gmail.com or PIN 1234)
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('alikhlas_owner_authenticated') === 'true';
  });

  // Orders / Sewing Inquiries with on-website messages
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('alikhlas_gh_orders_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'ord-101',
        orderNumber: 'AIFC-GH-104',
        customer: {
          fullName: 'Hajia Mariama Baako',
          email: 'mariama.baako@example.com',
          region: 'Ashanti Region (Kumasi, Oforikrom, Asokwa, Bantama, etc.)',
          townCity: 'Oforikrom, Kumasi',
          landmarkAddress: 'Near Central Mosque, Accra Town',
          preferredContact: 'On-Website Portal',
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
        paymentMethod: 'momo',
        paymentStatus: 'MoMo Confirmed',
        orderStatus: 'Sewing in Progress',
        trackingNumber: 'AIFC-KMS-0042',
        createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
        messages: [
          {
            id: 'msg-101-1',
            sender: 'customer',
            senderName: 'Hajia Mariama Baako',
            text: 'As-salamu alaykum. Please ensure the capelet drape is loose and comfortable.',
            createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
          },
          {
            id: 'msg-101-2',
            sender: 'owner',
            senderName: 'Al-Ikhlas Atelier',
            text: 'Wa alaykumu salam Hajia Mariama! We selected our finest matte crepe and cut with extra graceful drape. Sizing is 56" and sewing is actively underway.',
            createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          }
        ],
      },
      {
        id: 'ord-102',
        orderNumber: 'AIFC-GH-105',
        customer: {
          fullName: 'Amina Danlad',
          email: 'amina.d@example.com',
          region: 'Greater Accra (Accra, Madina, East Legon, Tema, etc.)',
          townCity: 'Madina, Accra',
          landmarkAddress: 'Opposite Madina Central Market',
          preferredContact: 'Email',
        },
        items: [
          {
            id: 'item-2',
            productId: 'prod-004',
            name: 'Buttercream Vanilla Bell Sleeve Pleated Flare Dress',
            priceText: 'Price on Request',
            image: products[3]?.images[0] || '',
            size: '54"',
            color: { name: 'Buttercream Vanilla', hex: '#F7E7CE' },
            quantity: 1,
            customNotes: 'Require doorstep dispatch via VIP parcel to Accra.',
          }
        ],
        paymentMethod: 'cod',
        paymentStatus: 'Pay on Pickup/Delivery',
        orderStatus: 'Fabric Sourced',
        trackingNumber: 'AIFC-ACC-0089',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        messages: [
          {
            id: 'msg-102-1',
            sender: 'customer',
            senderName: 'Amina Danlad',
            text: 'Hello! Can this be delivered to Accra by Friday?',
            createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          },
          {
            id: 'msg-102-2',
            sender: 'owner',
            senderName: 'Al-Ikhlas Atelier',
            text: 'Yes Amina! Fabric has been prepared and we will dispatch via VIP bus parcel directly on Thursday morning.',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          }
        ],
      }
    ];
  });

  // Website Inquiries (Concierge messaging)
  const [inquiries, setInquiries] = useState<WebsiteInquiry[]>(() => {
    const saved = localStorage.getItem('alikhlas_gh_inquiries_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'inq-1',
        customerName: 'Fatima Yakubu',
        customerEmail: 'fatima.y@example.com',
        productName: 'Blush Pink Batwing Open Abaya & White Column Dress Set',
        colorName: 'Blush Rose & Alabaster',
        length: '58"',
        message: 'Could this set be tailored with gold embroidery on the cuffs?',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        status: 'Replied',
        ownerReply: 'Yes Fatima, we have metallic gold thread ready. We can add hand-stitched cuff embroidery for a small custom fee.',
        repliedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      }
    ];
  });

  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'product-detail' | 'checkout' | 'order-success' | 'story' | 'my-orders' | 'owner-portal'>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  
  // On-Website Inquiry Modal
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedInquiryProduct, setSelectedInquiryProduct] = useState<Product | null>(null);
  const [selectedInquiryColor, setSelectedInquiryColor] = useState<ProductColor | null>(null);
  const [selectedInquiryLength, setSelectedInquiryLength] = useState<AbayaLength | null>(null);
  const [selectedInquiryIntent, setSelectedInquiryIntent] = useState<'buy' | 'inquire'>('buy');

  // Filters
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);

  // Storage synchronization
  useEffect(() => {
    localStorage.setItem('alikhlas_gh_products_v6', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_cart_v4', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_wishlist_v4', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_orders_v4', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_inquiries_v1', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('alikhlas_gh_settings_v5', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('alikhlas_customer_email', currentCustomerEmail);
  }, [currentCustomerEmail]);

  // Customer filtered orders: Customer views ONLY their own orders
  const customerOrders = orders.filter(ord => {
    if (!currentCustomerEmail.trim()) return false;
    return ord.customer.email.toLowerCase().trim() === currentCustomerEmail.toLowerCase().trim();
  });

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
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'owner',
          senderName: 'Al-Ikhlas Atelier',
          text: `Welcome ${orderData.customer.fullName}! Your dress order has been received by our boutique at Oforikrom, Kumasi. You can send questions, tailoring notes, or custom size adjustments directly in this message thread.`,
          createdAt: new Date().toISOString(),
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    if (orderData.customer.email) {
      setCurrentCustomerEmail(orderData.customer.email);
    }
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const updatedMessages = ord.messages || [];
        return {
          ...ord,
          orderStatus: status,
          messages: [
            ...updatedMessages,
            {
              id: `msg-status-${Date.now()}`,
              sender: 'owner',
              senderName: 'Al-Ikhlas Atelier',
              text: `Order status updated to: "${status}".`,
              createdAt: new Date().toISOString(),
            }
          ]
        };
      }
      return ord;
    }));
  };

  const addOrderMessage = (orderId: string, text: string, sender: 'customer' | 'owner', senderName?: string) => {
    if (!text.trim()) return;
    const newMessage: OrderMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: senderName || (sender === 'owner' ? 'Al-Ikhlas Atelier' : 'Buyer'),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          messages: [...(ord.messages || []), newMessage]
        };
      }
      return ord;
    }));
  };

  // Owner Authentication
  const loginAsOwner = (pinOrEmail: string): boolean => {
    const clean = pinOrEmail.trim().toLowerCase();
    if (clean === '1234' || clean === 'owner' || clean === 'admin' || clean === 'issahn712@gmail.com') {
      setIsOwnerAuthenticated(true);
      sessionStorage.setItem('alikhlas_owner_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwnerAuthenticated(false);
    sessionStorage.removeItem('alikhlas_owner_authenticated');
  };

  // Inquiries
  const submitInquiry = (data: {
    customerName: string;
    customerEmail: string;
    subject?: string;
    productName?: string;
    colorName?: string;
    length?: string;
    message: string;
  }): WebsiteInquiry => {
    const newInquiry: WebsiteInquiry = {
      id: `inq-${Date.now()}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      subject: data.subject || (data.productName ? `Inquiry: ${data.productName}` : 'General Boutique Inquiry'),
      productName: data.productName,
      colorName: data.colorName,
      length: data.length,
      message: data.message,
      createdAt: new Date().toISOString(),
      status: 'New',
    };

    setInquiries(prev => [newInquiry, ...prev]);
    if (data.customerEmail) {
      setCurrentCustomerEmail(data.customerEmail);
    }
    return newInquiry;
  };

  const replyToInquiry = (inquiryId: string, replyText: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'Replied',
          ownerReply: replyText.trim(),
          repliedAt: new Date().toISOString(),
        };
      }
      return inq;
    }));
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Filters
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const selectCategory = (category: ModestCategory | string) => {
    const normalized = normalizeCategory(category);
    setFilters(prev => ({
      ...prev,
      category: normalized,
      searchQuery: '',
    }));
    setActiveTab('shop');
    setIsCategoriesModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter(p => {
    if (filters.category !== 'All') {
      const targetCat = normalizeCategory(filters.category);
      const productCat = normalizeCategory(p.category);
      if (targetCat !== productCat) return false;
    }
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

  const openInquiryModal = (
    product?: Product, 
    color?: ProductColor, 
    length?: AbayaLength,
    intent: 'buy' | 'inquire' = 'buy'
  ) => {
    setSelectedInquiryProduct(product || null);
    setSelectedInquiryColor(color || product?.colors[0] || null);
    setSelectedInquiryLength(length || product?.sizes[2] || '54"');
    setSelectedInquiryIntent(intent);
    setIsInquiryModalOpen(true);
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
        customerOrders,
        createOrder,
        updateOrderStatus,
        addOrderMessage,
        lastCreatedOrder,
        setLastCreatedOrder,
        currentCustomerEmail,
        setCurrentCustomerEmail,
        isOwnerAuthenticated,
        loginAsOwner,
        logoutOwner,
        inquiries,
        submitInquiry,
        replyToInquiry,
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
        isFlyerModalOpen,
        setIsFlyerModalOpen,
        isCategoriesModalOpen,
        setIsCategoriesModalOpen,
        selectCategory,
        isInquiryModalOpen,
        setIsInquiryModalOpen,
        selectedInquiryProduct,
        selectedInquiryColor,
        selectedInquiryLength,
        selectedInquiryIntent,
        openInquiryModal,
        // Aliases for compatibility
        isWhatsAppModalOpen: isInquiryModalOpen,
        setIsWhatsAppModalOpen: setIsInquiryModalOpen,
        selectedWhatsAppProduct: selectedInquiryProduct,
        selectedWhatsAppColor: selectedInquiryColor,
        selectedWhatsAppLength: selectedInquiryLength,
        selectedWhatsAppIntent: selectedInquiryIntent,
        openWhatsAppModal: openInquiryModal,
        activeTab,
        setActiveTab,
        selectedProductSlug,
        viewProduct,
        getAbsoluteImageUrl,
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
