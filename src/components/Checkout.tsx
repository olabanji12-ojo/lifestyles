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
  const shipping = 0; // SHIPPING REMOVED
  const tax = 0;      // TAX REMOVED
  const orderTotal = subtotal; // Order total is now just the subtotal

  // START OF GUEST CHECKOUT CHANGE 1: REMOVE MANDATORY REDIRECT
  /*
  // Redirect if not logged in - **REMOVED TO ENABLE GUEST CHECKOUT**
  useEffect(() => {
    if (!currentUser) {
      toast.error('Please sign in to checkout');
      navigate('/login?redirect=/checkout');
    }
  }, [currentUser, navigate]);
  */
  // END OF GUEST CHECKOUT CHANGE 1

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !loading) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, navigate, loading]);

  // Pre-fill form with user data
  useEffect(() => {
    // This hook still works to pre-fill the form if a user *is* logged in
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
    } else {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      toast.error('Please fix the errors below to continue');
    }
  };

  // Handle Paystack Payment
  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();

    if (!Paystack) {
      toast.error('Payment system not loaded. Please refresh and try again.');
      return;
    }

    // START OF GUEST CHECKOUT CHANGE 2: Remove mandatory sign-in check
    /*
    if (!currentUser) {
      toast.error('Please sign in to continue');
      navigate('/login?redirect=/checkout');
      return;
    }
    */
    // END OF GUEST CHECKOUT CHANGE 2

    setProcessingPayment(true);
    setLoading(true);

    // Determine the UID to send to the backend. It will be null for guests.
    const customerUid = currentUser ? currentUser.uid : null;

    try {
      // SECURITY: Only log in development
      if (import.meta.env.DEV) {
        console.log('📞 Calling backend to prepare order...');
      }

      // Step 1: Call YOUR backend to prepare order
      const initRes = await fetch('/api/initializePaystack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // START OF GUEST CHECKOUT CHANGE 3: Pass customerUid (null for guest)
          uid: customerUid, // Will be null for guests. Backend must handle this.
          // END OF GUEST CHECKOUT CHANGE 3
          email: formData.email,
          shippingAddress: `${formData.streetAddress}, ${formData.city}, ${formData.state}`,
          customerInfo: {
            fullName: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
          },
          // IMPORTANT: Assuming the backend correctly uses the cartTotal or recalculates it.
        }),
      });

      if (!initRes.ok) {
        const errorData = await initRes.json();
        throw new Error(errorData.error || 'Failed to prepare order');
      }

      const { reference, orderId, amount, email } = await initRes.json();

      // SECURITY: Only log in development
      if (import.meta.env.DEV) {
        console.log('✅ Order prepared:', { reference, orderId, amount });
      }

      // Step 2: Open Paystack popup
      const paystack = new Paystack();

      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amount, // Already in kobo from backend
        currency: 'NGN',
        ref: reference,

        onSuccess: async (transaction: any) => {
          // SECURITY: NEVER trust client-side success callback
          // Only use it to get the reference, then verify server-side

          if (import.meta.env.DEV) {
            console.log('💳 Payment popup closed with reference:', transaction.reference);
          }

          // Show verifying state (don't show success yet!)
          setCurrentStep(3);

          try {
            // CRITICAL: Verify payment with YOUR backend
            // Backend will call Paystack API with SECRET KEY
            const verifyRes = await fetch('/api/verifyPaystack', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: transaction.reference,
                uid: customerUid, // For customer verification
              }),
            });

            const verifyData = await verifyRes.json();

            // SECURITY: Only proceed if SERVER confirms payment via Paystack API
            if (verifyData.verified && verifyData.paystackStatus === 'success') {
              if (import.meta.env.DEV) {
                console.log('✅ Payment verified by server');
              }

              // NOW it's safe to clear cart and redirect
              await clearCart();

              setTimeout(() => {
                navigate('/order-confirmation', {
                  state: {
                    reference: transaction.reference,
                    orderId: verifyData.orderId,
                    amount: amount / 100, // Convert back to Naira for display
                    isGuest: !customerUid,
                  },
                });
              }, 1500);
            } else {
              // Server verification failed
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error: any) {
            if (import.meta.env.DEV) {
              console.error('❌ Verification error:', error);
            }
            toast.error('Payment verification failed. Please contact support with reference: ' + transaction.reference);
            navigate('/payment-failed', {
              state: { reference: transaction.reference },
            });
          } finally {
            setProcessingPayment(false);
            setLoading(false);
          }
        },

        onCancel: () => {
          if (import.meta.env.DEV) {
            console.log('⚠️ Payment cancelled by user');
          }
          setProcessingPayment(false);
          setLoading(false);
          toast.error('Payment cancelled');
        },

        onError: (error: any) => {
          if (import.meta.env.DEV) {
            console.error('❌ Payment error:', error);
          }
          setProcessingPayment(false);
          setLoading(false);
          toast.error('Payment failed. Please try again.');
        },
      });

    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Checkout error:', error);
      }
      // SECURITY: Don't expose internal error details to users
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

  // START OF GUEST CHECKOUT CHANGE 5: REMOVE FINAL AUTH CHECK/LOADING SCREEN
  // This check is no longer needed since the component can now render for guests
  /*
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-600" />
      </div>
    );
  }
  */
  // END OF GUEST CHECKOUT CHANGE 5

  return (
    <div className="min-h-screen bg-cream-100 text-gray-900 pt-24 font-sans-serif">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          <div className="mb-8">
            <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-4 block">Finalization</span>
            <h1 className="text-6xl font-serif text-gray-900 tracking-tight">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-6 max-w-lg mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-colors ${currentStep >= 1 ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : <span className="text-[10px] font-bold">01</span>}
              </div>
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-400">Logistics</span>
            </div>

            <div className={`h-px w-20 ${currentStep >= 2 ? 'bg-gold-600' : 'bg-gray-200'}`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-colors ${currentStep >= 2 ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : <span className="text-[10px] font-bold">02</span>}
              </div>
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-400">Settlement</span>
            </div>

            <div className={`h-px w-20 ${currentStep >= 3 ? 'bg-gold-600' : 'bg-gray-200'}`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-colors ${currentStep >= 3 ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                <span className="text-[10px] font-bold">03</span>
              </div>
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-400">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: Forms */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <form onSubmit={handleContinueToPayment} className="space-y-12" data-aos="fade-right">
                {Object.keys(errors).length > 0 && (
                  <div className="bg-rose-50 border border-rose-100 p-6" role="alert">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-rose-800">
                          Attention Required
                        </h3>
                        <div className="mt-2 text-xs text-rose-700 font-sans-serif italic">
                          <p>Please review the missing acquisition details below.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-gray-50 shadow-premium p-10">
                  <h3 className="text-2xl font-serif text-gray-900 mb-10 border-b border-gray-50 pb-6">Delivery Directive</h3>

                  <div className="mb-12">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-600 mb-8">Identity & Contact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                          Email Protocol
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full bg-gray-50 border ${errors.email ? 'border-rose-400' : 'border-gray-100'} px-6 py-4 text-sm text-gray-900 focus:outline-none focus:border-gold-600 transition-colors`}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full bg-gray-50 border ${errors.phone ? 'border-rose-400' : 'border-gray-100'} px-6 py-4 text-sm text-gray-900 focus:outline-none focus:border-gold-600 transition-colors`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-600 mb-8">Physical Destination</h4>
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label htmlFor="firstName" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                            Given Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className={`w-full bg-gray-50 border ${errors.firstName ? 'border-rose-400' : 'border-gray-100'} px-6 py-4 text-sm text-gray-900 focus:outline-none focus:border-gold-600 transition-colors`}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                            Surname
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className={`w-full bg-gray-50 border ${errors.lastName ? 'border-rose-400' : 'border-gray-100'} px-6 py-4 text-sm text-gray-900 focus:outline-none focus:border-gold-600 transition-colors`}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="streetAddress" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                          Street Nomenclature
                        </label>
                        <input
                          type="text"
                          id="streetAddress"
                          value={formData.streetAddress}
                          onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                          className={`w-full bg-gray-50 border ${errors.streetAddress ? 'border-rose-400' : 'border-gray-100'} px-6 py-4 text-sm text-gray-900 focus:outline-none focus:border-gold-600 transition-colors`}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="sm:col-span-1">
                          <label htmlFor="city" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className={`w-full bg-gray-50 border ${errors.city ? 'border-rose-400' : 'border-gray-100'} px-6 py-4 text-sm text-gray-900 focus:outline-none focus:border-gold-600 transition-colors`}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                            Province / State
                          </label>
                          <input
                            type="text"
                            id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className={`w-full bg-gray-50 border ${errors.state ? 'border-rose-400' : 'border-gray-100'} px-6 py-4 text-sm text-gray-900 focus:outline-none focus:border-gold-600 transition-colors`}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-sm text-gray-900 focus:outline-none focus:border-gold-600 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-6 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all shadow-premium mt-12"
                  >
                    Proceed to Settlement →
                  </button>
                </div>
              </form>
            )}

            {/* Payment Step */}
            {currentStep === 2 && (
              <div className="space-y-8" data-aos="fade-right">
                <div className="bg-white border border-gray-50 shadow-premium p-10">
                  <h3 className="text-2xl font-serif text-gray-900 mb-10 border-b border-gray-50 pb-6">Payment Authorization</h3>
                  <p className="text-gray-500 italic font-sans-serif mb-10 leading-relaxed">
                    Finalize your acquisition via our secure settlement gateway. All data is encrypted and handled with absolute discretion.
                  </p>

                  <button
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="w-full bg-gray-900 text-white py-6 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all shadow-premium disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center gap-4"
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Authorizing...
                      </>
                    ) : (
                      <>Authorize ₦{orderTotal.toLocaleString()}</>
                    )}
                  </button>

                  <div className="mt-12 text-center">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Verified Secure Settlement Channel
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full mt-8 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gold-600 transition-colors"
                  >
                    ← Amend Directive
                  </button>
                </div>
              </div>
            )}

            {/* Processing Step */}
            {currentStep === 3 && (
              <div className="text-center py-24 bg-white border border-gray-50 shadow-premium" data-aos="zoom-in">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-4xl font-serif text-gray-900 mb-6">Verification in Progress</h3>
                <p className="text-gray-500 italic font-sans-serif">Synchronizing with the secure clearance protocol...</p>
                <div className="mt-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gold-600 mx-auto" />
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-white border border-gray-50 shadow-premium p-10 sticky top-32">
              <h3 className="text-2xl font-serif text-gray-900 mb-10 border-b border-gray-100 pb-6">Archive Summary</h3>

              <div className="space-y-8 mb-10 max-h-96 overflow-y-auto pr-4 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-16 h-16 flex-shrink-0 border border-gray-50 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-200" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm font-serif line-clamp-1">{item.name}</p>
                      {item.variant && (
                        <p className="text-[8px] uppercase tracking-widest font-bold text-gold-600 mt-1">{item.variant.size}</p>
                      )}
                      <p className="text-[8px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-serif italic text-gray-900">
                      ₦{getItemTotal(item).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-50 pt-8 space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  <span>Subtotal Value</span>
                  <span className="font-serif normal-case tracking-normal text-lg text-gray-900 font-normal">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-900 py-6 border-t border-gray-50 mt-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Aggregate</span>
                  <span className="text-3xl font-serif italic text-gold-600">₦{orderTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}