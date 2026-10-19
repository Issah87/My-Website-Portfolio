import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Scissors, 
  CheckCircle2, 
  Send, 
  Mail, 
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OrderCustomer, PaymentMethod } from '../../types';
import { GHANA_REGIONS } from '../../data/mockProducts';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { 
  openEmailOrder, 
  formatBookingSummary, 
  SHOP_TARGET_EMAIL
} from '../../utils/sendWhatsAppOrder';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    createOrder, 
    setActiveTab, 
    currentCustomerEmail,
    setCurrentCustomerEmail 
  } = useShop();

  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: '',
    email: currentCustomerEmail || '',
    phone: '',
    region: GHANA_REGIONS[0],
    townCity: 'Oforikrom, Kumasi',
    landmarkAddress: '',
    preferredContact: 'On-Website Portal',
  });

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'dispatch' | 'bus'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-brand text-3xl text-stone-900 font-bold">No dresses selected</h2>
        <p className="text-xs text-stone-500">
          Please select from our signature dresses to buy or place an order.
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="mt-4 px-6 py-2.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-colors"
        >
          View All Dresses
        </button>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!customer.email.trim() || !customer.email.includes('@')) {
      errs.email = 'Valid email is required so you can track what you ordered in My Orders.';
    }
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
      createOrder({
        customer,
        items: cart,
        paymentMethod,
        paymentStatus: paymentMethod === 'momo' ? 'Pending Verification' : 'Pay on Pickup/Delivery',
        orderStatus: 'Order Confirmed',
        notes: `Delivery: ${deliveryType}. Notes: ${notes}`,
      });

      if (customer.email) {
        setCurrentCustomerEmail(customer.email);
      }

      setIsSubmitting(false);
      setActiveTab('order-success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
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
            <span>Return to Catalog</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#5B0F2A]">
            <MapPin className="w-3.5 h-3.5 text-[#5B0F2A]" />
            <span>Al-Ikhlas Fashion Center · Custom Tailoring Orders</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Customer & Ghana Delivery Info */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Recipient Details */}
            <div className="bg-white p-6 border border-stone-200 shadow-xs rounded space-y-4">
              <h3 className="font-serif-brand text-xl text-stone-900 font-bold border-b border-stone-100 pb-3">
                1. Customer & Account Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
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
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="e.g. mariama@example.com"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                  {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <div className="p-3 bg-pink-50/70 border border-pink-200 rounded text-xs text-stone-700 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#5B0F2A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#5B0F2A] block">Private Order Tracking & Direct Communication:</span>
                      <p className="text-[11px] text-stone-600">
                        Using your email ensures only you can view what you have ordered in <strong>My Orders</strong>, and you can message the boutique owner directly on the website regarding fittings, measurements, and progress updates.
                      </p>
                    </div>
                  </div>
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
                    <span className="font-bold text-stone-900 block">Pick Up in Person at Oforikrom Workshop</span>
                    <span className="text-stone-600">Accra Town, Behind Central Mosque (Kumasi). You can try on your dress in-store!</span>
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
                    <span className="font-bold text-stone-900 block">Doorstep Rider Dispatch (Kumasi & Accra)</span>
                    <span className="text-stone-600">Same-day courier dispatch once tailoring is completed.</span>
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
                    <span className="text-stone-600">Dispatched via VIP or STC parcel office to Tamale, Takoradi, Sunyani, Ho, etc.</span>
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

                <button
                  type="button"
                  onClick={() => setPaymentMethod('order_direct')}
                  className={`p-3 border rounded text-xs font-bold text-center transition-all cursor-pointer ${
                    paymentMethod === 'order_direct'
                      ? 'border-[#5B0F2A] bg-[#5B0F2A] text-white'
                      : 'border-stone-200 bg-white text-stone-800'
                  }`}
                >
                  <Send className="w-4 h-4 mx-auto mb-1" />
                  <span>Direct Bank / Cash Order</span>
                </button>
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
                        alt={item.name}
                        showBadge={false}
                        className="w-full h-full object-cover object-top"
                        containerClassName="w-full h-full relative"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif-brand font-bold text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Length: <strong className="text-[#5B0F2A]">{item.size}</strong> · Shade: <strong>{item.color.name}</strong>
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} · Price on Request
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Official Atelier Contact Info */}
              <div className="pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Mail className="w-3.5 h-3.5 text-[#5B0F2A]" />
                  <span>Official Boutique Email: <strong className="font-mono text-stone-900">{SHOP_TARGET_EMAIL}</strong></span>
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
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'Confirming Order...' 
                      : 'Confirm Buy & Send Details to Owner'}
                  </span>
                </button>

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
                  <span>Send Order Copy to Boutique Email</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                Once placed, your order is instantly visible under <strong>My Orders</strong>, where you can chat directly with the boutique tailor.
              </p>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
