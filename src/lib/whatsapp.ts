// WhatsApp para dudas de clientes. Sin Supabase configurado, el checkout también envía los pedidos por aquí.
// Número en formato internacional sin "+" ni espacios (requerido por wa.me).
export const WHATSAPP_NUMBER = '573196498196';
export const WHATSAPP_DISPLAY = '+57 319 649 8196';

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
