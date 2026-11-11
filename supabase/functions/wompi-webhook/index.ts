// Recibe los eventos de Wompi (transaction.updated).
// Verifica la firma, actualiza el pedido y, si el pago fue APROBADO, envía la orden a Telegram.
// Desplegar SIN verificación de JWT: Wompi no envía token de Supabase (ver SUPABASE_SETUP.md).
import { adminClient, env, json, notifyTelegram, sha256Hex, type OrderRow } from '../_shared/utils.ts';

interface WompiEvent {
  event: string;
  data: { transaction: Record<string, unknown> };
  signature: { properties: string[]; checksum: string };
  timestamp: number;
}

// Lee una ruta tipo "transaction.amount_in_cents" dentro de event.data
function readPath(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => (acc as Record<string, unknown> | undefined)?.[key], data);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  let event: WompiEvent;
  try {
    event = await req.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  // Firma: SHA256(valores de signature.properties concatenados + timestamp + secreto de eventos)
  const values = (event.signature?.properties ?? []).map((p) => String(readPath(event.data, p) ?? '')).join('');
  const expected = await sha256Hex(`${values}${event.timestamp}${env('WOMPI_EVENTS_SECRET')}`);
  if (!event.signature?.checksum || expected.toLowerCase() !== event.signature.checksum.toLowerCase()) {
    console.warn('Firma de Wompi inválida');
    return json({ error: 'Firma inválida' }, 401);
  }

  if (event.event !== 'transaction.updated') return json({ ok: true, ignored: event.event });

  const tx = event.data.transaction as {
    id: string;
    reference: string;
    status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';
    amount_in_cents: number;
    payment_method_type?: string;
  };

  const db = adminClient();
  const { data: order, error } = await db.from('orders').select('*').eq('reference', tx.reference).maybeSingle<OrderRow>();
  if (error) {
    console.error(error);
    return json({ error: 'Error de base de datos' }, 500); // Wompi reintenta
  }
  if (!order) return json({ ok: true, unknownReference: tx.reference });

  if (tx.status === 'APPROVED') {
    if (tx.amount_in_cents !== order.total * 100) {
      console.error('Monto de Wompi no coincide con el pedido', tx.reference, tx.amount_in_cents, order.total);
      return json({ ok: true, amountMismatch: true });
    }
    const { data: updated } = await db
      .from('orders')
      .update({
        status: order.status === 'pendiente_pago' || order.status === 'pago_rechazado' ? 'pagado' : order.status,
        wompi_transaction_id: tx.id,
        wompi_payment_type: tx.payment_method_type ?? null,
      })
      .eq('id', order.id)
      .select('*')
      .single<OrderRow>();

    // Idempotente: Wompi puede enviar el mismo evento más de una vez.
    if (updated && !updated.telegram_notified_at) {
      if (await notifyTelegram(updated, '✅ PAGO APROBADO — nuevo pedido para despachar')) {
        await db.from('orders').update({ telegram_notified_at: new Date().toISOString() }).eq('id', order.id);
      }
    }
  } else if (['DECLINED', 'VOIDED', 'ERROR'].includes(tx.status) && order.status === 'pendiente_pago') {
    await db
      .from('orders')
      .update({ status: 'pago_rechazado', wompi_transaction_id: tx.id, wompi_payment_type: tx.payment_method_type ?? null })
      .eq('id', order.id);
  }

  return json({ ok: true });
});
