import type { VersionKey } from '@/types';

export type PaymentMethod = 'wompi' | 'transferencia' | 'contraentrega';

export type OrderStatus = 'pendiente_pago' | 'pagado' | 'pago_rechazado' | 'enviado' | 'entregado' | 'cancelado';

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  version: VersionKey;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  reference: string;
  full_name: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  address: string;
  notes: string | null;
  payment_method: PaymentMethod;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  wompi_payment_type: string | null;
  marketing_opt_in: boolean;
  created_at: string;
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  wompi: 'Pago en línea',
  transferencia: 'Transferencia',
  contraentrega: 'Contraentrega',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente_pago: 'Pago pendiente',
  pagado: 'Pagado',
  pago_rechazado: 'Pago rechazado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente_pago: 'bg-gold-100 text-gold-800',
  pagado: 'bg-sage-500/15 text-sage-600',
  pago_rechazado: 'bg-rust-400/15 text-rust-500',
  enviado: 'bg-ink-100 text-ink-700',
  entregado: 'bg-ink-900 text-ivory-50',
  cancelado: 'bg-ink-100 text-ink-400 line-through',
};

/** Clave en sessionStorage del pedido que se está pagando en Wompi. */
export const PENDING_ORDER_KEY = 'essence-pending-order';
