import React from 'react';
import { X, Phone, MapPin, MessageCircle, Scissors, Check, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import tealImg from '../../assets/images/abaya_teal_beige_capelet_1790461867481.jpg';
import roseImg from '../../assets/images/abaya_rose_capelet_1790461877699.jpg';
import oliveImg from '../../assets/images/abaya_olive_pleated_1790461886790.jpg';
import butterflyImg from '../../assets/images/abaya_butterfly_cream_1790461896450.jpg';

export const FlyerModal: React.FC = () => {
  const { isFlyerModalOpen, setIsFlyerModalOpen, openWhatsAppModal } = useShop();

  if (!isFlyerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative bg-[#540B25] text-white max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-amber-300/40 rounded-lg p-6 sm:p-8 space-y-6">
        
        {/* Close button */}
        <button
          onClick={() => setIsFlyerModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner Replica Header */}
        <div className="text-center space-y-2 border-b border-pink-500/30 pb-4">
          <div className="inline-block bg-white text-[#540B25] px-4 py-1.5 rounded-sm font-black font-serif-brand text-2xl sm:text-3xl tracking-wide uppercase shadow-md">
            AL - IKHLAS
          </div>
          <div className="text-sm sm:text-base font-bold tracking-widest text-amber-300 uppercase">
            FASHION CENTER
          </div>
          <p className="text-xs text-pink-200 italic">
            "Your one stop shop Abaya plug · Quality is our Hallmark"
          </p>
        </div>

        {/* Services & Contact Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Services Box */}
          <div className="bg-[#3D061A] p-4 border border-pink-500/30 rounded space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" />
              <span>SERVICES · SEWING OF:</span>
            </span>
            <ul className="space-y-1 text-stone-200">
              <li className="flex items-center gap-1.5 font-medium">✓ ABAYAS</li>
              <li className="flex items-center gap-1.5 font-medium">✓ HIJABS</li>
              <li className="flex items-center gap-1.5 font-medium">✓ KHIMAR</li>
              <li className="flex items-center gap-1.5 font-medium">✓ STRAIGHT DRESSES</li>
              <li className="flex items-center gap-1.5 text-amber-200">✓ AND MANY MORE</li>
            </ul>
          </div>

          {/* Location & Contact Box */}
          <div className="bg-[#3D061A] p-4 border border-pink-500/30 rounded space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>DIRECT CALL & ORDERS:</span>
              </span>
              <div className="mt-1 space-y-1 font-mono text-xs font-bold text-white">
                <a href="https://wa.me/233501273875" target="_blank" rel="noopener noreferrer" className="block text-emerald-300 hover:text-emerald-200">
                  📱 WhatsApp: 050 127 3875
                </a>
                <a href="tel:0242842090" className="block hover:text-amber-300 transition-colors">
                  📞 024 284 2090
                </a>
                <a href="tel:0264460744" className="block hover:text-amber-300 transition-colors">
                  📞 026 446 0744
                </a>
                <a href="mailto:issahn712@gmail.com" className="block text-amber-200 hover:underline font-sans text-[11px] pt-1">
                  ✉️ issahn712@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-pink-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>PHYSICAL SHOP LOCATION:</span>
              </span>
              <p className="mt-1 text-xs text-stone-200 font-medium">
                Oforikrom, Accra Town Behind the Central Mosque (Kumasi / Ghana)
              </p>
            </div>
          </div>
        </div>

        {/* Featured Dress Styles preview */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold block text-center">
            Currently Available Dress Styles for Sewing
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[tealImg, roseImg, oliveImg, butterflyImg].map((img, i) => (
              <div key={i} className="aspect-[3/4] bg-black/40 overflow-hidden border border-pink-500/30 rounded">
                <img src={img} alt="Al-Ikhlas style" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setIsFlyerModalOpen(false);
              openWhatsAppModal();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-md cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Directly on WhatsApp (050 127 3875)</span>
          </button>
          
          <a
            href="tel:0501273875"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-[#43091D] font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span>Call Shop: 050 127 3875</span>
          </a>
        </div>

      </div>
    </div>
  );
};
