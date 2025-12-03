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

  try {
    const { uid, email, shippingAddress, customerInfo } = req.body || {};

    // GUEST CHECKOUT CHANGE 1: Allow null uid, but email is MANDATORY for both
    if (!email) {
      return json(res, 400, { error: 'Missing email' });
    }
    
    // Determine the cart and order identifier
    // For logged-in users, use uid. For guests, use email.
    const customerId = uid || email; 

    console.log('📦 Preparing order for customer:', customerId);

    const { db } = getAdmin();

    // Step 1: Cancel any pending orders for this user/email
    console.log('🔍 Checking for existing pending orders...');
    
    // GUEST CHECKOUT CHANGE 2: Check by customerId for logged-in, or customerEmail for guests/both
    const existingOrders = await db.collection('orders')
      .where(uid ? 'customerId' : 'customerEmail', '==', customerId)
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

    // Step 2: Load cart from Firestore
    // GUEST CHECKOUT CHANGE 3: Use customerId (uid or email) to find the cart
    const cartDoc = await db.collection('carts').doc(customerId).get();
    
    if (!cartDoc.exists) {
      return json(res, 400, { error: 'Cart is empty or not found' });
    }

    const cartData = cartDoc.data();
    const items = cartData.items || [];

    if (!items.length) {
      return json(res, 400, { error: 'Cart is empty' });
    }

    // Step 3: Calculate total amount
    const amountNaira = items.reduce((sum, item) => {
      const itemPrice = item.variant ? item.variant.price : item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);

    const amountKobo = Math.round(amountNaira * 100);

    console.log('💰 Total amount:', amountNaira, 'NGN (', amountKobo, 'kobo)');

    // Step 4: Generate UNIQUE reference
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(8).toString('hex');
    const randomAlpha = Math.random().toString(36).substring(2, 9);
    
    // GUEST CHECKOUT CHANGE 4: Adjust reference to handle null uid gracefully
    const refIdentifier = uid ? uid.slice(0, 8) : 'GUEST'; 
    const reference = `inspire_${refIdentifier}_${timestamp}_${randomHex}_${randomAlpha}`;

    console.log('🆔 Generated unique reference:', reference);

    // Step 5: Create pending order in Firestore
    const orderRef = db.collection('orders').doc();
    const orderId = orderRef.id;

    const orderData = {
      orderId: reference,
      // GUEST CHECKOUT CHANGE 5: customerId is null for guests, customerEmail is always set
      customerId: uid || null, 
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
    console.log('✅ Order created in Firestore:', orderId);

    return json(res, 200, { 
      reference, 
      orderId,
      amount: amountKobo,
      email,
    });

  } catch (error) {
    console.error('❌ Initialize error:', error);
    return json(res, 500, { error: 'Server error', details: error.message });
  }
}