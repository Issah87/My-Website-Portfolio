import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Scissors, 
  ArrowRight,
  Send,
  Mail,
  Check,
  Copy,
  ExternalLink 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { 
  openWhatsAppOrder, 
  openEmailOrder, 
  createOrderEmailUrl, 
  createGmailWebUrl, 
  formatBookingSummary,
  PRIMARY_WHATSAPP_NUMBER,
  SECONDARY_WHATSAPP_NUMBER,
  SHOP_TARGET_EMAIL
} from '../../utils/sendWhatsAppOrder';

export const OrderSuccessView: React.FC = () => {
  const { lastCreatedOrder, setActiveTab, settings, getAbsoluteImageUrl } = useShop();
  const [copied, setCopied] = useState(false);

  if (!lastCreatedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif-brand text-2xl text-stone-900 font-bold">No recent booking found</h2>
        <button
          onClick={() => setActiveTab('shop')}
          className="mt-4 px-6 py-2 bg-[#5B0F2A] text-white text-xs font-bold uppercase rounded"
        >
          View All Dresses
        </button>
      </div>
    );
  }

  const order = lastCreatedOrder;

  const { text: bookingSummaryText, subject: emailSubject } = formatBookingSummary({
    orderNumber: order.orderNumber,
    customer: order.customer,
    items: order.items,
    notes: order.notes,
  });

  const handleSendToPrimaryWhatsApp = () => {
    openWhatsAppOrder(bookingSummaryText, PRIMARY_WHATSAPP_NUMBER);
  };

  const handleSendToSecondaryWhatsApp = () => {
    openWhatsAppOrder(bookingSummaryText, SECONDARY_WHATSAPP_NUMBER);
  };

  const handleSendEmail = () => {
    openEmailOrder({
      to: SHOP_TARGET_EMAIL,
      subject: emailSubject,
      body: bookingSummaryText,
    });
  };

  const gmailWebLink = createGmailWebUrl({
    to: SHOP_TARGET_EMAIL,
    subject: emailSubject,
    body: bookingSummaryText,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingSummaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12 border-b border-stone-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Banner Card */}
        <div className="bg-white p-8 border border-stone-200 shadow-sm rounded text-center space-y-4">
          <div className="w-16 h-16 bg-pink-50 text-[#5B0F2A] rounded-full flex items-center justify-center mx-auto border-2 border-pink-200">
            <Scissors className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#5B0F2A] font-bold block">
            Booking Inquiry Transmitted
          </span>

          <h1 className="font-serif-brand text-3xl sm:text-4xl text-stone-900 font-bold">
            Thank you, {order.customer.fullName}
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Your dress specifications have been compiled for our workshop at <strong>Oforikrom, Accra Town Behind Central Mosque</strong>. Our team will contact your Ghana phone (<strong>{order.customer.phone}</strong>) with pricing and delivery details.
          </p>

          {/* Direct Dispatch Destination Indicators */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg text-left text-xs space-y-2">
            <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Direct Booking Dispatch Addresses:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700">
              <div className="bg-white p-2.5 rounded border border-emerald-200 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Primary WhatsApp</span>
                  <strong className="text-stone-900 font-mono text-xs">050 127 3875</strong>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded border border-emerald-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#5B0F2A] shrink-0" />
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Target Order Email</span>
                  <strong className="text-stone-900 font-mono text-xs">{SHOP_TARGET_EMAIL}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded">
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Booking Reference</span>
              <strong className="text-stone-900 font-mono text-sm">{order.orderNumber}</strong>
            </div>

            <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded">
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Location</span>
              <strong className="text-stone-900 font-medium">{order.customer.townCity}</strong>
            </div>

            <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded">
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Tailor Status</span>
              <strong className="text-[#5B0F2A] font-bold">{order.orderStatus}</strong>
            </div>
          </div>

          {/* Direct Actions: WhatsApp & Email Buttons */}
          <div className="pt-4 space-y-2.5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={handleSendToPrimaryWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp (050 127 3875)</span>
              </button>

              <button
                onClick={handleSendEmail}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Send to Email ({SHOP_TARGET_EMAIL})</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <a
                href={gmailWebLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] border border-stone-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-rose-700" />
                <span>Open in Gmail Web</span>
              </a>

              <button
                onClick={handleSendToSecondaryWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] border border-stone-300 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-stone-600" />
                <span>WhatsApp 024 284 2090</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] border border-stone-300 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-stone-600" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Booking Text'}</span>
              </button>

              <a
                href="tel:0501273875"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] border border-stone-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#5B0F2A]" />
                <span>Call 050 127 3875</span>
              </a>
            </div>
          </div>
        </div>

        {/* Selected Garments details */}
        <div className="mt-8 bg-white p-6 sm:p-8 border border-stone-200 shadow-sm rounded space-y-6">
          <h2 className="font-serif-brand text-xl text-stone-900 font-bold border-b border-stone-200 pb-3">
            Selected Dress Specifications
          </h2>

          <div className="space-y-4 divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-16 aspect-[3/4] bg-stone-100 border border-stone-200 rounded overflow-hidden shrink-0 relative">
                    <ColorizedDressImage
                      baseImage={item.image}
                      color={item.color}
                      alt={`${item.name} in ${item.color.name}`}
                      showBadge={false}
                      className="w-full h-full object-cover object-top"
                      containerClassName="w-full h-full relative"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif-brand text-sm text-stone-900 font-bold">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-stone-600 flex items-center gap-1.5 mt-0.5">
                      <span>Length: <strong className="text-[#5B0F2A] font-bold">{item.size}</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <span>Color:</span>
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: item.color.hex }} />
                        <strong className="text-stone-800 font-semibold">{item.color.name}</strong>
                      </span>
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Quantity: {item.quantity} · Price: <strong className="text-[#5B0F2A]">Confirmed via WhatsApp</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Shop Address */}
          <div className="p-4 bg-pink-50 border border-pink-200 rounded text-xs space-y-2 text-stone-800">
            <div className="flex items-center gap-2 font-bold text-[#5B0F2A]">
              <MapPin className="w-4 h-4 text-[#5B0F2A]" />
              <span>Workshop Pickup & Delivery Information</span>
            </div>
            <p>
              Shop Location: <strong>Accra Town Behind the Central Mosque, Oforikrom, Kumasi</strong>.
            </p>
            <p className="text-stone-600">
              For deliveries outside Kumasi (Greater Accra, Tamale, Takoradi, etc.), we send via VIP / OA / Imperial Express bus parcels or direct dispatch courier to your doorstep.
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('shop')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5B0F2A] hover:underline cursor-pointer"
            >
              <span>Explore More Modest Dresses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
