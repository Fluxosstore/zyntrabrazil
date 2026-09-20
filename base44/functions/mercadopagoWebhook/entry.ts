import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { fetchPaymentStatus } from '../../shared/mercadopago.ts';

async function verifySignature(req, body): Promise<boolean> {
  const signatureHeader = req.headers.get('x-signature') || '';
  const requestId = req.headers.get('x-request-id') || '';
  if (!signatureHeader || !requestId) return false;

  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(',')) {
    const [key, val] = part.trim().split('=', 2);
    if (key) parts[key] = val || '';
  }
  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  // Replay guard: reject timestamps older than 5 minutes
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(ts, 10)) > 300) return false;

  const dataId = body?.data?.id ?? '';
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET || '';
  if (!secret) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(manifest));
  const expected = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return expected === v1;
}

export default async function(req) {
  try {
    const body = await req.json();

    // Validate webhook signature
    const valid = await verifySignature(req, body);
    if (!valid) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { action, data } = body;
    if (action !== 'payment.updated' || !data?.id) {
      return Response.json({ ok: true, ignored: true });
    }

    const paymentId = String(data.id);
    const payment = await fetchPaymentStatus(paymentId);

    if (payment.status === 'approved') {
      const base44 = createClientFromRequest(req);
      const orders = await base44.asServiceRole.entities.Order.filter({ payment_id: paymentId });
      if (orders.length === 0) {
        return Response.json({ ok: true, message: 'Order not found' });
      }
      const order = orders[0];

      await base44.asServiceRole.entities.Order.update(order.id, { status: 'paid' });

      const userId = order.created_by_id;
      if (userId) {
        await base44.asServiceRole.entities.User.update(userId, {
          plan: order.plan,
          plan_cycle: order.cycle,
          plan_subscribed_at: new Date().toISOString(),
          auto_renew: true,
        });
      }
    }

    return Response.json({ ok: true, status: payment.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}