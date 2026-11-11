// Utilidades compartidas por las Edge Functions (Deno).
import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

/** Cliente con service role: ignora RLS. Solo para uso en el servidor. */
export function adminClient(): SupabaseClient {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  });
}

/** Usuario que hace la petición (null si es un visitante sin sesión). */
export async function requestUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const client = createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data } = await client.auth.getUser();
  return data.user ?? null;
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const formatCOP = (value: number): string =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  version: 'classic' | 'premium';
  quantity: number;
  unit_price: number;
}

export interface OrderRow {
  id: string;
  reference: string;
  full_name: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  address: string;
  notes: string | null;
  payment_method: 'wompi' | 'transferencia' | 'contraentrega';
  items: OrderItem[];
  total: number;
  status: string;
  wompi_payment_type?: string | null;
  telegram_notified_at?: string | null;
}

const PAYMENT_LABEL: Record<OrderRow['payment_method'], string> = {
  wompi: 'Pago en línea (Wompi)',
  transferencia: 'Transferencia bancaria',
  contraentrega: 'Contraentrega',
};

/** Envía la orden de pedido al chat de Telegram configurado. Devuelve true si se envió. */
export async function notifyTelegram(order: OrderRow, headline: string): Promise<boolean> {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
  if (!token || !chatId) {
    console.warn('Telegram no configurado: falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID');
    return false;
  }

  const items = order.items
    .map(
      (i) =>
        `• ${escapeHtml(`${i.brand} ${i.name}`)} — ${i.version === 'premium' ? 'Premium' : 'Classic'} x${i.quantity} · ${formatCOP(i.unit_price * i.quantity)}`
    )
    .join('\n');

  const payment =
    PAYMENT_LABEL[order.payment_method] + (order.wompi_payment_type ? ` · ${escapeHtml(order.wompi_payment_type)}` : '');

  const text = [
    `<b>${escapeHtml(headline)}</b>`,
    `Pedido <code>${escapeHtml(order.reference)}</code>`,
    '',
    items,
    `<b>Total: ${formatCOP(order.total)}</b> (envío gratis)`,
    '',
    `💳 ${payment}`,
    `👤 ${escapeHtml(order.full_name)}`,
    `📞 ${escapeHtml(order.phone)}`,
    `✉️ ${escapeHtml(order.email)}`,
    `📍 ${escapeHtml(`${order.address}, ${order.city}, ${order.department}`)}`,
    order.notes ? `📝 ${escapeHtml(order.notes)}` : '',
  ]
    .filter((line, i, arr) => line !== '' || arr[i - 1] !== '')
    .join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!res.ok) console.error('Error de Telegram', res.status, await res.text());
  return res.ok;
}
