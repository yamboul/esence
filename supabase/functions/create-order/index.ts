// Crea un pedido. El total se calcula aquí con los precios de la tabla products:
// nunca se confía en el precio que envía el navegador.
// - wompi: devuelve la URL de pago de Wompi; Telegram avisa cuando Wompi confirma (wompi-webhook).
// - transferencia / contraentrega: avisa a Telegram de inmediato como "pago pendiente".
import {
  adminClient,
  corsHeaders,
  env,
  json,
  notifyTelegram,
  requestUser,
  sha256Hex,
  type OrderItem,
  type OrderRow,
} from '../_shared/utils.ts';

interface Body {
  customer: {
    fullName: string;
    phone: string;
    email: string;
    department: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: { id: string; version: 'classic' | 'premium'; quantity: number }[];
  paymentMethod: 'wompi' | 'transferencia' | 'contraentrega';
  marketingOptIn?: boolean;
  dataConsent?: boolean;
  policyVersion?: string;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function makeReference(): string {
  const d = new Date();
  const date = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `ESS-${date}-${rand}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const body = (await req.json()) as Body;
    const c = body.customer ?? ({} as Body['customer']);
    const customer = {
      full_name: str(c.fullName, 120),
      phone: str(c.phone, 30),
      email: str(c.email, 160).toLowerCase(),
      department: str(c.department, 60),
      city: str(c.city, 80),
      address: str(c.address, 200),
      notes: str(c.notes, 500) || null,
    };
    if (
      !customer.full_name ||
      !/^[0-9+\s()-]{7,}$/.test(customer.phone) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
      !customer.department ||
      !customer.city ||
      !customer.address
    ) {
      return json({ error: 'Datos de entrega incompletos o inválidos' }, 400);
    }

    if (body.dataConsent !== true) {
      return json({ error: 'Debes aceptar la política de datos y los términos para continuar' }, 400);
    }

    if (!['wompi', 'transferencia', 'contraentrega'].includes(body.paymentMethod)) {
      return json({ error: 'Método de pago inválido' }, 400);
    }

    const requested = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
    if (requested.length === 0) return json({ error: 'El carrito está vacío' }, 400);

    const db = adminClient();
    const ids = [...new Set(requested.map((i) => String(i.id)))];
    const { data: products, error: productsError } = await db
      .from('products')
      .select('id, name, brand, price_classic, price_premium, in_stock')
      .in('id', ids);
    if (productsError) throw productsError;

    const items: OrderItem[] = [];
    for (const r of requested) {
      const p = products?.find((x) => x.id === r.id);
      const qty = Number(r.quantity);
      if (!p || !p.in_stock) return json({ error: `Producto no disponible: ${r.id}` }, 409);
      if (!Number.isInteger(qty) || qty < 1 || qty > 20) return json({ error: 'Cantidad inválida' }, 400);
      const unit = r.version === 'classic' ? p.price_classic : r.version === 'premium' ? p.price_premium : null;
      if (!unit) return json({ error: `Versión no disponible para ${p.name}` }, 409);
      items.push({ id: p.id, name: p.name, brand: p.brand, version: r.version, quantity: qty, unit_price: unit });
    }
    const total = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);

    const user = await requestUser(req);
    const reference = makeReference();

    const { data: order, error: insertError } = await db
      .from('orders')
      .insert({
        reference,
        user_id: user?.id ?? null,
        ...customer,
        payment_method: body.paymentMethod,
        items,
        total,
        marketing_opt_in: body.marketingOptIn === true,
        // Constancia de la autorización de datos (Ley 1581): cuándo y qué versión de la política.
        data_consent_at: new Date().toISOString(),
        data_policy_version: str(body.policyVersion, 20) || 'desconocida',
      })
      .select('*')
      .single<OrderRow>();
    if (insertError) throw insertError;

    // Si el cliente tiene cuenta y aceptó ofertas, se guarda también en su perfil.
    if (user && body.marketingOptIn === true) {
      await db.from('profiles').update({ marketing_opt_in: true }).eq('id', user.id);
    }

    if (body.paymentMethod !== 'wompi') {
      const headline =
        body.paymentMethod === 'contraentrega'
          ? '🛍️ Nuevo pedido — CONTRAENTREGA (cobrar al entregar)'
          : '🛍️ Nuevo pedido — TRANSFERENCIA (verificar pago)';
      if (await notifyTelegram(order, headline)) {
        await db.from('orders').update({ telegram_notified_at: new Date().toISOString() }).eq('id', order.id);
      }
      return json({ reference, total });
    }

    // Pago en línea: URL del Web Checkout de Wompi con firma de integridad.
    const amountInCents = total * 100;
    const currency = 'COP';
    const signature = await sha256Hex(`${reference}${amountInCents}${currency}${env('WOMPI_INTEGRITY_SECRET')}`);
    const params = new URLSearchParams({
      'public-key': env('WOMPI_PUBLIC_KEY'),
      currency,
      'amount-in-cents': String(amountInCents),
      reference,
      'signature:integrity': signature,
      'redirect-url': `${env('SITE_URL').replace(/\/$/, '')}/pedido/resultado`,
      'customer-data:email': customer.email,
      'customer-data:full-name': customer.full_name,
    });
    return json({ reference, total, checkoutUrl: `https://checkout.wompi.co/p/?${params}` });
  } catch (err) {
    console.error(err);
    return json({ error: 'No pudimos registrar el pedido. Intenta de nuevo.' }, 500);
  }
});
