// src/pages/PaymentFailed.tsx
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';

export default function PaymentFailed() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const reason = location.state?.reason || searchParams.get('reason') || 'Payment was unsuccessful';
  const reference = location.state?.reference || searchParams.get('ref');
  const details = location.state?.details;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Error Icon */}
        <div className="text-center mb-8" data-aos="zoom-in">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl text-gray-900 font-light mb-4">
            Payment Failed
          </h1>
          <p className="text-xl text-gray-600">
            Unfortunately, we couldn't process your payment
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-6" data-aos="fade-up">
          <h2 className="text-xl text-gray-900 font-semibold mb-4">What happened?</h2>
          <p className="text-gray-700 mb-4">{reason}</p>
          
          {reference && (
            <p className="text-sm text-gray-500 mb-4">
              Reference: <span className="font-mono">{reference}</span>
            </p>
          )}

          {details && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-sm text-red-700">{details}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-gray-900 font-semibold mb-3">Common reasons for payment failure:</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Incorrect card details or expired card</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Payment declined by your bank</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Network or connection issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Transaction cancelled by user</span>
              </li>
            </ul>
          </div>
        </div>

        {/* What to do next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6" data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-lg text-gray-900 font-semibold mb-3">💡 What you can do:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Check your card details and try again</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Try a different payment method</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Contact your bank to authorize the transaction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>If the problem persists, contact our support team</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-black py-4 rounded font-bold hover:bg-yellow-500 transition"
          >
            <RefreshCw className="w-5 h-5" />
            TRY AGAIN
          </Link>

          <Link
            to="/cart"
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 py-4 rounded font-bold hover:border-yellow-600 transition"
          >
            BACK TO CART
          </Link>

          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-yellow-600 transition py-3"
          >
            <Home className="w-5 h-5" />
            GO TO HOME
          </Link>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your payment?</p>
          <Link
            to="/contact"
            className="text-yellow-600 hover:underline font-semibold"
          >
            Contact Support →
          </Link>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your payment information is secure and encrypted. No charges were made to your account.
          </p>
        </div>
      </div>
    </div>
  );
}