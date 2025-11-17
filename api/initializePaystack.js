// api/initializePaystack.js

import crypto from 'node:crypto';
import { getAdmin } from './_firebaseAdmin.js';

export const config = { runtime: 'nodejs' };

// Helper to send JSON responses
function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const { PAYSTACK_SECRET_KEY } = process.env;
  const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

  if (!PAYSTACK_SECRET_KEY) {
    console.error('Missing PAYSTACK_SECRET_KEY');
    return json(res, 500, { error: 'Server configuration error' });
  }

  try {
    const { uid, email, shippingAddress, customerInfo } = req.body || {};

    if (!uid || !email) {
      return json(res, 400, { error: 'Missing uid or email' });
    }

    console.log(`Starting checkout for user: ${uid}`);

    const { db } = getAdmin();

    // ──────────────────────────────────────────────────────────────
    // Step 1: Cancel any previous pending orders (prevent spam)
    // ──────────────────────────────────────────────────────────────
    const pendingOrdersSnap = await db
      .collection('orders')
      .where('customerId', '==', uid)
      .where('status', '==', 'Pending')
      .get();

    if (!pendingOrdersSnap.empty) {
      console.log(`Found ${pendingOrdersSnap.size} pending order(s) → marking as Abandoned`);
      const batch = db.batch();
      pendingOrdersSnap.forEach(doc => {
        batch.update(doc.ref, {
          status: 'Abandoned',
          abandonedReason: 'User started new checkout session',
          updatedAt: new Date(),
        });
      });
      await batch.commit();
    }

    // ──────────────────────────────────────────────────────────────
    // Step 2: Load and validate cart
    // ──────────────────────────────────────────────────────────────
    const cartDoc = await db.collection('carts').doc(uid).get();
    if (!cartDoc.exists || !cartDoc.data()?.items?.length) {
      return json(res, 400, { error: 'Cart is empty' });
    }

    const items = cartDoc.data().items;

    // ──────────────────────────────────────────────────────────────
    // Step 3: Calculate total in kobo (Paystack expects amount in kobo)
    // ──────────────────────────────────────────────────────────────
    const totalNaira = items.reduce((sum, item) => {
      const price = item.variant?.price || item.price;
      return sum + price * item.quantity;
    }, 0);

    const amountKobo = Math.round(totalNaira * 100);

    if (amountKobo < 100) { // Paystack minimum is ₦1 (100 kobo)
      return json(res, 400, { error: 'Amount too low' });
    }

    // ──────────────────────────────────────────────────────────────
    // Step 4: Generate a 100% unique Paystack reference
    //     We use Firestore auto-ID → guaranteed unique across entire project
    // ──────────────────────────────────────────────────────────────
    const orderRef = db.collection('orders').doc(); // ← This creates a unique ID immediately
    const paystackReference = `inspire_${orderRef.id}`;

    console.log('Generated unique Paystack reference:', paystackReference);

    // ──────────────────────────────────────────────────────────────
    // Step 5: Create the order document (before calling Paystack)
    // ──────────────────────────────────────────────────────────────
    const orderData = {
      orderId: paystackReference,
      paymentRef: paystackReference,
      customerId: uid,
      customerName: customerInfo?.fullName || '',
      customerEmail: email,
      customerPhone: customerInfo?.phone || '',
      shippingAddress: shippingAddress || '',
      items: items.map(item => ({
        productId: item.productId,
        productName: item.name,
        price: item.variant?.price || item.price,
        quantity: item.quantity,
        variant: item.variant ? { size: item.variant.size, price: item.variant.price } : null,
        image: item.image || '',
      })),
      total: totalNaira,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await orderRef.set(orderData);
    console.log('Order document created with ID:', orderRef.id);

    // ──────────────────────────────────────────────────────────────
    // Step 6: Initialize Paystack transaction
    // ──────────────────────────────────────────────────────────────
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: 'NGN',
        reference: paystackReference,
        callback_url: `${FRONTEND_BASE_URL}/order-confirmation?ref=${paystackReference}&oid=${orderRef.id}`,
        metadata: {
          orderId: orderRef.id,
          uid,
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: customerInfo?.fullName || 'N/A' },
            { display_name: 'Phone', variable_name: 'customer_phone', value: customerInfo?.phone || 'N/A' },
          ],
        },
      }),
    });

    const paystackJson = await paystackResponse.json();

    // ──────────────────────────────────────────────────────────────
    // Step 7: Handle Paystack response
    // ──────────────────────────────────────────────────────────────
    if (!paystackResponse.ok || !paystackJson.status) {
      console.error('Paystack initialization failed:', paystackJson);

      // Mark this order as failed so it doesn't stay Pending forever
      await orderRef.update({
        status: 'Failed',
        failureReason: paystackJson.message || 'Paystack initialization failed',
        updatedAt: new Date(),
      });

      return json(res, 502, { error: 'Payment gateway error', details: paystackJson.message });
    }

    console.log('Paystack initialized successfully');

    // ──────────────────────────────────────────────────────────────
    // Step 8: Success! Return authorization URL to frontend
    // ──────────────────────────────────────────────────────────────
    return json(res, 200, {
      success: true,
      authorization_url: paystackJson.data.authorization_url,
      reference: paystackReference,
      orderId: orderRef.id,
    });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return json(res, 500, { error: 'Internal server error', details: error.message });
  }
}