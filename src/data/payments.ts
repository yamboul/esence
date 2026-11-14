import { Banknote, CreditCard, Landmark } from 'lucide-react';
import { onlineOrders } from '@/lib/supabase';
import type { CheckoutForm } from '@/types';

export type PaymentMethod = CheckoutForm['paymentMethod'];

export const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  desc: string;
  icon: typeof CreditCard;
}[] = [
  { value: 'wompi', label: 'Pago en línea', desc: 'Tarjeta, PSE o Nequi · vía Wompi', icon: CreditCard },
  { value: 'transferencia', label: 'Transferencia bancaria', desc: 'Te enviamos los datos para pagar', icon: Landmark },
  { value: 'contraentrega', label: 'Pago contraentrega', desc: 'Pagas al recibir', icon: Banknote },
];

// Sin pedidos en línea no hay dónde cobrar con Wompi: el pedido se envía por WhatsApp.
export const AVAILABLE_PAYMENTS = onlineOrders
  ? PAYMENT_OPTIONS
  : PAYMENT_OPTIONS.filter((o) => o.value !== 'wompi');

export const paymentLabel = (method: PaymentMethod): string =>
  PAYMENT_OPTIONS.find((o) => o.value === method)?.label ?? '';
