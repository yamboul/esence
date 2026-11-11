import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Cliente de Supabase. Es null mientras no existan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local:
 * en ese caso la tienda funciona en modo demostración (sin login, pedidos sin guardar).
 */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const supabaseEnabled = supabase !== null;

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
