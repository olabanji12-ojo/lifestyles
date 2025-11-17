// api/verifyPaystack.js
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

  if (!PAYSTACK_SECRET_KEY) {
    return json(res, 500, { error: 'Missing PAYSTACK_SECRET_KEY' });
  }

  try {
    const { reference, uid } = req.body || {};

    if (!reference || !uid) {
      return json(res, 400, { error: 'Missing reference or uid' });
    }

    console.log('🔍 Verifying payment:', reference);

    // Step 1: Verify payment with Paystack API
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.status) {
      console.error('❌ Paystack verification failed:', verifyData);
      return json(res, 400, {
        verified: false,
        message: 'Payment verification failed',
        details: verifyData,
      });
    }

    const paymentStatus = verifyData.data.status;

    if (paymentStatus !== 'success') {
      console.error('❌ Payment not successful:', paymentStatus);
      return json(res, 400, {
        verified: false,
        message: `Payment status: ${paymentStatus}`,
      });
    }

    console.log('✅ Payment verified successfully');

    const { db } = getAdmin();

    // Step 2: Update order status to "Paid"
    const ordersSnapshot = await db.collection('orders')
      .where('paymentRef', '==', reference)
      .limit(1)
      .get();

    if (ordersSnapshot.empty) {
      console.error('❌ Order not found for reference:', reference);
      return json(res, 404, { verified: false, message: 'Order not found' });
    }

    const orderDoc = ordersSnapshot.docs[0];
    const orderData = orderDoc.data();

    // Step 3: Update order
    await orderDoc.ref.update({
      status: 'Packed', // Move to next stage after payment
      paymentStatus: 'paid',
      paidAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Order updated to Packed');

    // Step 4: Reduce product stock
    const batch = db.batch();

    for (const item of orderData.items) {
      const productRef = db.collection('products').doc(item.productId);
      const productSnap = await productRef.get();

      if (productSnap.exists) {
        const productData = productSnap.data();

        // Handle variants
        if (item.variant && productData.hasVariants && productData.variants) {
          const updatedVariants = productData.variants.map(v => {
            if (v.size === item.variant.size) {
              return { ...v, stock: Math.max(v.stock - item.quantity, 0) };
            }
            return v;
          });
          batch.update(productRef, { variants: updatedVariants });
        } else {
          // Regular product (no variants)
          const newStock = Math.max((productData.stock || 0) - item.quantity, 0);
          batch.update(productRef, { stock: newStock });
        }
      }
    }

    await batch.commit();
    console.log('✅ Product stock updated');

    // Step 5: Clear user's cart
    const cartRef = db.collection('carts').doc(uid);
    await cartRef.delete();
    console.log('✅ Cart cleared');

    return json(res, 200, {
      verified: true,
      message: 'Payment verified successfully',
      orderId: orderDoc.id,
      reference,
    });

  } catch (error) {
    console.error('❌ Verification error:', error);
    return json(res, 500, {
      verified: false,
      error: 'Server error',
      details: error.message,
    });
  }
}