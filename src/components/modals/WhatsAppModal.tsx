import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Scissors, 
  Check, 
  Copy, 
  ShoppingBag, 
  Sparkles, 
  Image as ImageIcon,
  Download,
  Share2,
  Mail
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductColor } from '../../types';
import { 
  openWhatsAppOrder, 
  openEmailOrder, 
  downloadDressPhoto, 
  shareDressPhoto,
  PRIMARY_WHATSAPP_NUMBER,
  SECONDARY_WHATSAPP_NUMBER,
  SHOP_TARGET_EMAIL 
} from '../../utils/sendWhatsAppOrder';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';

export const WhatsAppModal: React.FC = () => {
  const { 
    isWhatsAppModalOpen, 
    setIsWhatsAppModalOpen, 
    selectedWhatsAppProduct, 
    selectedWhatsAppColor,
    selectedWhatsAppLength,
    selectedWhatsAppIntent,
    settings,
    getAbsoluteImageUrl 
  } = useShop();

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [targetNumber, setTargetNumber] = useState<'primary' | 'secondary'>('primary');
  const [alsoSendEmail, setAlsoSendEmail] = useState(true);
  const [ghanaLocation, setGhanaLocation] = useState('Kumasi / Oforikrom');
  const [abayaLength, setAbayaLength] = useState('54"');
  const [chosenColor, setChosenColor] = useState<ProductColor | null>(null);
  const [inquiryType, setInquiryType] = useState<'buy' | 'price_quote' | 'custom_measurements'>('buy');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloadingPhoto, setDownloadingPhoto] = useState(false);
  const [sharedPhotoNotice, setSharedPhotoNotice] = useState(false);

  // Sync color & length & intent whenever modal opens with a new product
  useEffect(() => {
    if (selectedWhatsAppColor) {
      setChosenColor(selectedWhatsAppColor);
    } else if (selectedWhatsAppProduct && selectedWhatsAppProduct.colors.length > 0) {
      setChosenColor(selectedWhatsAppProduct.colors[0]);
    } else {
      setChosenColor(null);
    }
  }, [selectedWhatsAppProduct, selectedWhatsAppColor]);

  useEffect(() => {
    if (selectedWhatsAppLength) {
      setAbayaLength(selectedWhatsAppLength);
    }
  }, [selectedWhatsAppLength]);

  useEffect(() => {
    if (selectedWhatsAppIntent === 'inquire') {
      setInquiryType('price_quote');
    } else {
      setInquiryType('buy');
    }
  }, [selectedWhatsAppIntent]);

  if (!isWhatsAppModalOpen) return null;

  const baseImage = selectedWhatsAppProduct?.images[0] || '';
  const isBaseColor = chosenColor?.name === selectedWhatsAppProduct?.colors[0]?.name;
  const currentDressPhoto = baseImage ? getAbsoluteImageUrl(baseImage) : '';

  const buildMessage = () => {
    const isBuying = inquiryType === 'buy';
    const isMeasurements = inquiryType === 'custom_measurements';
    
    let message = `🌟 AL-IKHLAS FASHION CENTER · GHANA 🌟\n` +
      `Shop: Oforikrom, Accra Town Behind Central Mosque\n` +
      `Direct Contacts: 050 127 3875 / 024 284 2090 | Email: ${SHOP_TARGET_EMAIL}\n\n` +
      `Hello Al-Ikhlas! My name is ${clientName.trim() || 'a customer'} from ${ghanaLocation}.\n\n`;

    if (selectedWhatsAppProduct) {
      message += `I want to ${
        isBuying 
          ? 'BUY / ORDER' 
          : isMeasurements 
          ? 'BOOK MEASUREMENTS FOR' 
          : 'INQUIRE ABOUT PRICING FOR'
      } this dress:\n\n` +
      `👗 Dress Style: "${selectedWhatsAppProduct.name}"\n` +
      `🎨 Selected Color / Fabric: ${chosenColor?.name || 'As pictured'}\n` +
      `📏 Desired Length: ${abayaLength}\n` +
      `🏷️ Category: ${selectedWhatsAppProduct.category}\n`;

      message += `📦 Request Type: ${
        isBuying 
          ? 'Ready to Buy & Order' 
          : isMeasurements 
          ? 'Custom Measurements & Fitting' 
          : 'Price Quote & Sewing Time'
      }\n`;
    } else {
      message += `I want to ${isBuying ? 'buy' : 'inquire about'} custom sewing for modest abayas and straight dresses.\n` +
      `📏 Desired Length: ${abayaLength}\n`;
    }

    if (phone.trim()) message += `📱 My Ghana Phone: ${phone.trim()}\n`;
    if (clientEmail.trim()) message += `📧 My Email: ${clientEmail.trim()}\n`;
    if (customMessage.trim()) message += `📝 Custom Notes / Measurements: ${customMessage.trim()}\n`;
    
    if (isBuying) {
      message += `\nPlease send me the price quote, MoMo/Cash payment instructions, and completion schedule so sewing can start!`;
    } else {
      message += `\nPlease let me know the price quote and sewing turnaround duration. Thank you!`;
    }

    return message;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const message = buildMessage();
    const chosenNumber = targetNumber === 'primary' ? PRIMARY_WHATSAPP_NUMBER : SECONDARY_WHATSAPP_NUMBER;
    openWhatsAppOrder(message, chosenNumber);
    
    if (alsoSendEmail) {
      setTimeout(() => {
        openEmailOrder({
          to: SHOP_TARGET_EMAIL,
          subject: `${inquiryType === 'buy' ? 'Dress Order' : 'Sewing Inquiry'}: ${selectedWhatsAppProduct?.name || 'Abaya'} - ${clientName || 'Customer'}`,
          body: message,
        });
      }, 400);
    }
    
    setIsWhatsAppModalOpen(false);
  };

  const handleDownloadPhoto = async () => {
    if (!baseImage) return;
    setDownloadingPhoto(true);
    await downloadDressPhoto(baseImage, `${selectedWhatsAppProduct?.name || 'abaya'}_${chosenColor?.name || 'dress'}`);
    setTimeout(() => setDownloadingPhoto(false), 1500);
  };

  const handleSharePhoto = async () => {
    if (!baseImage) return;
    await shareDressPhoto(baseImage, selectedWhatsAppProduct?.name || 'Dress', chosenColor?.name);
    setSharedPhotoNotice(true);
    setTimeout(() => setSharedPhotoNotice(false), 2500);
  };

  const handleCopyMessage = () => {
    const msg = buildMessage();
    navigator.clipboard.writeText(msg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white max-w-lg w-full p-6 shadow-2xl border border-stone-200 rounded-lg space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-brand text-lg text-stone-900 font-bold leading-tight">
                Send to Owner on WhatsApp & Email
              </h3>
              <span className="text-[11px] text-[#5B0F2A] font-semibold">
                Hotlines: 050 127 3875 / 024 284 2090 · Email: {SHOP_TARGET_EMAIL}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsWhatsAppModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Purpose Toggle: Buy vs Inquire vs Measurements */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setInquiryType('buy')}
            className={`py-2 px-2 rounded flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
              inquiryType === 'buy'
                ? 'bg-[#5B0F2A] text-white shadow-xs'
                : 'text-stone-700 hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">I Want to Buy</span>
          </button>

          <button
            type="button"
            onClick={() => setInquiryType('price_quote')}
            className={`py-2 px-2 rounded flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
              inquiryType === 'price_quote'
                ? 'bg-[#5B0F2A] text-white shadow-xs'
                : 'text-stone-700 hover:bg-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Inquire Price</span>
          </button>

          <button
            type="button"
            onClick={() => setInquiryType('custom_measurements')}
            className={`py-2 px-2 rounded flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
              inquiryType === 'custom_measurements'
                ? 'bg-[#5B0F2A] text-white shadow-xs'
                : 'text-stone-700 hover:bg-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Custom Sewing</span>
          </button>
        </div>

        {/* Selected Product Context & Color Picker */}
        {selectedWhatsAppProduct && (
          <div className="p-3.5 bg-pink-50/80 border border-pink-200 rounded space-y-3">
            <div className="flex items-start gap-3">
              {/* Picture changes immediately when chosenColor changes! */}
              <ColorizedDressImage
                baseImage={baseImage}
                color={chosenColor}
                isBaseColor={isBaseColor}
                alt={`${selectedWhatsAppProduct.name} in ${chosenColor?.name || 'selected color'}`}
                className="w-full h-full object-cover object-top"
                containerClassName="w-20 aspect-[3/4] rounded border border-pink-200 bg-white shrink-0 shadow-xs relative"
                showBadge={true}
              />
              <div className="text-xs flex-1">
                <span className="text-[10px] text-[#5B0F2A] uppercase font-bold tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Sending this exact dress & color to owner:
                </span>
                <h4 className="font-bold text-stone-900 line-clamp-2 leading-snug">
                  {selectedWhatsAppProduct.name}
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[#5B0F2A] font-bold text-[11px]">Price on Request</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-[10px] text-stone-500">{selectedWhatsAppProduct.category}</span>
                </div>
              </div>
            </div>

            {/* Interactive Color Choice Selector right in the modal */}
            {selectedWhatsAppProduct.colors && selectedWhatsAppProduct.colors.length > 0 && (
              <div className="pt-2.5 border-t border-pink-200/70">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-stone-800">
                    Chosen Color (dress picture updates instantly):
                  </span>
                  <span className="font-bold text-[#5B0F2A]">
                    {chosenColor?.name || selectedWhatsAppProduct.colors[0]?.name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedWhatsAppProduct.colors.map((c) => {
                    const isSelected = chosenColor?.name === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setChosenColor(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#5B0F2A] text-white border-[#5B0F2A] font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <span 
                          className="w-3 h-3 rounded-full border border-black/20 shrink-0 shadow-2xs" 
                          style={{ 
                            background: c.secondaryHex 
                              ? `linear-gradient(135deg, ${c.hex} 50%, ${c.secondaryHex} 50%)` 
                              : c.hex 
                          }} 
                        />
                        <span>{c.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-white ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Separate Photo Actions */}
            <div className="pt-2 border-t border-stone-200 bg-white -mx-3.5 -mb-3.5 p-3 rounded-b flex items-center justify-between text-xs">
              <span className="text-stone-600 flex items-center gap-1.5 font-medium">
                <ImageIcon className="w-3.5 h-3.5 text-[#5B0F2A] shrink-0" />
                <span>Dress Photography</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPhoto}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold rounded border border-stone-300 transition-colors cursor-pointer"
                  title="Download photo separately"
                >
                  <Download className="w-3 h-3 text-[#5B0F2A]" />
                  <span>{downloadingPhoto ? 'Saving...' : 'Download Photo'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSharePhoto}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold rounded border border-stone-300 transition-colors cursor-pointer"
                  title="Share photo separately"
                >
                  <Share2 className="w-3 h-3 text-[#5B0F2A]" />
                  <span>{sharedPhotoNotice ? 'Shared!' : 'Share Photo'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSendWhatsApp} className="space-y-3 text-xs">
          {/* Target WhatsApp Number Selector */}
          <div className="bg-stone-50 p-2.5 rounded border border-stone-200 space-y-1.5">
            <span className="font-semibold text-stone-800 block text-[11px]">
              Select WhatsApp Destination:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className={`p-2 border rounded cursor-pointer flex items-center gap-1.5 transition-colors ${
                targetNumber === 'primary' ? 'border-emerald-600 bg-emerald-50/70 font-bold text-emerald-900' : 'border-stone-200 bg-white text-stone-700'
              }`}>
                <input
                  type="radio"
                  name="modalTargetNumber"
                  checked={targetNumber === 'primary'}
                  onChange={() => setTargetNumber('primary')}
                  className="accent-emerald-700"
                />
                <span className="text-[11px]">050 127 3875 (Primary)</span>
              </label>

              <label className={`p-2 border rounded cursor-pointer flex items-center gap-1.5 transition-colors ${
                targetNumber === 'secondary' ? 'border-emerald-600 bg-emerald-50/70 font-bold text-emerald-900' : 'border-stone-200 bg-white text-stone-700'
              }`}>
                <input
                  type="radio"
                  name="modalTargetNumber"
                  checked={targetNumber === 'secondary'}
                  onChange={() => setTargetNumber('secondary')}
                  className="accent-emerald-700"
                />
                <span className="text-[11px]">024 284 2090 (Shop Line)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sister Amina"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Your Ghana Phone *</label>
              <input
                type="tel"
                placeholder="050 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Your Location in Ghana</label>
              <input
                type="text"
                placeholder="Kumasi, Accra, Tamale, etc."
                value={ghanaLocation}
                onChange={(e) => setGhanaLocation(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Desired Dress Length</label>
              <select
                value={abayaLength}
                onChange={(e) => setAbayaLength(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 bg-white rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
              >
                <option value='50"'>50 inches (Petite)</option>
                <option value='52"'>52 inches</option>
                <option value='54"'>54 inches (Standard)</option>
                <option value='56"'>56 inches</option>
                <option value='58"'>58 inches (Tall)</option>
                <option value='60"'>60 inches (Extra Tall)</option>
                <option value="Custom Fit">Custom Fit (Tailored)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Your Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. yourname@gmail.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Custom Request / Specific Measurements
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Need matching hijab, loose sleeve cuffs for wudu, or bus delivery to Accra..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
            />
          </div>

          {/* Email dispatch checkbox */}
          <label className="flex items-center gap-2 p-2 bg-pink-50/70 border border-pink-200 rounded cursor-pointer text-[11px] font-medium text-stone-800">
            <input
              type="checkbox"
              checked={alsoSendEmail}
              onChange={(e) => setAlsoSendEmail(e.target.checked)}
              className="accent-[#5B0F2A]"
            />
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#5B0F2A]" />
              <span>Also send booking directly to email: <strong>{SHOP_TARGET_EMAIL}</strong></span>
            </span>
          </label>

          {/* Live Message Preview */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] space-y-1 font-mono text-stone-700">
            <div className="flex items-center justify-between font-sans text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              <span>Recipient: WhatsApp ({targetNumber === 'primary' ? '050 127 3875' : '024 284 2090'}) & Email ({SHOP_TARGET_EMAIL})</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[#5B0F2A] hover:underline cursor-pointer inline-flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <p className="line-clamp-3 whitespace-pre-line text-stone-600">
              {buildMessage()}
            </p>
          </div>

          <div className="pt-1 space-y-2">
            {/* Direct button sending order or inquiry to owner WhatsApp */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {inquiryType === 'buy' 
                  ? `Send Buy Order (${targetNumber === 'primary' ? 'WhatsApp 050 127 3875' : 'WhatsApp 024 284 2090'})` 
                  : `Send Inquiry (${targetNumber === 'primary' ? 'WhatsApp 050 127 3875' : 'WhatsApp 024 284 2090'})`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                const message = buildMessage();
                openEmailOrder({
                  to: SHOP_TARGET_EMAIL,
                  subject: `${inquiryType === 'buy' ? 'Dress Order' : 'Sewing Inquiry'}: ${selectedWhatsAppProduct?.name || 'Abaya'} - ${clientName || 'Customer'}`,
                  body: message,
                });
              }}
              className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-[11px] font-bold uppercase tracking-wide transition-colors rounded flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#5B0F2A]" />
              <span>Send Direct to Email: {SHOP_TARGET_EMAIL}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-medium text-center">
              <span>Hotlines:</span>
              <a href="tel:0501273875" className="text-[#5B0F2A] font-bold hover:underline">
                050 127 3875
              </a>
              <span>/</span>
              <a href="tel:0242842090" className="text-[#5B0F2A] font-bold hover:underline">
                024 284 2090
              </a>
              <span>/</span>
              <a href="tel:0264460744" className="text-[#5B0F2A] font-bold hover:underline">
                026 446 0744
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
