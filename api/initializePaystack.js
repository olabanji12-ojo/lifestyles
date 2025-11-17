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

    // ✅ STEP 0: Cancel any pending orders for this user
    console.log('🔍 Checking for existing pending orders...');
    const existingOrders = await db.collection('orders')
      .where('customerId', '==', uid)
      .where('status', '==', 'Pending')
      .get();

    if (!existingOrders.empty) {
      console.log(`⚠️ Found ${existingOrders.size} pending orders. Marking as abandoned...`);
      const batch = db.batch();
      existingOrders.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'Abandoned',
          updatedAt: new Date(),
          abandonedReason: 'User started new checkout session',
        });
      });
      await batch.commit();
      console.log('✅ Old pending orders marked as abandoned');
    }

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

    const amountKobo = Math.round(amountNaira * 100);

    console.log('💰 Total amount:', amountNaira, 'NGN (', amountKobo, 'kobo)');

    // ✅ Step 3: Create GUARANTEED UNIQUE reference
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(8).toString('hex'); // 16 chars
    const randomAlpha = Math.random().toString(36).substring(2, 9); // 7 chars
    const reference = `inspire_${uid.slice(0, 8)}_${timestamp}_${randomHex}_${randomAlpha}`;

    console.log('🆔 Generated unique reference:', reference);

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
        image: image || '',
      })),
      total: amountNaira,
      status: 'Pending',
      shippingAddress: shippingAddress || '',
      paymentRef: reference,
      createdAt: new Date(),
      updatedAt: new Date(),
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
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: customerInfo?.fullName || 'N/A'
            },
            {
              display_name: "Phone",
              variable_name: "customer_phone",
              value: customerInfo?.phone || 'N/A'
            }
          ]
        },
      }),
    });

    const initJson = await initRes.json();

    if (!initRes.ok || !initJson.status) {
      console.error('❌ Paystack init failed:', initJson);
      await orderRef.update({ 
        status: 'Failed', 
        failureReason: initJson?.message || 'init failed',
        updatedAt: new Date(),
      });
      return json(res, 502, { error: 'Paystack initialization failed', details: initJson });
    }

    console.log('✅ Paystack initialized with reference:', reference);

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