// src/pages/Checkout.tsx
import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Dynamically import Paystack
let Paystack: any = null;
if (typeof window !== 'undefined') {
  import('@paystack/inline-js').then(module => {
    Paystack = module.default;
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = subtotal > 50000 ? 0 : 2000;
  const tax = Math.round(subtotal * 0.075); // 7.5% VAT
  const orderTotal = subtotal + shipping + tax;

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      toast.error('Please sign in to checkout');
      navigate('/login?redirect=/checkout');
    }
  }, [currentUser, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !loading) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, navigate, loading]);

  // Pre-fill form with user data
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || '',
        firstName: currentUser.displayName?.split(' ')[0] || '',
        lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
      }));
    }
  }, [currentUser]);

  // Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.streetAddress) newErrors.streetAddress = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Handle Paystack Payment
  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();

    if (!Paystack) {
      toast.error('Payment system not loaded. Please refresh and try again.');
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to continue');
      navigate('/login?redirect=/checkout');
      return;
    }

    setProcessingPayment(true);
    setLoading(true);

    try {
      // Step 1: Initialize payment with backend
      const initRes = await fetch('/api/initializePaystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: currentUser.uid,
          email: formData.email,
          shippingAddress: `${formData.streetAddress}, ${formData.city}, ${formData.state}`,
          customerInfo: {
            fullName: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
          },
        }),
      });

      if (!initRes.ok) {
        const errorData = await initRes.json();
        throw new Error(errorData.error || 'Failed to initialize payment');
      }

      const { authorization_url, reference, orderId } = await initRes.json();

      console.log('✅ Payment initialized:', reference);

      // Step 2: Open Paystack popup
      const paystack = new Paystack();
      
      paystack.checkout({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: orderTotal * 100, // Convert to kobo
        currency: 'NGN',
        ref: reference,
        
        onSuccess: async (transaction: any) => {
          console.log('✅ Payment successful:', transaction.reference);
          setCurrentStep(3);

          try {
            // Step 3: Verify payment with backend
            const verifyRes = await fetch('/api/verifyPaystack', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: transaction.reference,
                uid: currentUser.uid,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              console.log('✅ Payment verified');
              
              // Clear cart
              await clearCart();

              // Redirect to success page
              setTimeout(() => {
                navigate('/order-confirmation', {
                  state: {
                    reference: transaction.reference,
                    orderId: verifyData.orderId,
                    amount: orderTotal,
                  },
                });
              }, 1500);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('❌ Verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
            navigate('/payment-failed', {
              state: { reference: transaction.reference },
            });
          }
        },

        onCancel: () => {
          console.log('⚠️ Payment cancelled by user');
          setProcessingPayment(false);
          setLoading(false);
          toast.error('Payment cancelled');
          navigate('/payment-failed', {
            state: { reason: 'Payment cancelled' },
          });
        },

        onError: (error: any) => {
          console.error('❌ Payment error:', error);
          setProcessingPayment(false);
          setLoading(false);
          toast.error('Payment failed. Please try again.');
          navigate('/payment-failed', {
            state: { reason: 'Payment error', details: error.message },
          });
        },
      });

    } catch (error: any) {
      console.error('❌ Checkout error:', error);
      toast.error(error.message || 'Failed to process payment');
      setProcessingPayment(false);
      setLoading(false);
    }
  };

  // Get item price (handle variants)
  const getItemPrice = (item: any) => {
    return item.variant ? item.variant.price : item.price;
  };

  // Get item total
  const getItemTotal = (item: any) => {
    return getItemPrice(item) * item.quantity;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <Link to="/" className="inline-block mb-8">
            <h1 className="font-serif text-3xl tracking-[0.2em] text-gray-900">INSPIRE</h1>
          </Link>
          <h2 className="text-4xl sm:text-5xl text-gray-900 font-light mb-8">Checkout</h2>

          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= 1 ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-xs text-gray-500">Shipping</span>
            </div>

            <div className={`h-0.5 w-16 ${currentStep >= 2 ? 'bg-yellow-600' : 'bg-gray-300'}`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= 2 ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-xs text-gray-500">Payment</span>
            </div>

            <div className={`h-0.5 w-16 ${currentStep >= 3 ? 'bg-yellow-600' : 'bg-gray-300'}`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= 3 ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                3
              </div>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Forms */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <form onSubmit={handleContinueToPayment} className="space-y-8" data-aos="fade-right">
                {/* Shipping Address */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-gray-900 text-xl font-semibold mb-6">Shipping Address</h3>

                  {/* Contact Info */}
                  <div className="mb-6">
                    <h4 className="text-gray-900 text-sm font-semibold mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900`}
                          required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-gray-700 text-sm mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900`}
                          required
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h4 className="text-gray-900 text-sm font-semibold mb-4">Delivery Address</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-gray-700 text-sm mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className={`w-full bg-white border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900`}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-gray-700 text-sm mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className={`w-full bg-white border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900`}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="streetAddress" className="block text-gray-700 text-sm mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          id="streetAddress"
                          value={formData.streetAddress}
                          onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                          className={`w-full bg-white border ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900`}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-gray-700 text-sm mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className={`w-full bg-white border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900`}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-gray-700 text-sm mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className={`w-full bg-white border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900`}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="block text-gray-700 text-sm mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-600 text-black py-4 text-sm tracking-wider font-bold rounded hover:bg-yellow-500 transition-colors mt-6"
                  >
                    CONTINUE TO PAYMENT →
                  </button>
                </div>
              </form>
            )}

            {/* Payment Step */}
            {currentStep === 2 && (
              <div className="space-y-8" data-aos="fade-right">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-gray-900 text-xl font-semibold mb-6">Payment Method</h3>
                  <p className="text-gray-500 mb-6">
                    Complete your purchase securely with Paystack
                  </p>

                  <button
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="w-full bg-yellow-600 text-black py-4 text-sm tracking-wider font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>PAY ₦{orderTotal.toLocaleString()}</>
                    )}
                  </button>

                  <p className="text-gray-400 text-xs text-center mt-4">
                    🔒 Secure payment powered by Paystack
                  </p>

                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full mt-4 text-gray-600 hover:text-yellow-600 transition"
                  >
                    ← Back to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Processing Step */}
            {currentStep === 3 && (
              <div className="text-center py-12" data-aos="zoom-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl text-gray-900 mb-4">Verifying Payment...</h3>
                <p className="text-gray-500">Please wait while we confirm your order</p>
                <Loader2 className="w-8 h-8 animate-spin text-yellow-600 mx-auto mt-6" />
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
              <h3 className="text-gray-900 text-xl font-semibold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm font-medium mb-1">{item.name}</p>
                      {item.variant && (
                        <p className="text-gray-500 text-xs">Size: {item.variant.size}</p>
                      )}
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      ₦{getItemTotal(item).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-900 text-xl font-bold pt-3 border-t border-gray-200">
                  <span>Order Total</span>
                  <span className="text-yellow-600">₦{orderTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}