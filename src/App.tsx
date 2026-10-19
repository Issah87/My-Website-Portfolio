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
import { MyOrdersPage } from './components/orders/MyOrdersPage';
import { OwnerPortalPage } from './components/owner/OwnerPortalPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { WebsiteInquiryModal } from './components/modals/WebsiteInquiryModal';
import { SizeGuideModal } from './components/modals/SizeGuideModal';
import { FlyerModal } from './components/modals/FlyerModal';
import { CategoriesModal } from './components/modals/CategoriesModal';

const AppContent: React.FC = () => {
  const { activeTab } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-pink-100 selection:text-[#5B0F2A]">
      {/* Top Announcements with Ghana location & direct email */}
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
        {activeTab === 'my-orders' && <MyOrdersPage />}
        {activeTab === 'owner-portal' && <OwnerPortalPage />}
      </main>

      {/* Footer with flyer details, Oforikrom address & email */}
      <Footer />

      {/* Modals & Drawers */}
      <CartDrawer />
      <WebsiteInquiryModal />
      <SizeGuideModal />
      <FlyerModal />
      <CategoriesModal />
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
