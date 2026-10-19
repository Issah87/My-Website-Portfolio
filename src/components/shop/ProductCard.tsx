import React, { useState } from 'react';
import { Heart, MessageSquare, ShoppingBag, Send, Mail } from 'lucide-react';
import { Product, ProductColor } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ColorizedDressImage } from './ColorizedDressImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { viewProduct, wishlist, toggleWishlist, addToCart, openInquiryModal } = useShop();
  const [selectedLength, setSelectedLength] = useState(product.sizes[2] || '54"');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Standard', hex: '#333333' });

  const isFavorited = wishlist.includes(product.id);
  const baseImage = product.images[0];
  const isBaseColor = selectedColor.name === product.colors[0]?.name;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedLength, selectedColor);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openInquiryModal(product, selectedColor, selectedLength, 'buy');
  };

  const handleInquireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openInquiryModal(product, selectedColor, selectedLength, 'inquire');
  };

  return (
    <div
      onClick={() => viewProduct(product.slug)}
      className="group relative flex flex-col bg-white border border-stone-200/80 rounded-none overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Visual Asset Container with Real-Time Color Transformation */}
      <div className="relative w-full aspect-[3/4] bg-[#F5F2EB] overflow-hidden">
        <ColorizedDressImage
          baseImage={baseImage}
          color={selectedColor}
          isBaseColor={isBaseColor}
          alt={`${product.name} in ${selectedColor.name}`}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          containerClassName="w-full h-full relative"
          showBadge={true}
        />

        {/* Fallback container */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F7F4ED] to-[#EAE4D7] flex items-center justify-center p-6 text-center">
          <span className="font-serif-brand text-lg text-stone-500 font-semibold">Al-Ikhlas Fashion Center</span>
        </div>

        {/* Badge Tag */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#5B0F2A] bg-white/95 backdrop-blur-sm px-2.5 py-1 shadow-xs border border-pink-200">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 rounded-full shadow-xs transition-colors cursor-pointer"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick Length Selector on Desktop Hover */}
        <div className="absolute bottom-0 inset-x-0 p-2.5 bg-white/95 backdrop-blur-sm border-t border-stone-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {product.sizes.slice(0, 5).map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLength(sz);
                }}
                className={`px-2 py-1 text-[10px] font-bold transition-all ${
                  selectedLength === sz
                    ? 'bg-[#5B0F2A] text-white'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <button
            onClick={handleQuickAdd}
            className="px-2.5 py-1 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer whitespace-nowrap"
          >
            + Bag
          </button>
        </div>
      </div>

      {/* Metadata & Description */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            {product.category}
          </div>

          <h3 className="font-serif-brand text-base font-bold text-stone-900 group-hover:text-[#5B0F2A] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Color Palette Swatches */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-500 uppercase font-semibold">
              Shade:
            </span>
            <span className="text-[11px] font-medium text-stone-900 truncate max-w-[120px]">
              {selectedColor.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center -space-x-1">
              {product.colors.slice(0, 4).map((c) => {
                const isSelected = selectedColor.name === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(c);
                    }}
                    className={`relative p-0.5 rounded-full transition-transform cursor-pointer ${
                      isSelected 
                        ? 'ring-2 ring-[#5B0F2A] ring-offset-1 scale-110 z-10' 
                        : 'opacity-85 hover:opacity-100 hover:scale-105'
                    }`}
                    title={`Choose ${c.name}`}
                  >
                    <span
                      className="block w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                      style={{
                        background: c.secondaryHex
                          ? `linear-gradient(135deg, ${c.hex} 50%, ${c.secondaryHex} 50%)`
                          : c.hex,
                      }}
                    />
                  </button>
                );
              })}
              <span className="text-[10px] text-stone-400 ml-1">
                ({product.colors.length})
              </span>
            </div>
          </div>
        </div>

        {/* Pricing notice & Buy / Inquire actions */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#5B0F2A]">
              Price on Request
            </span>
            <span className="text-[10px] text-stone-500">
              Custom Sewing
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Buy / Order Button */}
            <button
              onClick={handleBuyClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-xs"
              title={`Buy "${product.name}" in ${selectedColor.name} & send details to owner`}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Buy / Order</span>
            </button>

            {/* Quick Add to Bag */}
            <button
              onClick={handleQuickAdd}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium border border-stone-300 rounded cursor-pointer transition-colors"
              title={`Add "${product.name}" to bag`}
            >
              <span>+ Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
