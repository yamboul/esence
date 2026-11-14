import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { CheckoutForm } from '@/types';

type PaymentMethod = CheckoutForm['paymentMethod'];

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'cliente' | 'admin';
  marketing_opt_in: boolean;
  phone: string | null;
  department: string | null;
  city: string | null;
  address: string | null;
  address_notes: string | null;
  preferred_payment: PaymentMethod | null;
  data_consent_at: string | null;
  data_policy_version: string | null;
}

/** Campos que el cliente puede editar de su propio perfil. */
export type ProfilePatch = Partial<
  Pick<
    Profile,
    | 'full_name'
    | 'phone'
    | 'department'
    | 'city'
    | 'address'
    | 'address_notes'
    | 'preferred_payment'
    | 'data_consent_at'
    | 'data_policy_version'
  >
>;

const PROFILE_COLUMNS =
  'id, email, full_name, role, marketing_opt_in, phone, department, city, address, address_notes, preferred_payment, data_consent_at, data_policy_version';

/** ¿Tiene todo lo necesario para enviar un pedido sin volver a escribir nada? */
// eslint-disable-next-line react-refresh/only-export-components
export function hasShippingData(p: Profile | null): p is Profile {
  return Boolean(p?.full_name && p.phone && p.department && p.city && p.address);
}

interface AuthContextValue {
  /** false mientras se recupera la sesión guardada */
  ready: boolean;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  signInWithGoogle: (redirectPath?: string) => Promise<string | null>;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  setMarketingOptIn: (value: boolean) => Promise<string | null>;
  /** Guarda cambios del perfil propio. Devuelve un mensaje de error o null. */
  updateProfile: (patch: ProfilePatch) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!supabase);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }
    const full = await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', userId).maybeSingle();
    if (!full.error) {
      setProfile((full.data as Profile | null) ?? null);
      return;
    }
    // Si aún no se ejecutó la migración de datos de envío, se cargan solo las columnas básicas
    // para que el login (y el acceso de administradores) siga funcionando.
    const basic = await supabase
      .from('profiles')
      .select('id, email, full_name, role, marketing_opt_in')
      .eq('id', userId)
      .maybeSingle();
    setProfile(
      basic.data
        ? {
            ...(basic.data as Pick<Profile, 'id' | 'email' | 'full_name' | 'role' | 'marketing_opt_in'>),
            phone: null,
            department: null,
            city: null,
            address: null,
            address_notes: null,
            preferred_payment: null,
            data_consent_at: null,
            data_policy_version: null,
          }
        : null
    );
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session?.user.id);
      if (active) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      // Fuera del callback: Supabase recomienda no esperar otras llamadas dentro de onAuthStateChange.
      setTimeout(() => loadProfile(next?.user.id), 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      session,
      profile,
      isAdmin: profile?.role === 'admin',
      signInWithGoogle: async (redirectPath = '/cuenta') => {
        if (!supabase) return 'El inicio de sesión aún no está configurado.';
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}${redirectPath}` },
        });
        return error ? 'No pudimos conectar con Google. Intenta de nuevo.' : null;
      },
      signInWithPassword: async (email, password) => {
        if (!supabase) return 'El inicio de sesión aún no está configurado.';
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        return error ? 'Correo o contraseña incorrectos.' : null;
      },
      signOut: async () => {
        await supabase?.auth.signOut();
        setProfile(null);
      },
      setMarketingOptIn: async (optIn) => {
        if (!supabase || !session) return 'Inicia sesión primero.';
        const { error } = await supabase
          .from('profiles')
          .update({ marketing_opt_in: optIn })
          .eq('id', session.user.id);
        if (error) return 'No pudimos guardar tu preferencia.';
        setProfile((p) => (p ? { ...p, marketing_opt_in: optIn } : p));
        return null;
      },
      updateProfile: async (patch) => {
        if (!supabase || !session) return 'Inicia sesión primero.';
        const { error } = await supabase.from('profiles').update(patch).eq('id', session.user.id);
        if (error) return 'No pudimos guardar tus datos. Intenta de nuevo.';
        setProfile((p) => (p ? { ...p, ...patch } : p));
        return null;
      },
      refreshProfile: () => loadProfile(session?.user.id),
    }),
    [ready, session, profile, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
