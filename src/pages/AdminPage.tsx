import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Loader2, Mail, Package, RefreshCw, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, functionErrorMessage } from '@/lib/supabase';
import {
  PAYMENT_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
  type Order,
  type OrderStatus,
} from '@/lib/orders';
import { formatCOP, VERSION_LABELS } from '@/types';

type Tab = 'pedidos' | 'admins' | 'clientes';

export default function AdminPage() {
  const { ready, session, isAdmin, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('pedidos');

  if (!ready || (session && !profile)) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-luxe flex flex-col items-center py-24 text-center">
        <ShieldCheck className="h-10 w-10 text-ink-300" />
        <h1 className="mt-4 font-serif text-3xl text-ink-900">Acceso restringido</h1>
        <p className="mt-2 text-sm text-ink-500">Esta sección es solo para administradores de ESSENCE.</p>
        <Link to="/cuenta" className="btn-primary mt-6">
          {session ? 'Volver a mi cuenta' : 'Iniciar sesión'}
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: 'pedidos', label: 'Pedidos', icon: Package },
    { key: 'admins', label: 'Administradores', icon: ShieldCheck },
    { key: 'clientes', label: 'Clientes', icon: Users },
  ];

  return (
    <div className="container-luxe py-10 lg:py-14">
      <p className="section-eyebrow">Panel de administrador</p>
      <h1 className="font-serif text-3xl font-medium text-ink-900 sm:text-4xl">ESSENCE · Gestión</h1>

      <div role="tablist" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto border-b border-ink-100">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.key ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900'
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'pedidos' && <OrdersTab />}
        {tab === 'admins' && <AdminsTab />}
        {tab === 'clientes' && <CustomersTab />}
      </div>
    </div>
  );
}

// ─────────────────────────────── Pedidos ───────────────────────────────

const STATUS_FLOW: OrderStatus[] = ['pendiente_pago', 'pagado', 'enviado', 'entregado', 'pago_rechazado', 'cancelado'];

