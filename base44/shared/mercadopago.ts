import { secrets } from "base44:runtime";

const MP_API_BASE = "https://api.mercadopago.com";

export function getAccessToken() {
  return secrets.get("MERCADOPAGO_ACCESS_TOKEN");
}

export async function fetchPaymentStatus(paymentId) {
  const token = getAccessToken();
  const res = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`MP API error: ${res.status}`);
  return await res.json();
}