import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { fetchPaymentStatus } from '../../shared/mercadopago.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { paymentId, orderId } = body;

    let pId = paymentId;
    if (!pId && orderId) {
      const order = await base44.entities.Order.get(orderId);
      if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });
      pId = order.payment_id;
    }

    if (!pId) return Response.json({ error: 'Payment ID required' }, { status: 400 });

    const payment = await fetchPaymentStatus(pId);
    const qrCode = payment.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = payment.point_of_interaction?.transaction_data?.qr_code_base64;

    return Response.json({
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
      payment_id: String(payment.id),
      status: payment.status,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}