function OrdersTab() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos');
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setError(null);
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (err) setError('No pudimos cargar los pedidos.');
    setOrders((data as Order[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c: Partial<Record<OrderStatus, number>> = {};
    orders?.forEach((o) => (c[o.status] = (c[o.status] ?? 0) + 1));
    return c;
  }, [orders]);

  const visible = useMemo(
    () => (orders ?? []).filter((o) => filter === 'todos' || o.status === filter),
    [orders, filter]
  );

  const changeStatus = async (order: Order, status: OrderStatus) => {
    if (!supabase || status === order.status) return;
    setSavingId(order.id);
    const { error: err } = await supabase.from('orders').update({ status }).eq('id', order.id);
    setSavingId(null);
    if (err) {
      setError('No se pudo actualizar el estado.');
      return;
    }
    setOrders((list) => list?.map((o) => (o.id === order.id ? { ...o, status } : o)) ?? null);
  };

  if (orders === null) return <Loader2 className="h-5 w-5 animate-spin text-ink-400" />;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(['todos', ...STATUS_FLOW] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === s ? 'bg-ink-900 text-ivory-50' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
            }`}
          >
            {s === 'todos' ? `Todos (${orders.length})` : `${STATUS_LABELS[s]} (${counts[s] ?? 0})`}
          </button>
        ))}
        <button onClick={load} className="btn-ghost ml-auto" aria-label="Actualizar pedidos">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-rust-500">{error}</p>}

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-ink-200 py-16 text-center text-sm text-ink-500">
          No hay pedidos {filter !== 'todos' && `con estado “${STATUS_LABELS[filter]}”`}.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((o) => {
            const open = openId === o.id;
            return (
              <li key={o.id} className="rounded-2xl border border-ink-100 bg-white">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
                  <button onClick={() => setOpenId(open ? null : o.id)} className="min-w-0 flex-1 text-left">
                    <span className="font-mono text-sm text-ink-900">{o.reference}</span>
                    <span className="mt-0.5 block truncate text-sm text-ink-600">
                      {o.full_name} · {o.city}
                    </span>
                    <span className="block text-xs text-ink-500">
                      {new Date(o.created_at).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
                      {PAYMENT_LABELS[o.payment_method]}
                      {o.wompi_payment_type ? ` (${o.wompi_payment_type})` : ''}
                    </span>
                  </button>
                  <span className="price">{formatCOP(o.total)}</span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                    <select
                      aria-label={`Cambiar estado de ${o.reference}`}
                      value={o.status}
                      disabled={savingId === o.id}
                      onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                      className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700 focus:border-ink-900 focus:outline-none"
                    >
                      {STATUS_FLOW.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {open && (
                  <div className="grid gap-6 border-t border-ink-100 p-5 text-sm sm:grid-cols-2">
                    <div>
                      <p className="label-luxe">Productos</p>
                      <ul className="space-y-1 text-ink-700">
                        {o.items.map((i, idx) => (
                          <li key={idx} className="flex justify-between gap-3">
                            <span>
                              {i.brand} {i.name} · {VERSION_LABELS[i.version]} x{i.quantity}
                            </span>
                            <span className="tabular-nums">{formatCOP(i.unit_price * i.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="label-luxe">Entrega</p>
                      <p className="text-ink-700">{o.address}</p>
                      <p className="text-ink-700">
                        {o.city}, {o.department}
                      </p>
                      <p className="mt-2 text-ink-700">
                        <a href={`tel:${o.phone}`} className="underline-offset-2 hover:underline">{o.phone}</a> ·{' '}
                        <a href={`mailto:${o.email}`} className="underline-offset-2 hover:underline">{o.email}</a>
                      </p>
                      {o.notes && <p className="mt-2 text-ink-500">Nota: {o.notes}</p>}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────── Administradores ───────────────────────────────

interface AdminRow {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

function AdminsTab() {
  const { session } = useAuth();
  const [admins, setAdmins] = useState<AdminRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });

  const call = useCallback(async (body: Record<string, unknown>) => {
    if (!supabase) return { error: 'Supabase no configurado' };
    const { data, error: err } = await supabase.functions.invoke('admin-users', { body });
    if (err) return { error: await functionErrorMessage(err) };
    return { data };
  }, []);

  const load = useCallback(async () => {
    const res = await call({ action: 'list' });
    if (res.error) setError(res.error);
    setAdmins((res.data?.admins as AdminRow[]) ?? []);
  }, [call]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const res = await call({ action: 'create', ...form });
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setNotice(
      res.data?.promoted
        ? `${form.email} ya tenía cuenta: ahora es administrador.`
        : `Administrador creado. Ya puede ingresar con ${form.email} y la contraseña indicada.`
    );
    setForm({ email: '', password: '', fullName: '' });
    load();
  };

  const revoke = async (admin: AdminRow) => {
    if (!window.confirm(`¿Quitar el acceso de administrador a ${admin.email}? Su cuenta seguirá existiendo como cliente.`)) return;
    setError(null);
    const res = await call({ action: 'revoke', userId: admin.id });
    if (res.error) setError(res.error);
    else load();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Administradores actuales</h2>
        {admins === null ? (
          <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
        ) : (
          <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
            {admins.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">
                    {a.full_name || a.email}
                    {a.id === session?.user.id && <span className="ml-2 text-xs font-normal text-ink-500">(tú)</span>}
                  </p>
                  <p className="truncate text-xs text-ink-500">{a.email}</p>
                </div>
                {a.id !== session?.user.id && (
                  <button
                    onClick={() => revoke(a)}
                    aria-label={`Quitar acceso a ${a.email}`}
                    className="rounded-full p-2 text-ink-400 transition-colors hover:bg-rust-400/10 hover:text-rust-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={create} className="h-fit space-y-4 rounded-2xl border border-ink-100 bg-ivory-100 p-6">
        <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-ink-900">
          <UserPlus className="h-5 w-5" /> Agregar administrador
        </h2>
        <p className="text-xs leading-relaxed text-ink-500">
          Podrá entrar desde el icono de usuario → “Acceso administradores”. Si el correo ya tiene cuenta (por ejemplo, con
          Google), solo se le da el acceso.
        </p>
        <div>
          <label className="label-luxe" htmlFor="new-admin-name">Nombre (opcional)</label>
          <input
            id="new-admin-name"
            className="input-luxe"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          />
        </div>
        <div>
          <label className="label-luxe" htmlFor="new-admin-email">Correo</label>
          <input
            id="new-admin-email"
            type="email"
            required
            className="input-luxe"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="label-luxe" htmlFor="new-admin-password">Contraseña (mín. 8 caracteres)</label>
          <input
            id="new-admin-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            className="input-luxe"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>
        {error && <p role="alert" className="text-sm text-rust-500">{error}</p>}
        {notice && <p className="text-sm text-sage-600">{notice}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Agregar administrador'}
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────── Clientes (ofertas) ───────────────────────────────

interface Contact {
  email: string;
  full_name: string | null;
  source: 'cuenta' | 'pedido';
  consented_at: string | null;
}

function CustomersTab() {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('marketing_contacts')
      .select('*')
      .then(({ data, error: err }) => {
        if (err) setError('No pudimos cargar los contactos.');
        setContacts((data as Contact[]) ?? []);
      });
  }, []);

  const exportCsv = () => {
    if (!contacts) return;
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ['correo', 'nombre', 'origen', 'fecha_consentimiento'],
      ...contacts.map((c) => [c.email, c.full_name ?? '', c.source, c.consented_at ?? '']),
    ];
    const blob = new Blob(['﻿' + rows.map((r) => r.map(esc).join(',')).join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `essence-contactos-ofertas-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (contacts === null) return <Loader2 className="h-5 w-5 animate-spin text-ink-400" />;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-medium text-ink-900">Contactos para ofertas</h2>
          <p className="mt-1 max-w-xl text-sm text-ink-500">
            Solo aparecen personas que aceptaron recibir ofertas (en su cuenta o al comprar). Exporta la lista para tu
            herramienta de correo e incluye siempre un enlace para darse de baja.
          </p>
        </div>
        <button onClick={exportCsv} disabled={contacts.length === 0} className="btn-outline">
          <Download className="h-4 w-4" /> Exportar CSV ({contacts.length})
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-rust-500">{error}</p>}

      {contacts.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-ink-200 py-16 text-center">
          <Mail className="h-8 w-8 text-ink-300" />
          <p className="mt-3 text-sm text-ink-500">Aún no hay contactos que hayan aceptado recibir ofertas.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-ink-100 text-xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-5 py-3 font-medium">Correo</th>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Origen</th>
                <th className="px-5 py-3 font-medium">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {contacts.map((c) => (
                <tr key={c.email}>
                  <td className="px-5 py-3 text-ink-900">{c.email}</td>
                  <td className="px-5 py-3 text-ink-600">{c.full_name ?? '—'}</td>
                  <td className="px-5 py-3 text-ink-600">{c.source === 'cuenta' ? 'Cuenta' : 'Compra'}</td>
                  <td className="px-5 py-3 text-ink-500">
                    {c.consented_at ? new Date(c.consented_at).toLocaleDateString('es-CO') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
