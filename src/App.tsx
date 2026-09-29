import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessView } from './components/order/OrderSuccessView';
import { AtelierStoryPage } from './components/story/AtelierStoryPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { SizeGuideModal } from './components/modals/SizeGuideModal';
import { FlyerModal } from './components/modals/FlyerModal';

const AppContent: React.FC = () => {
  const { activeTab } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-pink-100 selection:text-[#5B0F2A]">
      {/* Top Announcements with Ghana location & direct hotline */}
      <AnnouncementBar />

      {/* Navigation Top Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'shop' && <ShopPage />}
        {activeTab === 'product-detail' && <ProductDetailPage />}
        {activeTab === 'checkout' && <CheckoutPage />}
        {activeTab === 'order-success' && <OrderSuccessView />}
        {activeTab === 'story' && <AtelierStoryPage />}
      </main>

      {/* Footer with flyer details, Oforikrom address & phone numbers */}
      <Footer />

      {/* Modals & Drawers */}
      <CartDrawer />
      <WhatsAppModal />
      <SizeGuideModal />
      <FlyerModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
