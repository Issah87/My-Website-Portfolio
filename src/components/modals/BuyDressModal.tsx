import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Send, 
  Scissors, 
  Check, 
  Mail, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductColor, AbayaLength, OrderCustomer, PaymentMethod, CartItem } from '../../types';
import { GHANA_REGIONS } from '../../data/mockProducts';
import { 
  openEmailOrder, 
  downloadDressPhoto, 
  SHOP_TARGET_EMAIL 
} from '../../utils/sendWhatsAppOrder';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';

export const BuyDressModal: React.FC = () => {
  const { 
    isInquiryModalOpen, 
    setIsInquiryModalOpen, 
    selectedInquiryProduct, 
    selectedInquiryColor, 
    selectedInquiryLength, 
    createOrder,
    currentCustomerEmail,
    setCurrentCustomerEmail,
    setActiveTab,
    getAbsoluteImageUrl 
  } = useShop();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState(currentCustomerEmail || '');
  const [region, setRegion] = useState(GHANA_REGIONS[0]);
  const [townCity, setTownCity] = useState('Oforikrom, Kumasi');
  const [landmarkAddress, setLandmarkAddress] = useState('');
  const [abayaLength, setAbayaLength] = useState<AbayaLength>(selectedInquiryLength || '54"');
  const [chosenColor, setChosenColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');
  const [customMeasurements, setCustomMeasurements] = useState('');
  
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (selectedInquiryColor) {
      setChosenColor(selectedInquiryColor);
    } else if (selectedInquiryProduct && selectedInquiryProduct.colors.length > 0) {
      setChosenColor(selectedInquiryProduct.colors[0]);
    } else {
      setChosenColor(null);
    }
  }, [selectedInquiryProduct, selectedInquiryColor]);

  useEffect(() => {
    if (selectedInquiryLength) {
      setAbayaLength(selectedInquiryLength);
    }
  }, [selectedInquiryLength]);

  useEffect(() => {
    if (currentCustomerEmail) {
      setClientEmail(currentCustomerEmail);
    }
  }, [currentCustomerEmail]);

  useEffect(() => {
    if (isInquiryModalOpen) {
      setSubmittedOrder(null);
      setErrorMsg('');
    }
  }, [isInquiryModalOpen]);

  if (!isInquiryModalOpen) return null;

  const product = selectedInquiryProduct;
  const baseImage = product?.images[0] || '';

  const handleConfirmBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setErrorMsg('Valid email is required so you can track your order in "My Orders" and communicate with the owner.');
      return;
    }
    if (!townCity.trim()) {
      setErrorMsg('Please specify your town or city (e.g. Oforikrom, Kumasi / Madina, Accra).');
      return;
    }

    const activeColor = chosenColor || (product?.colors[0] || { name: 'Signature Black', hex: '#1C1917' });

    const orderCustomer: OrderCustomer = {
      fullName: clientName.trim(),
      email: clientEmail.trim(),
      region,
      townCity: townCity.trim(),
      landmarkAddress: landmarkAddress.trim() || 'Oforikrom atelier pickup / local address',
      preferredContact: 'On-Website Portal'
    };

    const cartItem: CartItem = {
      id: `item-${Date.now()}`,
      productId: product?.id || 'prod-custom',
      name: product?.name || 'Custom Tailored Abaya Dress',
      priceText: product?.priceText || 'Price on Request',
      image: baseImage,
      size: abayaLength,
      color: activeColor,
      quantity,
      customNotes: customMeasurements.trim() || undefined
    };

    const newOrder = createOrder({
      customer: orderCustomer,
      items: [cartItem],
      paymentMethod,
      paymentStatus: paymentMethod === 'momo' ? 'Pending Verification' : 'Pay on Pickup/Delivery',
      orderStatus: 'Order Confirmed',
      notes: customMeasurements.trim() ? `Measurements / Tailoring: ${customMeasurements.trim()}` : 'Direct on-website purchase'
    });

    setCurrentCustomerEmail(clientEmail.trim());
    setSubmittedOrder(newOrder);
    setErrorMsg('');
  };

  const handleSendEmailCopy = () => {
    if (!submittedOrder) return;
    const activeColor = chosenColor || (product?.colors[0] || { name: 'Signature Black', hex: '#1C1917' });
    const subject = `Order #${submittedOrder.orderNumber}: ${product?.name || 'Dress'} - ${clientName}`;
    const body = 
      `🌟 AL-IKHLAS FASHION CENTER · DRESS ORDER #${submittedOrder.orderNumber} 🌟\n` +
      `Shop: Oforikrom, Accra Town Behind Central Mosque, Kumasi, Ghana\n` +
      `Owner Email: ${SHOP_TARGET_EMAIL}\n\n` +
      `I have placed an order on the website and am sending the order details:\n\n` +
      `👤 BUYER DETAILS:\n` +
      `• Name: ${clientName}\n` +
      `• Email: ${clientEmail}\n` +
      `• Region: ${region}\n` +
      `• Town/City: ${townCity}\n` +
      (landmarkAddress ? `• Address / Landmark: ${landmarkAddress}\n` : '') +
      `\n👗 ORDERED DRESS:\n` +
      `• Dress Name: "${product?.name || 'Custom Dress'}"\n` +
      `• Chosen Color: ${activeColor.name}\n` +
      `• Selected Length: ${abayaLength}\n` +
      `• Quantity: ${quantity}\n` +
      (customMeasurements ? `• Custom Tailoring / Notes: ${customMeasurements}\n` : '') +
      `\nPayment Preference: ${paymentMethod === 'momo' ? 'Mobile Money (MoMo)' : paymentMethod === 'cod' ? 'Cash on Pickup / Delivery' : 'Direct Order'}\n\n` +
      `Please confirm receipt and start sewing. Thank you!`;

    openEmailOrder({
      to: SHOP_TARGET_EMAIL,
      subject,
      body,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative bg-white text-stone-900 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 rounded-lg p-5 sm:p-7 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={() => setIsInquiryModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-pink-50 text-[#5B0F2A] border border-pink-200 text-[11px] font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Dress & Send Details to Owner</span>
          </div>
          <h2 className="font-serif-brand text-2xl text-stone-900 font-bold">
            Order This Dress Directly
          </h2>
          <p className="text-xs text-stone-600">
            Send your dress specifications and measurements directly to our boutique owner (issahn712@gmail.com). You can track what you ordered anytime on the website under <strong>My Orders</strong>.
          </p>
        </div>

        {/* SUCCESS STATE */}
        {submittedOrder ? (
          <div className="py-6 space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#5B0F2A] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                Order #{submittedOrder.orderNumber}
              </span>
              <h3 className="font-serif-brand text-2xl text-stone-900 font-bold">
                Order Sent to Boutique Owner!
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Thank you, <strong>{clientName}</strong>! Your order details have been registered on the website and sent to the owner. You can view what you ordered and message the dressmakers in real-time.
              </p>
            </div>

            {/* Order Card Preview */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-left text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-stone-800">{product?.name || 'Custom Abaya'}</span>
                <span className="text-[#5B0F2A] font-semibold">{abayaLength} · Qty: {quantity}</span>
              </div>
              <div className="text-stone-600 flex flex-col gap-1">
                <span><strong>Color:</strong> {chosenColor?.name || 'Selected Color'}</span>
                <span><strong>Delivery:</strong> {townCity}, {region}</span>
                <span><strong>Customer Email:</strong> {clientEmail}</span>
                {customMeasurements && <span><strong>Measurements:</strong> {customMeasurements}</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsInquiryModalOpen(false);
                  setActiveTab('my-orders');
                }}
                className="flex-1 py-3 px-4 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>View What I Have Ordered</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSendEmailCopy}
                className="flex-1 py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="Send email copy directly to issahn712@gmail.com"
              >
                <Mail className="w-4 h-4 text-[#5B0F2A]" />
                <span>Send Email to Owner</span>
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(false)}
                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Continue Browsing Catalog
              </button>
            </div>
          </div>
        ) : (
          /* BUY ORDER FORM */
          <form onSubmit={handleConfirmBuy} className="space-y-4">
            
            {/* Selected Product Card */}
            {product && (
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex gap-3.5 items-center">
                <div className="w-20 h-24 rounded bg-stone-200 shrink-0 overflow-hidden relative border border-stone-300">
                  <ColorizedDressImage
                    baseImage={product.images[0]}
                    color={chosenColor || product.colors[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#5B0F2A] tracking-wider block">
                    {product.category}
                  </span>
                  <h4 className="font-serif-brand text-sm sm:text-base font-bold text-stone-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs font-mono text-[#5B0F2A] font-semibold mt-0.5">
                    {product.priceText}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Selected shade: <strong>{chosenColor?.name || 'Standard'}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product && product.colors.length > 1 && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Select Color Shade:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => setChosenColor(c)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs border transition-colors cursor-pointer ${
                        chosenColor?.name === c.name
                          ? 'border-[#5B0F2A] bg-pink-50 text-[#5B0F2A] font-bold shadow-xs'
                          : 'border-stone-300 hover:border-stone-400 bg-white text-stone-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Length and Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Abaya Length / Dress Height:
                </label>
                <select
                  value={abayaLength}
                  onChange={(e) => setAbayaLength(e.target.value as AbayaLength)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                >
                  <option value='50"'>50" (Petite / Height 5'0"-5'1")</option>
                  <option value='52"'>52" (Height 5'2"-5'3")</option>
                  <option value='54"'>54" (Standard / Height 5'4"-5'5")</option>
                  <option value='56"'>56" (Tall / Height 5'6"-5'7")</option>
                  <option value='58"'>58" (Extra Tall / Height 5'8"-5'9")</option>
                  <option value='60"'>60" (Floor Length)</option>
                  <option value='62"'>62" (Maxi Dramatic)</option>
                  <option value='Custom'>Custom Tailored Height</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quantity:
                </label>
                <div className="flex items-center border border-stone-300 rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xs font-bold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Buyer Contact Details (No phone number required, email is essential for order tracking) */}
            <div className="border-t border-stone-200 pt-3 space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5B0F2A]" />
                <span>Buyer Information (Sent to Owner)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Hajia Mariama Baako"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Email Address: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. mariama@example.com"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    Used to view what you ordered in My Orders.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ghana Region:
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  >
                    {GHANA_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Town or City: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={townCity}
                    onChange={(e) => setTownCity(e.target.value)}
                    placeholder="e.g. Oforikrom, Kumasi or Madina, Accra"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Address / Landmark:
                </label>
                <input
                  type="text"
                  value={landmarkAddress}
                  onChange={(e) => setLandmarkAddress(e.target.value)}
                  placeholder="e.g. Near Central Mosque, Accra Town, Kumasi"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
              </div>

              {/* Payment Preference */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Payment Method Preference:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-2 rounded text-xs border text-center font-medium cursor-pointer transition-colors ${
                      paymentMethod === 'momo'
                        ? 'border-[#5B0F2A] bg-pink-50 text-[#5B0F2A] font-bold'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    Mobile Money (MoMo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2 rounded text-xs border text-center font-medium cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#5B0F2A] bg-pink-50 text-[#5B0F2A] font-bold'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    Pay on Pickup / Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('order_direct')}
                    className={`p-2 rounded text-xs border text-center font-medium cursor-pointer transition-colors ${
                      paymentMethod === 'order_direct'
                        ? 'border-[#5B0F2A] bg-pink-50 text-[#5B0F2A] font-bold'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    Direct Order
                  </button>
                </div>
              </div>

              {/* Custom Measurements / Tailoring Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Custom Measurements / Tailoring Notes (Optional):
                </label>
                <textarea
                  rows={2}
                  value={customMeasurements}
                  onChange={(e) => setCustomMeasurements(e.target.value)}
                  placeholder="e.g. Bust 38, Sleeve length 24, prefer loose modest cut, or specific event date..."
                  className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Boutique Email Note */}
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded flex items-center justify-between text-xs text-stone-600">
              <span>Boutique Owner: <strong>Al-Ikhlas Atelier</strong></span>
              <span className="font-mono text-[#5B0F2A] font-bold">{SHOP_TARGET_EMAIL}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Confirm Buy & Send Details to Owner</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-stone-500">
              After placing this order, you can view your ordered dress and message the owner anytime under <strong>My Orders</strong>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
