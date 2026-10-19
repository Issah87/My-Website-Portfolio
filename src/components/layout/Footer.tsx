import React from 'react';
import { MapPin, Scissors, Image as ImageIcon, Ruler, Mail, MessageSquare, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ModestCategory } from '../../types';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

export const Footer: React.FC = () => {
  const { 
    setActiveTab, 
    setFilters, 
    setIsSizeGuideOpen, 
    openInquiryModal, 
    setIsFlyerModalOpen,
    isOwnerAuthenticated 
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
              Ghana's premier modest fashion center. Specializing in bespoke sewing of abayas, flowing French khimars, straight dresses, and coordinating sets.
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

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Modest Collections
            </h4>
            <ul className="space-y-2 text-xs">
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
                  Accordion & Knife Pleated Abayas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Capelet & Two-Piece Sets')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Two-Tone Capelet & Overlay Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('my-orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-200 text-pink-200 transition-colors cursor-pointer text-left font-semibold flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>My Ordered Dresses & Tailoring Status</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('owner-portal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-200 text-stone-300 transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isOwnerAuthenticated ? 'Owner Atelier Portal (Unlocked)' : 'Owner Atelier Portal'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Ghana Delivery */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Boutique Location
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-white">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Physical Workshop & Showroom:</span>
                  <span>Oforikrom, Accra Town Behind Central Mosque (Kumasi, Ghana)</span>
                </div>
              </div>

              <div className="pt-1 space-y-1 text-stone-300 text-[11px]">
                <p>• In-store fittings & pickup at Oforikrom shop</p>
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

          {/* Contact & On-Website Communication (Only Email) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Orders & Boutique Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <p className="text-stone-300">
                All buyer discussions and order tailoring questions take place directly on the website:
              </p>
              
              <div className="space-y-2">
                <a 
                  href={`mailto:${SHOP_TARGET_EMAIL}`} 
                  className="flex items-center gap-2 hover:text-white transition-colors text-amber-200 font-mono text-xs p-2 rounded bg-white/5 border border-pink-500/20"
                >
                  <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-sans uppercase">Official Boutique Email</span>
                    <strong className="text-white font-mono">{SHOP_TARGET_EMAIL}</strong>
                  </div>
                </a>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActiveTab('my-orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-xs cursor-pointer transition-colors border border-white/20"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>My Ordered Dresses (Customer)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('owner-portal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#5B0F2A] hover:bg-[#43091D] text-white rounded font-bold text-xs cursor-pointer transition-colors border border-pink-400/40"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Atelier Owner Portal (All Orders)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-pink-300/70 gap-3">
          <p>© {new Date().getFullYear()} Al-Ikhlas Fashion Center. All rights reserved. Oforikrom, Accra Town Behind Central Mosque, Ghana.</p>
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
