import React from 'react';
import { 
  Zap, 
  Sparkles, 
  Scissors, 
  Truck, 
  ShieldCheck, 
  Ruler, 
  ShoppingBag, 
  MessageSquare,
  Flame,
  Award
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ModestCategory } from '../../types';

export const JumiaQuickLinks: React.FC = () => {
  const { setFilters, setActiveTab, setIsSizeGuideOpen, setIsFlyerModalOpen } = useShop();

  const handleCategory = (category: ModestCategory) => {
    setFilters(prev => ({ ...prev, category, searchQuery: '' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    {
      label: 'Flash Sales',
      sub: 'Up to 30% Off',
      icon: <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />,
      bg: 'bg-amber-50 border-amber-200',
      action: () => {
        setFilters(prev => ({ ...prev, category: 'All' }));
        setActiveTab('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      label: 'Straight Cut',
      sub: 'Clean Minimalist',
      icon: <span className="text-xl">👗</span>,
      bg: 'bg-rose-50 border-rose-200',
      action: () => handleCategory('Straight Abayas & Dresses'),
    },
    {
      label: 'Gathered Boubous',
      sub: 'Tiered & Flowing',
      icon: <span className="text-xl">🌸</span>,
      bg: 'bg-emerald-50 border-emerald-200',
      action: () => handleCategory('Gathered Abayas'),
    },
    {
      label: 'Pleated Luxury',
      sub: 'Accordion Maxi',
      icon: <span className="text-xl">✨</span>,
      bg: 'bg-purple-50 border-purple-200',
      action: () => handleCategory('Pleated Abayas'),
    },
    {
      label: 'Capelet Sets',
      sub: 'Two-Piece Modest',
      icon: <span className="text-xl">👑</span>,
      bg: 'bg-blue-50 border-blue-200',
      action: () => handleCategory('Capelet & Two-Piece Sets'),
    },
    {
      label: 'Size Guide',
      sub: '50" to 60" Custom',
      icon: <Ruler className="w-5 h-5 text-[#5B0F2A]" />,
      bg: 'bg-pink-50 border-pink-200',
      action: () => setIsSizeGuideOpen(true),
    },
    {
      label: 'Ghana Delivery',
      sub: '16 Regions Bus',
      icon: <Truck className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200',
      action: () => setIsFlyerModalOpen(true),
    },
    {
      label: 'My Orders',
      sub: 'Live Status Track',
      icon: <ShoppingBag className="w-5 h-5 text-stone-800" />,
      bg: 'bg-stone-100 border-stone-200',
      action: () => {
        setActiveTab('my-orders');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  ];

  return (
    <div className="bg-[#FAF9F5] pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200/90 rounded-sm p-3 shadow-2xs">
          
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {quickLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center p-2 rounded-sm hover:bg-stone-50 transition-all group cursor-pointer text-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${item.bg} mb-1.5 group-hover:scale-108 transition-transform shadow-2xs`}>
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-[#5B0F2A] line-clamp-1 leading-tight">
                  {item.label}
                </span>
                <span className="text-[9px] text-stone-400 hidden sm:block truncate">
                  {item.sub}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
