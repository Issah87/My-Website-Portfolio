import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Sparkles, Image as ImageIcon, Mail } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

export const AnnouncementBar: React.FC = () => {
  const { settings, openWhatsAppModal, setIsFlyerModalOpen } = useShop();

  return (
    <div className="bg-[#5B0F2A] text-[#FCEEF2] text-[11px] font-medium tracking-wide py-2 px-4 border-b border-[#43091D] transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Location in Ghana & Email */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-amber-200">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Oforikrom, Accra Town Behind Central Mosque (Ghana)</span>
          </div>
          <span className="text-pink-300 hidden md:inline">·</span>
          <a
            href={`mailto:${SHOP_TARGET_EMAIL}`}
            className="hidden md:flex items-center gap-1 text-pink-100 hover:text-white transition-colors"
            title={`Email: ${SHOP_TARGET_EMAIL}`}
          >
            <Mail className="w-3 h-3 text-pink-300" />
            <span>{SHOP_TARGET_EMAIL}</span>
          </a>
        </div>

        {/* Center: Hallmark Motto & Flyer Trigger */}
        <div className="text-center truncate">
          <span className="font-semibold text-white">Your One Stop Shop Abaya Plug</span>
          <span className="text-pink-300 mx-2">·</span>
          <span className="text-pink-100">Quality is our Hallmark</span>
          <button
            onClick={() => setIsFlyerModalOpen(true)}
            className="ml-2 inline-flex items-center gap-1 text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            <ImageIcon className="w-3 h-3" />
            <span>View Flyer</span>
          </button>
        </div>

        {/* Right: Phone Numbers & Direct WhatsApp Call */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <a
            href="tel:0501273875"
            className="flex items-center gap-1 text-amber-200 hover:text-white transition-colors font-mono font-bold"
            title="Call 050 127 3875"
          >
            <Phone className="w-3 h-3 text-amber-300" />
            <span>050 127 3875</span>
          </a>
          <span className="text-pink-400">/</span>
          <a
            href="tel:0242842090"
            className="text-pink-100 hover:text-amber-200 transition-colors font-mono font-semibold"
            title="Call 024 284 2090"
          >
            024 284 2090
          </a>
          <button
            onClick={() => openWhatsAppModal()}
            className="ml-1 inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-100 cursor-pointer font-bold"
            title="Chat on WhatsApp 050 127 3875"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
