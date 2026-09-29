import React, { useState } from 'react';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../shop/ProductCard';
import { ModestCategory } from '../../types';

export const CuratedCollection: React.FC = () => {
  const { products, setActiveTab, openWhatsAppModal } = useShop();
  const [activeFilter, setActiveFilter] = useState<ModestCategory>('All');

  const filteredList = activeFilter === 'All' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <section className="py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#5B0F2A] font-bold">
              Bespoke Modest Fashion
            </span>
            <h2 className="font-serif-brand text-3xl sm:text-4xl text-stone-900 mt-1 font-bold">
              Straight, Gathered & Pleated Abaya Styles
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl font-light">
              Choose your favorite cut, click any color shade on the card to pick your color, and tap <strong>Inquire</strong> to reach our Oforikrom seamstresses directly with your chosen dress & color!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openWhatsAppModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask for Prices on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Style Category Quick Toggle Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-stone-100">
          {(['All', 'Straight Abayas & Dresses', 'Gathered Abayas', 'Pleated Abayas', 'Capelet & Two-Piece Sets'] as ModestCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-[#5B0F2A] text-white border-[#5B0F2A] shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              {cat === 'All' ? 'All Styles' : cat} ({cat === 'All' ? products.length : products.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>

        {/* Dress Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Banner with Phone numbers */}
        <div className="mt-16 p-6 sm:p-8 bg-[#FAF9F5] border border-stone-200 text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-bold block">
            Custom Measurement & Fast Sewing
          </span>
          <h3 className="font-serif-brand text-2xl text-stone-900 font-bold">
            Need Any of These Dresses in Your Custom Measurements?
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Drop by our shop in Oforikrom, Accra Town Behind Central Mosque, or send your measurements to us on WhatsApp / Phone. We sew promptly and deliver throughout Ghana.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <button
              onClick={() => openWhatsAppModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded cursor-pointer transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: 050 127 3875</span>
            </button>

            <a
              href="tel:0501273875"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white rounded cursor-pointer transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: 050 127 3875</span>
            </a>

            <a
              href="tel:0242842090"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded cursor-pointer transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: 024 284 2090</span>
            </a>

            <a
              href="mailto:issahn712@gmail.com"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 rounded cursor-pointer transition-colors"
            >
              <span>Email: issahn712@gmail.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
