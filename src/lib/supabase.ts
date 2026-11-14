import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Cliente de Supabase. Es null mientras no existan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local:
 * en ese caso la tienda funciona en modo demostración (sin login, pedidos sin guardar).
 */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const supabaseEnabled = supabase !== null;

/**
 * Pedidos guardados en Supabase y pago en línea con Wompi. Requiere las Edge Functions desplegadas
 * (create-order, wompi-webhook) y sus secretos. Mientras sea false, el login con Google funciona igual,
 * pero los pedidos se envían por WhatsApp.
 */
export const onlineOrders = supabaseEnabled && import.meta.env.VITE_ORDERS_ONLINE === 'true';

/** Mensaje de error legible de una Edge Function invocada con supabase.functions.invoke. */
export async function functionErrorMessage(error: unknown): Promise<string> {
  const ctx = (error as { context?: Response })?.context;
  if (ctx && typeof ctx.json === 'function') {
    try {
      const body = await ctx.json();
      if (body?.error) return String(body.error);
    } catch {
      // ignore
    }
  }
  return 'Ocurrió un error. Intenta de nuevo.';
}
