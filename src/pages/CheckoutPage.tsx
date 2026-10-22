import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, ShoppingBag, CreditCard, Landmark, Banknote, Wallet } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCOP, VERSION_LABELS, getVersionPrice, type CheckoutForm } from '@/types';

const departments = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas',
  'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
  'Bogotá D.C.', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
  'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
  'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
];

const paymentOptions: {
  value: CheckoutForm['paymentMethod'];
  label: string;
  desc: string;
  icon: typeof CreditCard;
}[] = [
  { value: 'tarjeta', label: 'Tarjeta débito o crédito', desc: 'Visa, Mastercard, Amex', icon: CreditCard },
  { value: 'pse', label: 'PSE', desc: 'Débito bancario en línea', icon: Wallet },
  { value: 'transferencia', label: 'Transferencia bancaria', desc: 'Confirmación manual', icon: Landmark },
  { value: 'contraentrega', label: 'Pago contraentrega', desc: 'Pago al recibir', icon: Banknote },
];

function normalizeLocation(value: string): string {
  return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function isShippingIncluded(department: string, city: string): boolean {
  const normalizedDepartment = normalizeLocation(department);
  const normalizedCity = normalizeLocation(city);
  return normalizedDepartment === 'bogota d.c.' || normalizedDepartment === 'bogota dc' || normalizedCity === 'soacha';
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    email: '',
    department: '',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'tarjeta',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingIncluded = isShippingIncluded(form.department, form.city);

  const update = (field: keyof CheckoutForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Ingresa tu nombre completo';
    if (!/^[0-9+\s()-]{7,}$/.test(form.phone.trim())) e.phone = 'Ingresa un teléfono válido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Ingresa un correo válido';
    if (!form.department) e.department = 'Selecciona un departamento';
    if (!form.city.trim()) e.city = 'Ingresa tu ciudad o municipio';
    if (!form.address.trim()) e.address = 'Ingresa tu dirección de entrega';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    // En esta fase no se procesan pagos reales ni se almacena el pedido.
    setSubmitted(true);
    clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="container-luxe flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-500 text-ivory-50">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-serif text-4xl font-medium text-ink-900">¡Pedido recibido!</h1>
        <p className="mt-3 max-w-md text-ink-600">
          Gracias por tu solicitud. Hemos registrado tu pedido en modo demostración.{' '}
          {isShippingIncluded(form.department, form.city)
            ? 'El envío está incluido en el precio indicado.'
            : 'Te confirmaremos el costo de envío antes de finalizar el pedido.'}
        </p>
        <div className="mt-6 rounded-2xl border border-ink-100 bg-ivory-100 p-5 text-left text-sm text-ink-700">
          <p><span className="font-medium text-ink-900">Resumen:</span> {form.fullName} · {form.email}</p>
          <p><span className="font-medium text-ink-900">Entrega:</span> {form.address}, {form.city}, {form.department}</p>
          <p><span className="font-medium text-ink-900">Pago:</span> {paymentOptions.find((o) => o.value === form.paymentMethod)?.label}</p>
        </div>
        <Link to="/catalogo" className="btn-primary mt-8">
          Seguir comprando
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-luxe flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-100">
          <ShoppingBag className="h-8 w-8 text-ink-400" />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-ink-900">Tu carrito está vacío</h1>
        <p className="mt-2 text-ink-500">Añade fragancias antes de finalizar tu compra.</p>
        <Link to="/catalogo" className="btn-primary mt-6">
          Explorar perfumes
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-10 lg:py-14">
      <h1 className="mb-2 font-serif text-3xl font-medium text-ink-900 sm:text-4xl">Finalizar compra</h1>
      <p className="mb-8 text-sm text-ink-500">
        Completa tus datos para preparar tu pedido. El pago se procesará al integrar la pasarela.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Form fields */}
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Datos de contacto</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-luxe" htmlFor="fullName">Nombre completo</label>
                <input
                  id="fullName"
                  className={`input-luxe ${errors.fullName ? 'border-rust-500 focus:border-rust-500 focus:ring-rust-500' : ''}`}
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                />
                {errors.fullName && <p className="mt-1 text-xs text-rust-500">{errors.fullName}</p>}
              </div>
              <div>
                <label className="label-luxe" htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  className={`input-luxe ${errors.phone ? 'border-rust-500' : ''}`}
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="300 000 0000"
                />
                {errors.phone && <p className="mt-1 text-xs text-rust-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="label-luxe" htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  className={`input-luxe ${errors.email ? 'border-rust-500' : ''}`}
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                />
                {errors.email && <p className="mt-1 text-xs text-rust-500">{errors.email}</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Dirección de entrega</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-luxe" htmlFor="department">Departamento</label>
                <select
                  id="department"
                  className={`input-luxe ${errors.department ? 'border-rust-500' : ''}`}
                  value={form.department}
                  onChange={(e) => update('department', e.target.value)}
                >
                  <option value="">Selecciona…</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-xs text-rust-500">{errors.department}</p>}
              </div>
              <div>
                <label className="label-luxe" htmlFor="city">Ciudad o municipio</label>
                <input
                  id="city"
                  className={`input-luxe ${errors.city ? 'border-rust-500' : ''}`}
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                />
                {errors.city && <p className="mt-1 text-xs text-rust-500">{errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-luxe" htmlFor="address">Dirección de entrega</label>
                <input
                  id="address"
                  className={`input-luxe ${errors.address ? 'border-rust-500' : ''}`}
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="Calle 00 # 00-00, Barrio"
                />
                {errors.address && <p className="mt-1 text-xs text-rust-500">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-luxe" htmlFor="notes">Información adicional (opcional)</label>
                <textarea
                  id="notes"
                  rows={3}
                  className="input-luxe resize-none"
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Indicaciones para la entrega, edificio, apartamento, etc."
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Método de pago</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                    form.paymentMethod === opt.value
                      ? 'border-ink-900 bg-ink-50'
                      : 'border-ink-200 hover:border-ink-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={form.paymentMethod === opt.value}
                    onChange={() => update('paymentMethod', opt.value)}
                  />
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      form.paymentMethod === opt.value ? 'bg-ink-900 text-gold-300' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    <opt.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{opt.label}</p>
                    <p className="text-xs text-ink-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
              <Lock className="h-3.5 w-3.5" />
              No se almacenarán datos de tarjetas. La pasarela de pagos se integrará posteriormente.
            </p>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-ink-100 bg-ivory-100 p-6">
            <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Tu pedido</h2>
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const price = getVersionPrice(item.product, item.version);
                return (
                  <li key={`${item.product.id}__${item.version}`} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-14 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 justify-between gap-2 text-sm">
                      <div>
                        <p className="font-medium text-ink-900">{item.product.name}</p>
                        <p className="text-xs text-ink-500">
                          {item.product.sizeMl ? `${item.product.sizeMl} ml` : 'Presentación por confirmar'} · {VERSION_LABELS[item.version]} · x{item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">{formatCOP(price * item.quantity)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 space-y-2 border-t border-ink-200 pt-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Envío</span>
                <span className={shippingIncluded ? 'text-sage-600' : 'text-rust-500'}>
                  {shippingIncluded ? 'Incluido' : 'Costo por confirmar'}
                </span>
              </div>
              <div className="flex justify-between border-t border-ink-200 pt-2 font-serif text-lg font-semibold text-ink-900">
                <span>Total</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              {!shippingIncluded && (
                <p className="text-xs text-rust-500">Total final pendiente de confirmar envío.</p>
              )}
            </div>

            <button type="submit" className="btn-primary mt-5 w-full">
              {shippingIncluded ? 'Confirmar pedido' : 'Solicitar confirmación de envío'}
            </button>
            <Link to="/catalogo" className="btn-ghost mt-2 w-full">
              Seguir comprando
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
