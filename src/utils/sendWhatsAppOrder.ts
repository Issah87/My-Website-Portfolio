import { getAbsoluteImageUrl } from '../context/ShopContext';
import { ProductColor, OrderCustomer, CartItem } from '../types';

export const PRIMARY_WHATSAPP_NUMBER = '233501273875'; // 050 127 3875
export const SECONDARY_WHATSAPP_NUMBER = '233242842090'; // 024 284 2090
export const SHOP_TARGET_EMAIL = 'issahn712@gmail.com';

export interface SendOrderWithImageParams {
  dressName?: string;
  color?: ProductColor | { name: string; hex?: string; secondaryHex?: string };
  baseImageSrc?: string;
  isBaseColor?: boolean;
  messageText: string;
  ownerWhatsApp?: string;
}

/**
 * Normalizes Ghana phone numbers for WhatsApp wa.me links.
 * E.g., '0501273875' or '050 127 3875' -> '233501273875'
 * WhatsApp requires the international country code (233) without leading zero or '+'.
 */
export function normalizeWhatsAppNumber(phone?: string): string {
  if (!phone) return PRIMARY_WHATSAPP_NUMBER;
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) {
    digits = '233' + digits.slice(1);
  }
  if (!digits.startsWith('233') && digits.length === 9) {
    digits = '233' + digits;
  }
  return digits || PRIMARY_WHATSAPP_NUMBER;
}

/**
 * Opens WhatsApp directly to the owner WhatsApp: 050 127 3875 (233501273875)
 * or alternative number with the clean order or inquiry text.
 */
