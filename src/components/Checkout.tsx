import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

// Order item type
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Mock order items (from cart)
const mockOrderItems: OrderItem[] = [
  { id: '1', name: 'Luxury Silk Scarf', price: 12000, quantity: 1, image: '/silk3.jpg' },
  { id: '2', name: 'Artisanal Leather Wallet', price: 8500, quantity: 1, image: '/box1.jpg' },
  { id: '3', name: 'Ceramic Essential Oil Diffuser', price: 10000, quantity: 2, image: '/bowl1.webp' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saveAddress, setSaveAddress] = useState(false);

  // Form state
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = mockOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 1500;
  const orderTotal = subtotal + shipping;

  // Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) newErrors.email = 'Please enter a valid email address';

    if (!contactInfo.phone) newErrors.phone = 'Phone number is required';

    if (!shippingAddress.firstName) newErrors.firstName = 'First name is required';
    if (!shippingAddress.lastName) newErrors.lastName = 'Last name is required';
    if (!shippingAddress.streetAddress) newErrors.streetAddress = 'Street address is required';
    if (!shippingAddress.city) newErrors.city = 'City is required';
    if (!shippingAddress.state) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setCurrentStep(2);
  };

  const handlePayment = (e: FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);

    // Mock success - replace with Paystack integration
    setTimeout(() => {
      navigate('/order-confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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
                currentStep >= 1 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-xs text-gray-500">Shipping</span>
            </div>

            <div className={`h-0.5 w-16 ${currentStep >= 2 ? 'bg-yellow-500' : 'bg-gray-300'}`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= 2 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-xs text-gray-500">Payment</span>
            </div>

            <div className={`h-0.5 w-16 ${currentStep >= 3 ? 'bg-yellow-500' : 'bg-gray-300'}`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= 3 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                3
              </div>
              <span className="text-xs text-gray-500">Review</span>
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
                  <p className="text-gray-500 text-sm mb-6">Enter your delivery details to proceed</p>

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
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          placeholder="invalid@example.com"
                          className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500`}
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
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500`}
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
                            value={shippingAddress.firstName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                            placeholder="John"
                            className={`w-full bg-white border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500`}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-gray-700 text-sm mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            value={shippingAddress.lastName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                            placeholder="Doe"
                            className={`w-full bg-white border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500`}
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
                          value={shippingAddress.streetAddress}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                          placeholder="789 Maple Avenue"
                          className={`w-full bg-white border ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500`}
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
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            placeholder="Fairview"
                            className={`w-full bg-white border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500`}
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-gray-700 text-sm mb-2">
                            State / Province *
                          </label>
                          <input
                            type="text"
                            id="state"
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                            placeholder="California"
                            className={`w-full bg-white border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500`}
                          />
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="block text-gray-700 text-sm mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                            placeholder="90210"
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-400 bg-white checked:bg-yellow-500 checked:border-yellow-500 focus:ring-yellow-500 cursor-pointer"
                        />
                        <span className="text-gray-600 text-sm">Save this address for future purchases</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-white py-4 text-sm tracking-wider font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    CONTINUE TO PAYMENT
                    <span>→</span>
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
                    className="w-full bg-yellow-500 text-white py-4 text-sm tracking-wider font-bold hover:bg-yellow-400 transition-colors"
                  >
                    PAY ₦{orderTotal.toLocaleString()}
                  </button>

                  <p className="text-gray-400 text-xs text-center mt-4">
                    Secure payment powered by Paystack
                  </p>
                </div>
              </div>
            )}

            {/* Processing Step */}
            {currentStep === 3 && (
              <div className="text-center py-12" data-aos="zoom-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl text-gray-900 mb-4">Processing Payment...</h3>
                <p className="text-gray-500">Please wait while we confirm your order</p>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
              <h3 className="text-gray-900 text-xl font-semibold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {mockOrderItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p
                        className="text-gray-900 text-sm mb-1"
                        style={{ fontFamily: 'Dancing Script, cursive' }}
                      >
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      ₦{(item.price * item.quantity).toLocaleString()}
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
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-900 text-xl font-bold pt-3 border-t border-gray-200">
                  <span>Order Total</span>
                  <span className="text-yellow-500">₦{orderTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
