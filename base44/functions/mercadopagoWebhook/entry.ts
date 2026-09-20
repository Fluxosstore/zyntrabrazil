import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { fetchPaymentStatus } from '../../shared/mercadopago.ts';

export default async function(req) {
  try {
    const body = await req.json();
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