import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { getAccessToken } from '../../shared/mercadopago.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { planId, cycle, amount, planName } = body;

    if (!planId || !amount || amount <= 0) {
      return Response.json({ error: 'Invalid plan or amount' }, { status: 400 });
    }

    const token = getAccessToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const idempotencyKey = crypto.randomUUID();

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        transaction_amount: Number(amount),
        description: `Plano ${planName} - ${cycle}`,
        payment_method_id: 'pix',
        payer: { email: user.email },
        date_of_expiration: expiresAt,
        notification_url: 'https://zyntrabrazil.base44.app/functions/mercadopagoWebhook',
      }),
    });

    if (!mpResponse.ok) {
      const errText = await mpResponse.text();
      return Response.json({ error: 'MP API error', details: errText }, { status: 502 });
    }

    const payment = await mpResponse.json();
    const qrCode = payment.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = payment.point_of_interaction?.transaction_data?.qr_code_base64;
    const paymentId = String(payment.id);

    const order = await base44.entities.Order.create({
      user_email: user.email,
      user_name: user.full_name,
      plan: planId,
      amount: Number(amount),
      cycle: cycle,
      status: 'pending',
      payment_id: paymentId,
    });

    return Response.json({
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
      payment_id: paymentId,
      order_id: order.id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}