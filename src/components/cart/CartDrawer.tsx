import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Phone, MessageCircle, MapPin, Scissors, Send, Mail } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { 
  openWhatsAppOrder, 
  PRIMARY_WHATSAPP_NUMBER, 
  SECONDARY_WHATSAPP_NUMBER, 
  SHOP_TARGET_EMAIL 
} from '../../utils/sendWhatsAppOrder';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    setActiveTab, 
    getAbsoluteImageUrl,
    settings 
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const handleProceedToGhanaCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppAll = () => {
    let orderSummary = `🌟 AL-IKHLAS FASHION CENTER · DRESS ORDER / INQUIRY 🌟\n` +
      `Shop Location: Oforikrom, Accra Town Behind Central Mosque\n` +
      `Direct Contacts: 050 127 3875 / 024 284 2090 | Email: ${SHOP_TARGET_EMAIL}\n\n` +
      `Hello Al-Ikhlas! I want to BUY / INQUIRE about the following dresses from my selection:\n\n`;
    cart.forEach((item, idx) => {
      orderSummary += `${idx + 1}. 👗 "${item.name}"\n   • Chosen Color: ${item.color.name}\n   • Selected Length: ${item.size}\n   • Quantity: ${item.quantity}\n`;
      if (item.customNotes) orderSummary += `   • Custom Notes: ${item.customNotes}\n`;
      orderSummary += '\n';
    });
    orderSummary += `Please let me know the total pricing quote, MoMo payment instructions, and delivery/pickup schedule in Ghana. Thank you!`;
    
    openWhatsAppOrder(orderSummary, PRIMARY_WHATSAPP_NUMBER);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10">
        
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#5B0F2A] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <span className="font-serif-brand text-xl font-bold">Selected Dresses for Inquiry</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
              {cart.length}
            </span>
          </div>

          <button 
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1 text-white hover:text-amber-200 transition-colors cursor-pointer"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location & hotline banner */}
        <div className="p-3 bg-pink-50 border-b border-pink-200 text-xs text-[#5B0F2A] flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Oforikrom, Behind Central Mosque</span>
          </span>
          <a href="tel:0501273875" className="font-mono font-bold hover:underline shrink-0 text-emerald-800">
            050 127 3875
          </a>
        </div>

        {/* Itemized List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Scissors className="w-12 h-12 text-stone-300 mx-auto stroke-1" />
              <div className="font-serif-brand text-xl text-stone-800 font-bold">No dresses selected yet</div>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our straight, gathered, and pleated dresses, choose your length (50" to 60") and chosen shade, and request custom sewing.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActiveTab('shop');
                }}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#5B0F2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#43091D] cursor-pointer rounded"
              >
                <span>Browse All Dresses</span>
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                {/* Thumbnail with ColorizedDressImage */}
                <div className="w-20 aspect-[3/4] bg-stone-100 border border-stone-200 overflow-hidden shrink-0 relative">
                  <ColorizedDressImage
                    baseImage={item.image}
                    color={item.color}
                    alt={`${item.name} in ${item.color.name}`}
                    showBadge={false}
                    className="w-full h-full object-cover object-top"
                    containerClassName="w-full h-full relative"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-brand text-sm text-stone-900 line-clamp-1 font-bold">
                      {item.name}
                    </h4>

                    {/* Variant specs */}
                    <div className="text-[11px] text-stone-600 mt-1 space-y-0.5">
                      <p>Length: <strong className="text-[#5B0F2A] font-bold">{item.size}</strong></p>
                      <p className="flex items-center gap-1.5">
                        <span>Color:</span>
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: item.color.hex }} />
                        <strong className="text-stone-800 font-medium">{item.color.name}</strong>
                      </p>
                      {item.customNotes && (
                        <p className="italic text-stone-500 text-[10px] line-clamp-1">
                          Note: "{item.customNotes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#5B0F2A]">
                        Price on Request
                      </span>

                      <button
                        onClick={() => {
                          const msg = `🌟 AL-IKHLAS FASHION CENTER · DRESS ORDER / INQUIRY 🌟\n\n` +
                            `Hello! I want to BUY / INQUIRE about this dress from my bag:\n` +
                            `• Dress: "${item.name}"\n` +
                            `• Chosen Color: ${item.color.name}\n` +
                            `• Length: ${item.size}\n` +
                            `• Quantity: ${item.quantity}\n` +
                            (item.customNotes ? `• Note: ${item.customNotes}\n` : '') +
                            `\nPlease send the price quote and sewing turnaround schedule. Thank you!`;

                          openWhatsAppOrder(msg, PRIMARY_WHATSAPP_NUMBER);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer hover:underline"
                        title="Inquire about this dress directly on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Inquire on WhatsApp (050 127 3875)</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-stone-200">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Pricing</span>
              <span className="font-bold text-[#5B0F2A]">Confirmed via WhatsApp/Phone</span>
            </div>

            <div className="space-y-2">
              {/* WhatsApp Inquire/Buy All */}
              <button
                onClick={handleWhatsAppAll}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Send All ({cart.length}) Items to WhatsApp 050 127 3875</span>
              </button>

              {/* Proceed to Full Ghana Checkout Form */}
              <button
                onClick={handleProceedToGhanaCheckout}
                className="w-full py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <span>Enter Ghana Delivery Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <button
                onClick={clearCart}
                className="hover:text-stone-700 underline cursor-pointer"
              >
                Clear all
              </button>
              <span>Oforikrom, Kumasi</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
