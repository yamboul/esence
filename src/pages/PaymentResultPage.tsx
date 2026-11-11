import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Clock, Loader2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PENDING_ORDER_KEY } from '@/lib/orders';
import { formatCOP } from '@/types';
import { whatsappLink } from '@/lib/whatsapp';

type TxStatus = 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';

interface Tx {
  status: TxStatus;
  reference: string;
  amount_in_cents: number;
  payment_method_type?: string;
}

const WOMPI_API =
  import.meta.env.VITE_WOMPI_ENV === 'production' ? 'https://production.wompi.co/v1' : 'https://sandbox.wompi.co/v1';

// Wompi redirige aquí con ?id=<transacción>. El estado que se muestra es informativo:
// el pedido se marca como pagado únicamente por el webhook firmado (wompi-webhook).
export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const txId = params.get('id');
  const { clear } = useCart();
  const [tx, setTx] = useState<Tx | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!txId) return;
    let cancelled = false;
    let attempts = 0;

    const load = async () => {
      try {
        const res = await fetch(`${WOMPI_API}/transactions/${encodeURIComponent(txId)}`);
        if (!res.ok) throw new Error(String(res.status));
        const { data } = (await res.json()) as { data: Tx };
        if (cancelled) return;
        setTx(data);
        // PSE y Nequi pueden tardar unos segundos en confirmarse.
        if (data.status === 'PENDING' && attempts++ < 10) setTimeout(load, 3000);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [txId]);

  useEffect(() => {
    if (tx?.status !== 'APPROVED') return;
    clear();
    try {
      sessionStorage.removeItem(PENDING_ORDER_KEY);
    } catch {
      // ignore
    }
    // clear es estable en la práctica; solo debe ejecutarse al aprobarse el pago.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx?.status]);

  if (!txId || failed) {
    return (
      <Result
        icon={<Clock className="h-10 w-10" />}
        tone="bg-gold-400 text-ink-900"
        title="No pudimos verificar tu pago"
        text="Si completaste el pago, recibirás la confirmación en breve. Si tienes dudas, escríbenos por WhatsApp con tu número de pedido."
      />
    );
  }

  if (!tx || tx.status === 'PENDING') {
    return (
      <Result
        icon={tx ? <Clock className="h-10 w-10" /> : <Loader2 className="h-10 w-10 animate-spin" />}
        tone="bg-ink-100 text-ink-600"
        title={tx ? 'Pago en proceso' : 'Verificando tu pago…'}
        text={
          tx
            ? 'Tu banco aún está confirmando el pago. Esta página se actualiza sola; también te avisaremos cuando se apruebe.'
            : 'Un momento, por favor.'
        }
        reference={tx?.reference}
      />
    );
  }

  if (tx.status === 'APPROVED') {
    return (
      <Result
        icon={<Check className="h-10 w-10" />}
        tone="bg-sage-500 text-ivory-50"
        title="¡Pago aprobado!"
        text={`Recibimos tu pago de ${formatCOP(tx.amount_in_cents / 100)}. Ya estamos preparando tu pedido; el envío es gratis a cualquier lugar de Colombia.`}
        reference={tx.reference}
      />
    );
  }

  return (
    <Result
      icon={<X className="h-10 w-10" />}
      tone="bg-rust-500 text-ivory-50"
      title="El pago no se completó"
      text="Tu pago fue rechazado o cancelado. No se hizo ningún cobro. Tus productos siguen en el carrito para que lo intentes de nuevo."
      reference={tx.reference}
      retry
    />
  );
}

function Result({
  icon,
  tone,
  title,
  text,
  reference,
  retry,
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  text: string;
  reference?: string;
  retry?: boolean;
}) {
  return (
    <div className="container-luxe flex flex-col items-center justify-center py-24 text-center">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${tone}`}>{icon}</div>
      <h1 className="mt-6 font-serif text-4xl font-medium text-ink-900">{title}</h1>
      <p className="mt-3 max-w-md text-ink-600">{text}</p>
      {reference && (
        <p className="mt-4 text-sm text-ink-500">
          Pedido <span className="font-mono text-ink-900">{reference}</span>
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {retry ? (
          <Link to="/checkout" className="btn-primary">
            Intentar de nuevo
          </Link>
        ) : (
          <Link to="/catalogo" className="btn-primary">
            Seguir comprando
          </Link>
        )}
        <a
          href={whatsappLink(reference ? `Hola ESSENCE, tengo una duda sobre mi pedido ${reference}.` : undefined)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          ¿Dudas? Escríbenos
        </a>
      </div>
    </div>
  );
}
