// api/initializePaystack.js
import crypto from 'node:crypto';
import { getAdmin } from './_firebaseAdmin.js';

export const config = {
  runtime: "nodejs",
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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return json(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

  if (!PAYSTACK_SECRET_KEY) {
    console.error('❌ Missing PAYSTACK_SECRET_KEY');
    return json(res, 500, { error: 'Missing PAYSTACK_SECRET_KEY' });
  }

  try {
    const { uid, email, shippingAddress, customerInfo } = req.body || {};

    if (!uid || !email) {
      return json(res, 400, { error: 'Missing uid or email' });
    }

    console.log('📦 Initializing payment for user:', uid);

    const { db } = getAdmin();

    // Step 1: Load cart from Firestore
    const cartDoc = await db.collection('carts').doc(uid).get();
    
    if (!cartDoc.exists) {
      return json(res, 400, { error: 'Cart is empty or not found' });
    }

    const cartData = cartDoc.data();
    const items = cartData.items || [];

    if (!items.length) {
      return json(res, 400, { error: 'Cart is empty' });
    }

    // Step 2: Calculate total amount
    const amountNaira = items.reduce((sum, item) => {
      const itemPrice = item.variant ? item.variant.price : item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);

    const amountKobo = Math.round(amountNaira * 100); // Convert to kobo

    console.log('💰 Total amount:', amountNaira, 'NGN (', amountKobo, 'kobo)');

    // Step 3: Create order reference
    const reference = `inspire_${uid.slice(0, 8)}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Step 4: Create pending order in Firestore
    const orderRef = db.collection('orders').doc();
    const orderId = orderRef.id;

    const orderData = {
      orderId: reference,
      customerId: uid,
      customerName: customerInfo?.fullName || '',
      customerEmail: email,
      customerPhone: customerInfo?.phone || '',
      items: items.map(({ productId, name, price, quantity, variant, image }) => ({
        productId,
        productName: name,
        quantity,
        price: variant ? variant.price : price,
        variant: variant ? { size: variant.size, price: variant.price } : null,
      })),
      total: amountNaira,
      status: 'Pending',
      shippingAddress: shippingAddress || '',
      paymentRef: reference,
      createdAt: new Date(),
    };

    await orderRef.set(orderData);
    console.log('✅ Order created:', orderId);

    // Step 5: Initialize Paystack transaction
    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: 'NGN',
        reference,
        callback_url: `${FRONTEND_BASE_URL}/order-confirmation?ref=${reference}&oid=${orderId}`,
        metadata: { 
          orderId, 
          uid,
          cancel_action: `${FRONTEND_BASE_URL}/payment-failed`
        },
      }),
    });

    const initJson = await initRes.json();

    if (!initRes.ok || !initJson.status) {
      console.error('❌ Paystack init failed:', initJson);
      await orderRef.update({ status: 'Failed', failureReason: initJson?.message || 'init failed' });
      return json(res, 502, { error: 'Paystack initialization failed', details: initJson });
    }

    console.log('✅ Paystack initialized:', reference);

    // Return authorization URL to frontend
    return json(res, 200, { 
      authorization_url: initJson.data.authorization_url, 
      reference, 
      orderId 
    });

  } catch (error) {
    console.error('❌ Initialize error:', error);
    return json(res, 500, { error: 'Server error', details: error.message });
  }
}