export function openWhatsAppOrder(
  messageText: string,
  ownerWhatsApp: string = PRIMARY_WHATSAPP_NUMBER
): void {
  const cleanPhone = normalizeWhatsAppNumber(ownerWhatsApp);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Generates an email mailto URL addressed directly to issahn712@gmail.com
 */
export function createOrderEmailUrl(params: {
  to?: string;
  subject: string;
  body: string;
}): string {
  const recipient = encodeURIComponent(params.to || SHOP_TARGET_EMAIL);
  const subject = encodeURIComponent(params.subject);
  const body = encodeURIComponent(params.body);
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

/**
 * Generates a Gmail web composer URL directly prefilled to issahn712@gmail.com
 */
export function createGmailWebUrl(params: {
  to?: string;
  subject: string;
  body: string;
}): string {
  const recipient = encodeURIComponent(params.to || SHOP_TARGET_EMAIL);
  const subject = encodeURIComponent(params.subject);
  const body = encodeURIComponent(params.body);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
}

/**
 * Opens the customer's email client addressed directly to issahn712@gmail.com
 */
export function openEmailOrder(params: {
  to?: string;
  subject: string;
  body: string;
}): void {
  const mailtoUrl = createOrderEmailUrl(params);
  // Using location.href for mailto ensures the user's default email client opens smoothly
  window.location.href = mailtoUrl;
}

/**
 * Formats a clean, professional booking message for both WhatsApp and Email
 */
export function formatBookingSummary(params: {
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  deliveryType?: string;
  paymentMethod?: string;
  notes?: string;
}): { text: string; subject: string } {
  const { orderNumber, customer, items, deliveryType = 'pickup', notes = '' } = params;

  const subject = `New Dress Booking #${orderNumber} - ${customer.fullName} (${customer.townCity})`;

  const text = 
    `🌟 AL-IKHLAS FASHION CENTER · DRESS BOOKING #${orderNumber} 🌟\n` +
    `Shop Location: Oforikrom, Accra Town Behind Central Mosque, Kumasi, Ghana\n` +
    `Direct Contacts: 050 127 3875 / 024 284 2090 | Email: ${SHOP_TARGET_EMAIL}\n` +
    `========================================\n\n` +
    `👤 CUSTOMER DETAILS:\n` +
    `• Full Name: ${customer.fullName}\n` +
    `• Ghana Phone: ${customer.phone}\n` +
    (customer.altPhone ? `• Alt / Relative Phone: ${customer.altPhone}\n` : '') +
    (customer.email ? `• Customer Email: ${customer.email}\n` : '') +
    `• Region: ${customer.region}\n` +
    `• Town / City: ${customer.townCity}\n` +
    (customer.landmarkAddress ? `• Landmark / Delivery Address: ${customer.landmarkAddress}\n` : '') +
    `• Preferred Contact: ${customer.preferredContact || 'WhatsApp'}\n\n` +
    `🚚 DELIVERY METHOD:\n` +
    `• ${deliveryType === 'pickup' ? 'Shop Pickup at Oforikrom, Accra Town' : deliveryType === 'dispatch' ? 'Doorstep Rider Dispatch (Kumasi / Accra)' : 'VIP / STC Bus Parcel Dispatch'}\n\n` +
    `👗 SELECTED DRESSES (${items.length}):\n` +
    items.map((item, idx) => 
      `${idx + 1}. "${item.name}"\n` +
      `   - Chosen Color: ${item.color.name}\n` +
      `   - Selected Length: ${item.size}\n` +
      `   - Quantity: ${item.quantity}\n` +
      (item.customNotes ? `   - Tailoring Notes: ${item.customNotes}\n` : '')
    ).join('\n') +
    `\n\n` +
    (notes.trim() ? `📝 CUSTOMER NOTES / MEASUREMENTS:\n${notes.trim()}\n\n` : '') +
    `========================================\n` +
    `Please confirm the final price quote, sewing schedule, and MoMo payment details so sewing can begin!`;

  return { text, subject };
}

/**
 * Dispatches the booking to both WhatsApp (0501273875) and Email (issahn712@gmail.com)
 */
export function dispatchBookingToWhatsAppAndEmail(params: {
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  deliveryType?: string;
  paymentMethod?: string;
  notes?: string;
  targetWhatsApp?: string;
}): void {
  const { text, subject } = formatBookingSummary(params);
  
  // 1. Open WhatsApp to primary number (0501273875)
  openWhatsAppOrder(text, params.targetWhatsApp || PRIMARY_WHATSAPP_NUMBER);

  // 2. Open Email to issahn712@gmail.com
  setTimeout(() => {
    openEmailOrder({
      to: SHOP_TARGET_EMAIL,
      subject,
      body: text,
    });
  }, 400);
}

/**
 * Backwards compatible order sender that routes directly to WhatsApp chat
 */
export async function sendWhatsAppOrderWithImage({
  messageText,
  ownerWhatsApp = PRIMARY_WHATSAPP_NUMBER,
}: SendOrderWithImageParams): Promise<void> {
  openWhatsAppOrder(messageText, ownerWhatsApp);
}

/**
 * Downloads the dress photo separately to the customer's phone or computer.
 */
export async function downloadDressPhoto(imageSrc: string, dressName: string): Promise<void> {
  try {
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = dressName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    a.download = `${safeName}_al_ikhlas.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    // Direct link fallback
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = `${dressName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 * Shares the dress photo separately (via native Web Share API or WhatsApp link)
 * without bundling it into an order or inquiry.
 */
export async function shareDressPhoto(
  imageSrc: string,
  dressName: string,
  colorName?: string
): Promise<boolean> {
  const photoUrl = getAbsoluteImageUrl(imageSrc);
  const shareTitle = `Al-Ikhlas Fashion Center · ${dressName}`;
  const shareText = `Check out this dress: "${dressName}"${colorName ? ` in ${colorName}` : ''} at Al-Ikhlas Fashion Center (Oforikrom, Kumasi · Owner WhatsApp: 024 284 2090).\nPhoto: ${photoUrl}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const safeName = dressName.replace(/[^a-zA-Z0-9]/g, '_');
      const file = new File([blob], `${safeName}.jpg`, { type: blob.type || 'image/jpeg' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: shareText,
        });
        return true;
      } else {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: photoUrl || window.location.href,
        });
        return true;
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        console.log('Share error:', e);
      }
    }
  }

  // Fallback: Open WhatsApp with the separate photo share
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  window.open(waShareUrl, '_blank', 'noopener,noreferrer');
  return true;
}
