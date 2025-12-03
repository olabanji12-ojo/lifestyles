// api/verifyPaystack.js
import { getAdmin } from './_firebaseAdmin.js';

export const config = {
  runtime: 'nodejs',
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return json(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('❌ Missing PAYSTACK_SECRET_KEY in Vercel environment');
    return json(res, 500, { error: 'Server configuration error' });
  }

  try {
    const { reference, uid } = req.body || {};

    if (!reference) {
      return json(res, 400, { error: 'Missing payment reference' });
    }

    console.log('🔍 Verifying payment:', reference);

    // CRITICAL: Verify payment with Paystack API using SECRET KEY
    // Never trust client-side success callback
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }
    );

    if (!paystackRes.ok) {
      console.error('❌ Paystack API error:', paystackRes.status);
      return json(res, 400, {
        verified: false,
        error: 'Payment verification failed'
      });
    }

    const paystackData = await paystackRes.json();

    // Check if Paystack confirms the payment was successful
    if (!paystackData.status || paystackData.data.status !== 'success') {
      console.error('❌ Payment not successful:', paystackData.data.status);
      return json(res, 400, {
        verified: false,
        error: 'Payment not successful',
        paystackStatus: paystackData.data.status
      });
    }

    const { db } = getAdmin();

    // Find the order by payment reference
    const ordersSnapshot = await db.collection('orders')
      .where('paymentRef', '==', reference)
      .limit(1)
      .get();

    if (ordersSnapshot.empty) {
      console.error('❌ Order not found for reference:', reference);
      return json(res, 404, {
        verified: false,
        error: 'Order not found'
      });
    }

    const orderDoc = ordersSnapshot.docs[0];
    const orderData = orderDoc.data();

    // SECURITY: Verify the amount matches
    const paystackAmountKobo = paystackData.data.amount; // Amount in kobo
    const orderAmountKobo = Math.round(orderData.total * 100); // Convert Naira to kobo

    if (paystackAmountKobo !== orderAmountKobo) {
      console.error('❌ Amount mismatch!', {
        paystack: paystackAmountKobo,
        order: orderAmountKobo
      });
      return json(res, 400, {
        verified: false,
        error: 'Payment amount mismatch'
      });
    }

    // SECURITY: Verify customer (if logged in)
    if (uid && orderData.customerId && orderData.customerId !== uid) {
      console.error('❌ Customer ID mismatch');
      return json(res, 403, {
        verified: false,
        error: 'Unauthorized'
      });
    }

    // Check if order was already processed (idempotency)
    if (orderData.status === 'Packed' || orderData.paymentStatus === 'paid') {
      console.log('⚠️ Order already processed:', orderDoc.id);
      return json(res, 200, {
        verified: true,
        orderId: orderDoc.id,
        alreadyProcessed: true,
        paystackStatus: 'success'
      });
    }

    // Update order status to Packed (paid and ready for fulfillment)
    await orderDoc.ref.update({
      status: 'Packed',
      paymentStatus: 'paid',
      paidAt: new Date(),
      payment: paystackData.data,
      updatedAt: new Date(),
    });

    console.log('✅ Payment verified and order updated:', orderDoc.id);

    return json(res, 200, {
      verified: true,
      orderId: orderDoc.id,
      paystackStatus: 'success',
      amount: orderData.total
    });

  } catch (error) {
    console.error('❌ Verification error:', error);
    return json(res, 500, {
      verified: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}