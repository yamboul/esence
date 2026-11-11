// WhatsApp solo para dudas de clientes; los pedidos se hacen por el checkout.
// Número en formato internacional sin "+" ni espacios (requerido por wa.me).
export const WHATSAPP_NUMBER = '573196498196';
export const WHATSAPP_DISPLAY = '+57 319 649 8196';

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
