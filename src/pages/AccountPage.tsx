import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Loader2, LogOut, MapPin, Package, ShieldCheck, User } from 'lucide-react';
import { hasShippingData, useAuth, type Profile } from '@/context/AuthContext';
import { onlineOrders, supabase, supabaseEnabled } from '@/lib/supabase';
import { STATUS_LABELS, STATUS_STYLES, type Order } from '@/lib/orders';
import { BUSINESS, LEGAL_ROUTES } from '@/data/business';
import { DEPARTMENTS, MUNICIPIOS } from '@/data/colombia';
import { AVAILABLE_PAYMENTS, paymentLabel, type PaymentMethod } from '@/data/payments';
import GoogleButton from '@/components/GoogleButton';
import { formatCOP, VERSION_LABELS } from '@/types';

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
  const { signInWithPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          Entra con tu cuenta de Google, sin contraseñas. Guarda tu dirección una vez y en tus próximas compras solo
          confirmas.
        </p>
        <div className="mt-6">
          <GoogleButton redirectPath="/cuenta" />
        </div>
        <p className="mt-3 text-xs text-ink-500">Si es tu primera vez, tu cuenta se crea automáticamente.</p>
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
            {error && (
              <p role="alert" className="rounded-xl bg-rust-400/10 px-4 py-3 text-sm text-rust-500">
                {error}
              </p>
            )}
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
    if (!supabase || !session || !onlineOrders) return;
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

      {profile && <ShippingData profile={profile} />}

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
        {!onlineOrders ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 px-6 py-10 text-center">
            <Package className="h-8 w-8 text-ink-300" />
            <p className="mt-3 max-w-sm text-sm text-ink-500">
              Tus pedidos se confirman por WhatsApp. Allí te contamos el estado de tu envío.
            </p>
            <Link to="/catalogo" className="btn-outline mt-5">
              Explorar perfumes
            </Link>
          </div>
        ) : orders === null ? (
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
                  <span className="text-ink-500">{new Date(o.created_at).toLocaleDateString('es-CO', { dateStyle: 'medium' })}</span>
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

interface ShippingDraft {
  fullName: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  notes: string;
  payment: PaymentMethod | '';
}

const draftFrom = (p: Profile): ShippingDraft => ({
  fullName: p.full_name ?? '',
  phone: p.phone ?? '',
  department: p.department ?? '',
  city: p.city ?? '',
  address: p.address ?? '',
  notes: p.address_notes ?? '',
  payment: p.preferred_payment ?? '',
});

// Datos de envío guardados en la cuenta: el checkout los usa para no volver a escribirlos.
function ShippingData({ profile }: { profile: Profile }) {
  const { updateProfile } = useAuth();
  const complete = hasShippingData(profile);
  const [editing, setEditing] = useState(!complete);
  const [draft, setDraft] = useState<ShippingDraft>(() => draftFrom(profile));
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingDraft, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof ShippingDraft>(field: K, value: ShippingDraft[K]) => {
    setDraft((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setSaved(false);
  };

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: typeof errors = {};
    if (!draft.fullName.trim()) e.fullName = 'Ingresa tu nombre completo';
    if (!/^[0-9+\s()-]{7,}$/.test(draft.phone.trim())) e.phone = 'Ingresa un celular válido';
    if (!draft.department) e.department = 'Selecciona un departamento';
    if (!draft.city) e.city = 'Selecciona tu ciudad o municipio';
    if (!draft.address.trim()) e.address = 'Ingresa tu dirección';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    setSaveError(null);
    const err = await updateProfile({
      full_name: draft.fullName.trim(),
      phone: draft.phone.trim(),
      department: draft.department,
      city: draft.city,
      address: draft.address.trim(),
      address_notes: draft.notes.trim() || null,
      preferred_payment: draft.payment || null,
      data_consent_at: new Date().toISOString(),
      data_policy_version: BUSINESS.policyVersion,
    });
    setSaving(false);
    if (err) {
      setSaveError(err);
      return;
    }
    setSaved(true);
    setEditing(false);
  };

  const fieldClass = (bad?: string) => `input-luxe ${bad ? 'border-rust-500' : ''}`;

  return (
    <section className="mt-8 rounded-2xl border border-ink-100 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-gold-300">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-medium text-ink-900">Mis datos de envío</h2>
            <p className="mt-0.5 text-sm text-ink-500">
              {complete
                ? 'Se usan automáticamente al finalizar tu compra.'
                : 'Guárdalos una vez y en tus próximas compras solo tendrás que confirmar.'}
            </p>
          </div>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(draftFrom(profile));
              setEditing(true);
              setSaved(false);
            }}
            className="shrink-0 rounded-full border border-ink-200 px-4 py-2 text-xs font-medium text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900"
          >
            Editar
          </button>
        )}
      </div>

      {!editing ? (
        <div className="mt-5 grid gap-1 text-sm text-ink-700 sm:pl-[3.25rem]">
          <p className="font-medium text-ink-900">{profile.full_name}</p>
          <p>{profile.address}</p>
          <p>{profile.city}, {profile.department}</p>
          {profile.address_notes && <p className="text-ink-500">{profile.address_notes}</p>}
          <p className="text-ink-500">Celular: {profile.phone}</p>
          {profile.preferred_payment && (
            <p className="text-ink-500">Pago preferido: {paymentLabel(profile.preferred_payment)}</p>
          )}
          {saved && (
            <p role="status" className="mt-2 text-sm font-medium text-sage-600">Datos guardados.</p>
          )}
        </div>
      ) : (
        <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
          <div className="sm:col-span-2">
            <label className="label-luxe" htmlFor="ship-name">Nombre completo</label>
            <input id="ship-name" autoComplete="name" className={fieldClass(errors.fullName)} value={draft.fullName} onChange={(e) => set('fullName', e.target.value)} />
            {errors.fullName && <p className="mt-1 text-xs text-rust-500">{errors.fullName}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label-luxe" htmlFor="ship-phone">Celular</label>
            <input id="ship-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="300 000 0000" className={fieldClass(errors.phone)} value={draft.phone} onChange={(e) => set('phone', e.target.value)} />
            {errors.phone && <p className="mt-1 text-xs text-rust-500">{errors.phone}</p>}
          </div>
          <div>
            <label className="label-luxe" htmlFor="ship-dep">Departamento</label>
            <select
              id="ship-dep"
              className={fieldClass(errors.department)}
              value={draft.department}
              onChange={(e) => {
                const dep = e.target.value;
                const options = MUNICIPIOS[dep] ?? [];
                setDraft((d) => ({ ...d, department: dep, city: options.length === 1 ? options[0] : '' }));
                setErrors((er) => ({ ...er, department: undefined, city: undefined }));
                setSaved(false);
              }}
            >
              <option value="">Selecciona…</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="mt-1 text-xs text-rust-500">{errors.department}</p>}
          </div>
          <div>
            <label className="label-luxe" htmlFor="ship-city">Ciudad o municipio</label>
            <select
              id="ship-city"
              className={`${fieldClass(errors.city)} disabled:cursor-not-allowed disabled:opacity-60`}
              value={draft.city}
              disabled={!draft.department}
              onChange={(e) => set('city', e.target.value)}
            >
              <option value="">{draft.department ? 'Selecciona…' : 'Primero elige el departamento'}</option>
              {(MUNICIPIOS[draft.department] ?? []).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            {errors.city && <p className="mt-1 text-xs text-rust-500">{errors.city}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label-luxe" htmlFor="ship-address">Dirección</label>
            <input id="ship-address" autoComplete="street-address" placeholder="Calle 00 # 00-00, Barrio" className={fieldClass(errors.address)} value={draft.address} onChange={(e) => set('address', e.target.value)} />
            {errors.address && <p className="mt-1 text-xs text-rust-500">{errors.address}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label-luxe" htmlFor="ship-notes">Indicaciones (opcional)</label>
            <input id="ship-notes" placeholder="Torre, apartamento, portería…" className="input-luxe" value={draft.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>
          <fieldset className="sm:col-span-2">
            <legend className="label-luxe">Método de pago preferido (opcional)</legend>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PAYMENTS.map((o) => (
                <label
                  key={o.value}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                    draft.payment === o.value ? 'border-ink-900 bg-ink-900 text-ivory-50' : 'border-ink-200 text-ink-700 hover:border-ink-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="ship-payment"
                    className="sr-only"
                    checked={draft.payment === o.value}
                    onChange={() => set('payment', o.value)}
                  />
                  <o.icon className="h-4 w-4" /> {o.label}
                </label>
              ))}
            </div>
          </fieldset>

          {saveError && (
            <p role="alert" className="rounded-xl bg-rust-400/10 px-4 py-3 text-sm text-rust-500 sm:col-span-2">{saveError}</p>
          )}
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar datos'}
            </button>
            {complete && (
              <button type="button" onClick={() => setEditing(false)} className="btn-ghost">
                Cancelar
              </button>
            )}
          </div>
          <p className="text-xs leading-relaxed text-ink-500 sm:col-span-2">
            Al guardar autorizas a {BUSINESS.brand} a usar estos datos para enviar tus pedidos, según la{' '}
            <Link to={LEGAL_ROUTES.privacy} className="underline underline-offset-2 hover:text-ink-900">
              política de tratamiento de datos
            </Link>
            .
          </p>
        </form>
      )}
    </section>
  );
}
