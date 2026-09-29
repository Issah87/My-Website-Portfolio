import React, { useState } from 'react';
import { 
  Lock, 
  ArrowLeft, 
  Check, 
  Truck, 
  MessageCircle, 
  MapPin, 
  Phone,
  Scissors,
  CheckCircle2,
  Send,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OrderCustomer, PaymentMethod } from '../../types';
import { GHANA_REGIONS } from '../../data/mockProducts';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { 
  openWhatsAppOrder, 
  openEmailOrder, 
  createOrderEmailUrl, 
  createGmailWebUrl, 
  formatBookingSummary, 
  dispatchBookingToWhatsAppAndEmail,
  PRIMARY_WHATSAPP_NUMBER,
  SECONDARY_WHATSAPP_NUMBER,
  SHOP_TARGET_EMAIL
} from '../../utils/sendWhatsAppOrder';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    createOrder, 
    setActiveTab, 
    settings,
    getAbsoluteImageUrl,
    getWhatsAppOrderUrl 
  } = useShop();

  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    altPhone: '',
    email: '',
    region: GHANA_REGIONS[0],
    townCity: 'Oforikrom, Kumasi',
    landmarkAddress: '',
    preferredContact: 'WhatsApp',
  });

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'dispatch' | 'bus'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-brand text-3xl text-stone-900 font-bold">No dresses selected</h2>
        <p className="text-xs text-stone-500">
          Please select from our signature dresses to place an order or sewing inquiry.
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="mt-4 px-6 py-2.5 bg-[#5B0F2A] text-white text-xs font-bold uppercase tracking-wider rounded"
        >
          View All Dresses
        </button>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!customer.phone.trim()) errs.phone = 'Valid Ghana mobile phone (050/024/026/055...) is required.';
    if (!customer.townCity.trim()) errs.townCity = 'Town or suburb is required (e.g. Oforikrom, Madina).';
    if (deliveryType !== 'pickup' && !customer.landmarkAddress.trim()) {
      errs.landmarkAddress = 'Landmark or delivery location address is required for dispatch.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customer,
        items: cart,
        paymentMethod,
        paymentStatus: paymentMethod === 'momo' ? 'Pending Verification' : 'Pay on Pickup/Delivery',
        orderStatus: 'Inquiry Received',
        notes: `Delivery: ${deliveryType}. Notes: ${notes}`,
      });

      // Automatically dispatch directly to WhatsApp (0501273875) & Email (issahn712@gmail.com)
      dispatchBookingToWhatsAppAndEmail({
        orderNumber: order.orderNumber,
        customer,
        items: cart,
        deliveryType,
        paymentMethod,
        notes,
        targetWhatsApp: settings.ownerWhatsApp || PRIMARY_WHATSAPP_NUMBER,
      });

      setIsSubmitting(false);
      setActiveTab('order-success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#5B0F2A] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to The 6 Dresses</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#5B0F2A]">
            <MapPin className="w-3.5 h-3.5 text-[#5B0F2A]" />
            <span>Al-Ikhlas Fashion Center · Ghana Orders & Custom Sewing</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Customer & Ghana Delivery Info */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Recipient Details */}
            <div className="bg-white p-6 border border-stone-200 shadow-xs rounded space-y-4">
              <h3 className="font-serif-brand text-xl text-stone-900 font-bold border-b border-stone-100 pb-3">
                1. Customer & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-800 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Hajia Mariama Baako"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                  {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Ghana Mobile Phone (Calls & WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="e.g. 050 127 3875 or 024..."
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                  {errors.phone && <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Your Email Address (For Order Copy)
                  </label>
                  <input
                    type="email"
                    value={customer.email || ''}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="e.g. customer@gmail.com"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-800 mb-1">
                    Alternative Phone / Relative Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={customer.altPhone}
                    onChange={(e) => setCustomer({ ...customer, altPhone: e.target.value })}
                    placeholder="e.g. 024 284 2090 or 026 446 0744"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                </div>
              </div>

              {/* Direct Dispatch Alert */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded text-xs space-y-1 text-stone-700">
                <span className="font-bold text-[#5B0F2A] flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Direct Booking Routing to Al-Ikhlas:
                </span>
                <p className="text-[11px] text-stone-600">
                  When you submit, your selected dresses, custom lengths, and measurements are transmitted directly to:
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] font-semibold text-stone-800">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <MessageCircle className="w-3 h-3" /> WhatsApp: 050 127 3875 / 024 284 2090
                  </span>
                  <span className="flex items-center gap-1 text-[#5B0F2A]">
                    <Mail className="w-3 h-3" /> Email: {SHOP_TARGET_EMAIL}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Ghana Location & Delivery Method */}
            <div className="bg-white p-6 border border-stone-200 shadow-xs rounded space-y-4">
              <h3 className="font-serif-brand text-xl text-stone-900 font-bold border-b border-stone-100 pb-3">
                2. Location in Ghana & Delivery Option
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Select Region in Ghana *
                  </label>
                  <select
                    value={customer.region}
                    onChange={(e) => setCustomer({ ...customer, region: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded font-medium"
                  >
                    {GHANA_REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Town / City / Suburb *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.townCity}
                    onChange={(e) => setCustomer({ ...customer, townCity: e.target.value })}
                    placeholder="e.g. Oforikrom, Kumasi or Madina, Accra"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                  {errors.townCity && <p className="text-rose-600 text-[11px] mt-1">{errors.townCity}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-800 mb-1">
                    Landmark / Delivery House Address
                  </label>
                  <input
                    type="text"
                    value={customer.landmarkAddress}
                    onChange={(e) => setCustomer({ ...customer, landmarkAddress: e.target.value })}
                    placeholder="e.g. Near Shell filling station, or Behind Central Mosque, Accra Town"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                  {errors.landmarkAddress && <p className="text-rose-600 text-[11px] mt-1">{errors.landmarkAddress}</p>}
                </div>
              </div>

              {/* Delivery Speed / Mode options */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-stone-900 block">How would you like to receive your dresses?</span>
                
                <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                  deliveryType === 'pickup' ? 'border-[#5B0F2A] bg-pink-50/60' : 'border-stone-200'
                }`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'pickup'}
                    onChange={() => setDeliveryType('pickup')}
                    className="mt-0.5 accent-[#5B0F2A]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">Pick Up in Person at Oforikrom Shop</span>
                    <span className="text-stone-600">Free pickup at Accra Town, Behind Central Mosque (Kumasi). You can try on your dress in-store!</span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                  deliveryType === 'dispatch' ? 'border-[#5B0F2A] bg-pink-50/60' : 'border-stone-200'
                }`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'dispatch'}
                    onChange={() => setDeliveryType('dispatch')}
                    className="mt-0.5 accent-[#5B0F2A]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">Doorstep Rider Dispatch (Kumasi / Accra)</span>
                    <span className="text-stone-600">Local delivery rider straight to your home or workplace once sewing completes.</span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                  deliveryType === 'bus' ? 'border-[#5B0F2A] bg-pink-50/60' : 'border-stone-200'
                }`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'bus'}
                    onChange={() => setDeliveryType('bus')}
                    className="mt-0.5 accent-[#5B0F2A]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">VIP / STC Bus Parcel Delivery (Other Ghana Regions)</span>
                    <span className="text-stone-600">Dispatched via VIP, OA, or STC parcel office to Tamale, Takoradi, Sunyani, Ho, etc.</span>
                  </div>
                </label>
              </div>

            </div>

            {/* 3. Payment / Confirmation method */}
            <div className="bg-white p-6 border border-stone-200 shadow-xs rounded space-y-4">
              <h3 className="font-serif-brand text-xl text-stone-900 font-bold border-b border-stone-100 pb-3">
                3. Order & Payment Preference
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-3 border rounded text-xs font-bold text-center transition-all cursor-pointer ${
                    paymentMethod === 'whatsapp'
                      ? 'border-[#5B0F2A] bg-[#5B0F2A] text-white'
                      : 'border-stone-200 bg-white text-stone-800'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 mx-auto mb-1" />
                  <span>Confirm on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-3 border rounded text-xs font-bold text-center transition-all cursor-pointer ${
                    paymentMethod === 'momo'
                      ? 'border-[#5B0F2A] bg-[#5B0F2A] text-white'
                      : 'border-stone-200 bg-white text-stone-800'
                  }`}
                >
                  <span className="block font-black text-amber-500 mb-0.5">MoMo</span>
                  <span>MTN / Telecel Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 border rounded text-xs font-bold text-center transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#5B0F2A] bg-[#5B0F2A] text-white'
                      : 'border-stone-200 bg-white text-stone-800'
                  }`}
                >
                  <MapPin className="w-4 h-4 mx-auto mb-1" />
                  <span>Pay on Pickup in Store</span>
                </button>
              </div>

              {/* Note */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600 space-y-1">
                <p><strong>Ghana MoMo & Shop Payments:</strong></p>
                <p>Our team will message/call your number (<strong>024 284 2090 / 026 446 0744</strong>) to confirm the exact price quote for your selected fabrics and length before sewing begins!</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Additional Notes or Specific Measurements:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need dress ready before Friday Jumu'ah prayer or Eid day."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
              </div>

            </div>

          </div>

          {/* RIGHT: Order items review & submission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-stone-200 shadow-xs rounded sticky top-28 space-y-4">
              
              <h3 className="font-serif-brand text-xl text-stone-900 font-bold border-b border-stone-100 pb-3">
                Selected Dresses ({cart.length})
              </h3>

              {/* Mini Item List */}
              <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-stone-100 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                    <div className="w-14 aspect-[3/4] bg-stone-100 border border-stone-200 rounded-sm shrink-0 overflow-hidden relative">
                      <ColorizedDressImage
                        baseImage={item.image}
                        color={item.color}
                        alt={`${item.name} in ${item.color.name}`}
                        showBadge={false}
                        className="w-full h-full object-cover object-top"
                        containerClassName="w-full h-full relative"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif-brand text-stone-900 font-bold line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Length: <strong className="text-[#5B0F2A] font-bold">{item.size}</strong> · Shade: {item.color.name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} · <span className="font-semibold text-[#5B0F2A]">Price on Request</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shop contact reminder */}
              <div className="pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#5B0F2A]">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call/WhatsApp: 050 127 3875 / 024 284 2090</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Mail className="w-3.5 h-3.5 text-pink-900" />
                  <span>Direct Order Email: <strong>{SHOP_TARGET_EMAIL}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Oforikrom, Accra Town Behind Central Mosque</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'Dispatching Booking...' 
                      : 'Book Now (Sends to WhatsApp 050 127 3875 & Email)'}
                  </span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const { text } = formatBookingSummary({
                        orderNumber: `QUICK-${Date.now().toString().slice(-4)}`,
                        customer,
                        items: cart,
                        deliveryType,
                        notes,
                      });
                      openWhatsAppOrder(text, PRIMARY_WHATSAPP_NUMBER);
                    }}
                    className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wide transition-colors shadow-xs cursor-pointer rounded flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp 050 127 3875</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const { text } = formatBookingSummary({
                        orderNumber: `QUICK-${Date.now().toString().slice(-4)}`,
                        customer,
                        items: cart,
                        deliveryType,
                        notes,
                      });
                      openWhatsAppOrder(text, SECONDARY_WHATSAPP_NUMBER);
                    }}
                    className="py-2.5 px-3 bg-stone-700 hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wide transition-colors shadow-xs cursor-pointer rounded flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp 024 284 2090</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const { text, subject } = formatBookingSummary({
                      orderNumber: `QUICK-${Date.now().toString().slice(-4)}`,
                      customer,
                      items: cart,
                      deliveryType,
                      notes,
                    });
                    openEmailOrder({
                      to: SHOP_TARGET_EMAIL,
                      subject,
                      body: text,
                    });
                  }}
                  className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-[11px] font-bold uppercase tracking-wide transition-colors rounded flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#5B0F2A]" />
                  <span>Send Direct Email to {SHOP_TARGET_EMAIL}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                We will immediately follow up with you on WhatsApp / Phone with your price quote and sewing schedule.
              </p>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
