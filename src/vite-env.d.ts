/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** 'sandbox' (pruebas) o 'production' */
  readonly VITE_WOMPI_ENV?: 'sandbox' | 'production';
  /** 'true' cuando las Edge Functions estén desplegadas: pedidos en Supabase y pago con Wompi. */
  readonly VITE_ORDERS_ONLINE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
