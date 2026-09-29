import React, { useState } from 'react';
import { ShoppingBag, Search, Phone, MessageCircle, Menu, X, Scissors, MapPin } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ModestCategory } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cartCount, 
    setIsCartDrawerOpen, 
    openWhatsAppModal,
    setIsFlyerModalOpen,
    setFilters 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearchOpen, setNavSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const navigateToCategory = (cat: ModestCategory) => {
    setFilters(prev => ({ ...prev, category: cat, searchQuery: '' }));
    setActiveTab('shop');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      setFilters(prev => ({ ...prev, searchQuery: navSearchQuery, category: 'All' }));
      setActiveTab('shop');
      setNavSearchOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* ZONE 1: Single text element wordmark */}
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col text-left cursor-pointer group"
          >
            <span className="font-serif-brand text-2xl sm:text-3xl tracking-tight text-[#4A0A1F] font-bold group-hover:text-[#6E1130] transition-colors">
              Al-Ikhlas Fashion Center
            </span>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium hidden sm:block">
              Your One Stop Shop Abaya Plug · Oforikrom, Ghana
            </span>
          </button>

          {/* ZONE 2: 4-6 clean text navigation links (single line, subtle hover underline) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide text-stone-700">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`pb-1 transition-colors relative cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#5B0F2A] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#5B0F2A]'
                  : 'hover:text-[#5B0F2A]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'All' }));
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`pb-1 transition-colors relative cursor-pointer ${
                activeTab === 'shop'
                  ? 'text-[#5B0F2A] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#5B0F2A]'
                  : 'hover:text-[#5B0F2A]'
              }`}
            >
              All Dresses
            </button>

            <button
              onClick={() => navigateToCategory('Straight Abayas & Dresses')}
              className="pb-1 hover:text-[#5B0F2A] transition-colors cursor-pointer"
            >
              Straight Cut
            </button>

            <button
              onClick={() => navigateToCategory('Gathered Abayas')}
              className="pb-1 hover:text-[#5B0F2A] transition-colors cursor-pointer"
            >
              Gathered
            </button>

            <button
              onClick={() => navigateToCategory('Pleated Abayas')}
              className="pb-1 hover:text-[#5B0F2A] transition-colors cursor-pointer"
            >
              Pleated
            </button>

            <button
              onClick={() => navigateToCategory('Capelet & Two-Piece Sets')}
              className="pb-1 hover:text-[#5B0F2A] transition-colors cursor-pointer"
            >
              Capelet Sets
            </button>

            <button
              onClick={() => {
                setActiveTab('story');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`pb-1 transition-colors relative cursor-pointer ${
                activeTab === 'story'
                  ? 'text-[#5B0F2A] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#5B0F2A]'
                  : 'hover:text-[#5B0F2A]'
              }`}
            >
              Sewing & Location
            </button>
          </nav>

          {/* ZONE 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search bar toggle */}
            <div className="relative">
              {navSearchOpen ? (
                <form onSubmit={handleNavSearch} className="flex items-center">
                  <input
                    type="text"
                    value={navSearchQuery}
                    onChange={(e) => setNavSearchQuery(e.target.value)}
                    placeholder="Search dress styles..."
                    className="w-36 sm:w-52 text-xs py-1.5 pl-3 pr-8 rounded-full border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setNavSearchOpen(false)}
                    className="absolute right-2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setNavSearchOpen(true)}
                  className="p-2 text-stone-700 hover:text-[#5B0F2A] transition-colors cursor-pointer"
                  aria-label="Search Collection"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Direct Call Shop Button */}
            <a
              href="tel:0501273875"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5B0F2A] bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded transition-colors"
              title="Call 050 127 3875"
            >
              <Phone className="w-3.5 h-3.5 text-[#5B0F2A]" />
              <span className="font-mono font-bold">050 127 3875</span>
            </a>

            {/* Direct WhatsApp Concierge */}
            <button
              onClick={() => openWhatsAppModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp 050 127 3875</span>
            </button>

            {/* Inquiries / Selection Bag */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
              aria-label="View Selected Dresses"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#5B0F2A] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 py-4 px-2 space-y-3 bg-[#FAF9F5]">
            <div className="p-3 bg-pink-50 border border-pink-200 rounded text-xs space-y-1">
              <span className="font-semibold text-[#5B0F2A] block">Al-Ikhlas Fashion Center</span>
              <p className="text-[11px] text-stone-600">Oforikrom, Accra Town Behind Central Mosque</p>
              <div className="pt-1 flex flex-wrap gap-2 font-mono font-bold text-xs text-[#5B0F2A]">
                <a href="tel:0501273875" className="hover:underline">📞 050 127 3875</a>
                <span>·</span>
                <a href="tel:0242842090" className="hover:underline">📞 024 284 2090</a>
              </div>
              <p className="text-[11px] text-stone-500 pt-0.5">Email: issahn712@gmail.com</p>
            </div>

            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-sm font-medium text-stone-900 hover:bg-stone-100 rounded"
            >
              Home
            </button>
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'All' }));
                setActiveTab('shop');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-sm font-medium text-stone-900 hover:bg-stone-100 rounded"
            >
              All Modest Dresses
            </button>
            <button
              onClick={() => navigateToCategory('Straight Abayas & Dresses')}
              className="block w-full text-left py-2 px-3 text-sm text-stone-700 hover:bg-stone-100 rounded"
            >
              Straight Cut Abayas & Dresses
            </button>
            <button
              onClick={() => navigateToCategory('Gathered Abayas')}
              className="block w-full text-left py-2 px-3 text-sm text-stone-700 hover:bg-stone-100 rounded"
            >
              Gathered Waist & Tiered Abayas
            </button>
            <button
              onClick={() => navigateToCategory('Pleated Abayas')}
              className="block w-full text-left py-2 px-3 text-sm text-stone-700 hover:bg-stone-100 rounded"
            >
              Accordion & Knife Pleated Abayas
            </button>
            <button
              onClick={() => navigateToCategory('Capelet & Two-Piece Sets')}
              className="block w-full text-left py-2 px-3 text-sm text-stone-700 hover:bg-stone-100 rounded"
            >
              Two-Tone Capelet Sets
            </button>
            <button
              onClick={() => {
                setIsFlyerModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-sm font-semibold text-[#5B0F2A] hover:bg-pink-100 rounded"
            >
              View Official Shop Flyer
            </button>
            <button
              onClick={() => {
                setActiveTab('story');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-sm font-medium text-stone-900 hover:bg-stone-100 rounded"
            >
              Shop Location & Sewing Services
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
