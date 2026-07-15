import midtransClient from 'midtrans-client';
import crypto from 'crypto';

const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const snap = new midtransClient.Snap({
  isProduction: IS_PRODUCTION,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export async function createSnapTransaction(params: {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  origin?: string;
}): Promise<{ token: string; redirect_url: string }> {
  const payload: any = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
  };

  if (params.origin) {
    payload.callbacks = {
      finish: `${params.origin}/beli/status/${params.orderId}`,
      unfinish: `${params.origin}/beli/status/${params.orderId}`,
      error: `${params.origin}/beli/status/${params.orderId}`,
    };
  }

  const result = await snap.createTransaction(payload);

  return { token: result.token, redirect_url: result.redirect_url };
}

/**
 * Verifikasi keaslian notifikasi webhook Midtrans.
 * Formula resmi: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyNotificationSignature(notif: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const expected = crypto
    .createHash('sha512')
    .update(notif.order_id + notif.status_code + notif.gross_amount + serverKey)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'hex');
  const providedBuf = Buffer.from(notif.signature_key || '', 'hex');

  if (expectedBuf.length !== providedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}
