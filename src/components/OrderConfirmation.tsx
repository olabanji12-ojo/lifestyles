// src/pages/OrderConfirmation.tsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Loader2 } from 'lucide-react';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const reference = searchParams.get('ref') || location.state?.reference;
  const orderId = searchParams.get('oid') || location.state?.orderId;
  const amount = location.state?.amount;

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else {
      setError('No payment reference found');
      setVerifying(false);
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const res = await fetch('/api/verifyPaystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          uid: localStorage.getItem('uid'), // Or get from auth context
        }),
      });

      const data = await res.json();

      if (data.verified) {
        setVerified(true);
      } else {
        setError('Payment verification failed');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-yellow-600 mx-auto mb-6" />
          <h2 className="text-2xl text-gray-900 mb-2">Verifying your payment...</h2>
          <p className="text-gray-500">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-3xl text-gray-900 mb-4">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/cart"
            className="inline-block bg-yellow-600 text-black px-8 py-3 rounded font-bold hover:bg-yellow-500 transition"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-3xl text-gray-900 mb-4">Payment Pending</h2>
          <p className="text-gray-600 mb-6">
            We're still processing your payment. Please check back in a few minutes.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-yellow-600 text-black px-8 py-3 rounded font-bold hover:bg-yellow-500 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Success Animation */}
        <div className="text-center mb-8" data-aos="zoom-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl text-gray-900 font-light mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-gray-600 mb-2">Your order has been confirmed</p>
          <p className="text-gray-500">Order ID: <span className="font-mono text-sm">{orderId || reference}</span></p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-6" data-aos="fade-up">
          <div className="flex items-center gap-4 mb-6">
            <Package className="w-8 h-8 text-yellow-600" />
            <div>
              <h2 className="text-2xl text-gray-900 font-semibold">Order Confirmed</h2>
              <p className="text-gray-500 text-sm">We've received your order and payment</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Reference</span>
              <span className="font-mono text-sm text-gray-900">{reference}</span>
            </div>
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-xl font-bold text-yellow-600">₦{amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-semibold">
                Paid
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6" data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-lg text-gray-900 font-semibold mb-3">📦 What happens next?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">✓</span>
              <span>You'll receive an email confirmation shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">✓</span>
              <span>Your order will be packed within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">✓</span>
              <span>We'll send you tracking details once shipped</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">✓</span>
              <span>Estimated delivery: 3-5 business days</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="200">
          <Link
            to="/shop"
            className="flex-1 text-center bg-yellow-600 text-black py-4 rounded font-bold hover:bg-yellow-500 transition"
          >
            CONTINUE SHOPPING
          </Link>
          <Link
            to="/"
            className="flex-1 text-center bg-white text-gray-800 border border-gray-300 py-4 rounded font-bold hover:border-yellow-600 transition"
          >
            BACK TO HOME
          </Link>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Need help? <Link to="/contact" className="text-yellow-600 hover:underline">Contact our support team</Link></p>
        </div>
      </div>
    </div>
  );
}