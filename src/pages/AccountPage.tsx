import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Loader2, LogOut, Package, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, supabaseEnabled } from '@/lib/supabase';
import { STATUS_LABELS, STATUS_STYLES, type Order } from '@/lib/orders';
import { formatCOP, VERSION_LABELS } from '@/types';

function GoogleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.28a12 12 0 0 0 0 10.78l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.8l3.44-3.44A11.94 11.94 0 0 0 12 0 12 12 0 0 0 1.28 6.61l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77z" />
    </svg>
  );
}

export default function AccountPage() {
  const { ready, session } = useAuth();

  if (!supabaseEnabled) {
    return (
      <Shell>
        <h1 className="font-serif text-3xl font-medium text-ink-900">Mi cuenta</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          El inicio de sesión aún no está activo. Se habilita al conectar la tienda con Supabase (ver SUPABASE_SETUP.md).
        </p>
      </Shell>
    );
  }

  if (!ready) {
    return (
      <Shell>
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
        </div>
      </Shell>
    );
  }

  return session ? <SignedIn /> : <SignIn />;
}

function Shell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="container-luxe py-12 lg:py-16">
      <div className={`mx-auto ${wide ? 'max-w-3xl' : 'max-w-md'}`}>{children}</div>
    </div>
  );
}

function SignIn() {
  const { signInWithGoogle, signInWithPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const google = async () => {
    setError(null);
    setBusy(true);
    const err = await signInWithGoogle('/cuenta');
    if (err) {
      setError(err);
      setBusy(false);
    }
  };

  const adminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const err = await signInWithPassword(email, password);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <Shell>
      <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-gold-300">
          <User className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-serif text-3xl font-medium text-ink-900">Bienvenido a ESSENCE</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Inicia sesión o crea tu cuenta para ver tus pedidos y comprar más rápido.
        </p>
        <button
          onClick={google}
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-ink-200 bg-white px-6 py-3.5 text-sm font-medium text-ink-900 transition-all hover:border-ink-900 hover:shadow-md disabled:opacity-50"
        >
          <GoogleIcon /> Continuar con Google
        </button>
        <p className="mt-3 text-xs text-ink-400">Si es tu primera vez, tu cuenta se crea automáticamente.</p>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-rust-400/10 px-4 py-3 text-sm text-rust-500">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-ink-100">
        <button
          onClick={() => setShowAdmin((v) => !v)}
          aria-expanded={showAdmin}
          className="flex w-full items-center justify-between px-6 py-4 text-sm font-medium text-ink-600 hover:text-ink-900"
        >
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Acceso administradores
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdmin ? 'rotate-180' : ''}`} />
        </button>
        {showAdmin && (
          <form onSubmit={adminLogin} className="space-y-4 border-t border-ink-100 px-6 py-5">
            <div>
              <label className="label-luxe" htmlFor="admin-email">Correo</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                className="input-luxe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label-luxe" htmlFor="admin-password">Contraseña</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                className="input-luxe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ingresar'}
            </button>
          </form>
        )}
      </div>
    </Shell>
  );
}

function SignedIn() {
  const { session, profile, isAdmin, signOut, setMarketingOptIn } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [savingOptIn, setSavingOptIn] = useState(false);
  const [optInError, setOptInError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !session) return;
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [session]);

  const toggleOptIn = async (value: boolean) => {
    setSavingOptIn(true);
    setOptInError(await setMarketingOptIn(value));
    setSavingOptIn(false);
  };

  // Sin nombre (p. ej. admin creado con correo): saludo neutro, el correo ya se muestra debajo.
  const name = profile?.full_name?.split(' ')[0];

  return (
    <Shell wide>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">Mi cuenta</p>
          <h1 className="font-serif text-3xl font-medium text-ink-900 sm:text-4xl">{name ? `Hola, ${name}` : 'Hola'}</h1>
          <p className="mt-1 text-sm text-ink-500">{session?.user.email}</p>
        </div>
        <button onClick={signOut} className="btn-ghost">
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </div>

      {isAdmin && (
        <Link
          to="/admin"
          className="mt-8 flex items-center justify-between rounded-2xl bg-ink-900 p-6 text-ivory-50 transition-colors hover:bg-ink-800"
        >
          <span className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-gold-300" />
            <span>
              <span className="block font-medium">Panel de administrador</span>
              <span className="text-sm text-ivory-100/70">Pedidos, pagos, administradores y clientes</span>
            </span>
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      )}

      <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-100 bg-ivory-100 p-5 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={profile?.marketing_opt_in ?? false}
          disabled={savingOptIn || !profile}
          onChange={(e) => toggleOptIn(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-300 text-ink-900 focus:ring-ink-900"
        />
        <span>
          <span className="block font-medium text-ink-900">Ofertas y novedades por correo</span>
          Recibe promociones exclusivas y lanzamientos. Puedes desactivarlo cuando quieras.
          {optInError && <span className="mt-1 block text-rust-500">{optInError}</span>}
        </span>
      </label>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl font-medium text-ink-900">Mis pedidos</h2>
        {orders === null ? (
          <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 py-12 text-center">
            <Package className="h-8 w-8 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">Aún no tienes pedidos con esta cuenta.</p>
            <Link to="/catalogo" className="btn-outline mt-5">
              Explorar perfumes
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="rounded-2xl border border-ink-100 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm text-ink-900">{o.reference}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-600">
                  {o.items.map((i) => `${i.name} (${VERSION_LABELS[i.version]}) x${i.quantity}`).join(', ')}
                </p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-ink-400">{new Date(o.created_at).toLocaleDateString('es-CO', { dateStyle: 'medium' })}</span>
                  <span className="price">{formatCOP(o.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Shell>
  );
}
