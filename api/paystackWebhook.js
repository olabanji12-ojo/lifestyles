// api/paystackWebhook.js
import crypto from 'node:crypto';
import { getAdmin } from './_firebaseAdmin.js';

export const config = {
  runtime: 'nodejs',
};

function text(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(body);
}

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return text(res, 405, 'Method not allowed');
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('❌ Missing PAYSTACK_SECRET_KEY');
    return text(res, 500, 'Missing PAYSTACK_SECRET_KEY');
  }

  try {
    // Step 1: Get raw body for HMAC verification
    const raw = await buffer(req);
    const signature = req.headers['x-paystack-signature'];

    if (!signature) {
      console.error('❌ Missing signature');
      return text(res, 401, 'Missing signature');
    }

    // Step 2: Verify signature
    const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');

    if (signature !== expected) {
      console.error('❌ Invalid signature');
      return text(res, 401, 'Invalid signature');
    }

    // Step 3: Parse event
    const event = JSON.parse(raw.toString('utf8'));
    console.log('📨 Webhook event:', event.event);

    const { db } = getAdmin();

    // Step 4: Handle charge.success event
    if (event.event === 'charge.success') {
      const reference = event?.data?.reference;

      if (!reference) {
        console.error('❌ No reference in webhook');
        return text(res, 400, 'No reference');
      }

      // Step 5: Verify payment via Paystack API (defensive check)
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${secret}` },
        }
      );

      const verifyJson = await verifyRes.json();

      if (!verifyRes.ok || !verifyJson.status) {
        console.error('❌ Webhook verification failed');
        return text(res, 400, 'Verification failed');
      }

      const status = verifyJson.data.status;
      const metadata = verifyJson.data.metadata || {};
      const orderId = metadata.orderId;
      const uid = metadata.uid;

      if (!orderId || !uid) {
        console.error('❌ Missing metadata in webhook');
        return text(res, 400, 'Missing metadata');
      }

      // Step 6: Find and update order
      const ordersSnapshot = await db.collection('orders')
        .where('paymentRef', '==', reference)
        .limit(1)
        .get();

      if (ordersSnapshot.empty) {
        console.error('❌ Order not found:', reference);
        return text(res, 404, 'Order not found');
      }

      const orderDoc = ordersSnapshot.docs[0];

      if (status === 'success') {
        await orderDoc.ref.update({
          status: 'Packed',
          paymentStatus: 'paid',
          paidAt: new Date(),
          payment: verifyJson.data,
          updatedAt: new Date(),
        });
        console.log('✅ Webhook: Order updated to Packed');
      } else if (status === 'failed') {
        await orderDoc.ref.update({
          status: 'Cancelled',
          paymentStatus: 'failed',
          payment: verifyJson.data,
          updatedAt: new Date(),
        });
        console.log('⚠️ Webhook: Order marked as failed');
      }
    }

    return text(res, 200, 'ok');

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return text(res, 500, 'Server error');
  }
}