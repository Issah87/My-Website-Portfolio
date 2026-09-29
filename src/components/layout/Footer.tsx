import React from 'react';
import { Phone, MessageCircle, MapPin, Scissors, Image as ImageIcon, Ruler, Mail } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ModestCategory } from '../../types';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

export const Footer: React.FC = () => {
  const { 
    setActiveTab, 
    setFilters, 
    setIsSizeGuideOpen, 
    openWhatsAppModal, 
    setIsFlyerModalOpen,
    settings 
  } = useShop();

  const handleCategoryClick = (cat: ModestCategory) => {
    setFilters(prev => ({ ...prev, category: cat, searchQuery: '' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2D0614] text-[#EAD8DE] pt-14 pb-10 border-t border-[#43091D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-pink-900/40">
          
          {/* Brand & Slogan */}
          <div className="space-y-3.5">
            <span className="font-serif-brand text-2xl font-bold tracking-tight text-white block">
              Al-Ikhlas Fashion Center
            </span>
            <p className="text-xs text-amber-300 font-semibold italic">
              "Your one stop shop Abaya plug · Quality is our Hallmark"
            </p>
            <p className="text-xs text-stone-300 leading-relaxed">
              Ghana's destination for elegant modest tailoring. Specializing in the custom sewing of abayas, flowing French khimars, straight dresses, and hijabs.
            </p>
            
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsFlyerModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors cursor-pointer border border-pink-400/30"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>View Official Flyer</span>
              </button>
            </div>
          </div>

          {/* Shop Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Sewing Services
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => handleCategoryClick('Straight Abayas & Dresses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Straight Cut Abayas & Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Gathered Abayas')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Gathered Waist & Tiered Abayas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Pleated Abayas')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sunburst & Knife Pleated Abayas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Capelet & Two-Piece Sets')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Two-Tone Capelet & Pleated Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Abayas')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Farasha & Open-Front Abayas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleCategoryClick('All');
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left text-amber-200"
                >
                  View All Modest Dresses →
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Delivery */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Location & Ghana Delivery
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Physical Workshop:</strong>
                  <span>Oforikrom, Accra Town Behind Central Mosque (Kumasi / Ghana)</span>
                </div>
              </div>

              <div className="pt-1 space-y-1 text-stone-400">
                <p>• In-store pickup at Oforikrom shop</p>
                <p>• Doorstep dispatch in Kumasi & Accra</p>
                <p>• VIP / STC parcel delivery to all 16 Ghana regions</p>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-amber-300 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Abaya Length (50" to 60") Guide</span>
                </button>
              </div>
            </div>
          </div>

          {/* Phone Numbers & Direct Call */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Contact & Inquiries
            </h4>
            <div className="space-y-2.5 text-xs">
              <p className="text-stone-300">
                For dress bookings, prices, custom sewing, and delivery arrangements:
              </p>
              
              <div className="space-y-1.5 font-mono text-xs font-bold text-white">
                <a href="https://wa.me/233501273875" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors text-sm text-emerald-300 font-extrabold">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>050 127 3875 (WhatsApp Primary)</span>
                </a>
                <a href="tel:0242842090" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>024 284 2090 (Shop Line)</span>
                </a>
                <a href="tel:0264460744" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>026 446 0744</span>
                </a>
                <a href={`mailto:${SHOP_TARGET_EMAIL}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors text-amber-200 font-sans text-xs">
                  <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{SHOP_TARGET_EMAIL}</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openWhatsAppModal()}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp 050 127 3875</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-pink-300/70 gap-3">
          <p>© {new Date().getFullYear()} Al-Ikhlas Fashion Center. All rights reserved. Oforikrom, Accra Town, Ghana.</p>
          <div className="flex items-center gap-4">
            <span>Quality is our Hallmark</span>
            <span>·</span>
            <span>Your One Stop Shop Abaya Plug</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
