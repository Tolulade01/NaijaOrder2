export function normalizePhoneNumber(input?: string|null){if(!input)return null;const digits=input.replace(/\D/g,'');if(digits.startsWith('234')&&digits.length===13)return digits;if(digits.startsWith('0')&&digits.length===11)return `234${digits.slice(1)}`;if(digits.length===10)return `234${digits}`;return digits.length>=10?digits:null}
export function createWhatsAppLink(phone:string,message:string){const normalized=normalizePhoneNumber(phone);if(!normalized)return null;return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`}

type WhatsAppOrderItem = { product_name: string; quantity: number; total_price: number|string };

export function orderMessage(
  customerName:string,
  orderNumber:string,
  subtotal:string,
  deliveryFee:string,
  discount:string,
  total:string,
  paymentStatus:string,
  paymentMethod:string,
  status:string,
  items: WhatsAppOrderItem[] = [],
){
  const itemLines = items.length
    ? items.map((item) => `• ${item.product_name} × ${item.quantity} — ${typeof item.total_price === 'number' ? item.total_price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }) : item.total_price}`).join('\n')
    : '• Order details unavailable';
  return `Hi ${customerName} 👋\n\nYour order #${orderNumber} has been received.\n\nOrder details:\n${itemLines}\n\nSubtotal: ${subtotal}\nDelivery fee: ${deliveryFee}\nDiscount: ${discount}\nTotal: ${total}\nPayment status: ${paymentStatus}\nPayment method: ${paymentMethod}\nOrder status: ${status}\n\nThank you for your order.`;
}
