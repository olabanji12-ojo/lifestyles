import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

// Cart item type (Firebase-ready)
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

// Mock cart data (will be replaced with Firebase)
const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Artisanal Ceramic Mug',
    price: 2800,
    quantity: 1,
    image: '/bowl1.webp',
    total: 2800,
  },
  {
    id: '2',
    name: 'Linen Blend Overshirt',
    price: 7500,
    quantity: 2,
    image: '/silk2.jpg',
    total: 15000,
  },
  {
    id: '3',
    name: 'Scented Soy Candle',
    price: 3200,
    quantity: 1,
    image: '/flower1.jpg',
    total: 3200,
  },
  {
    id: '4',
    name: 'Handcrafted Leather Wallet',
    price: 5000,
    quantity: 1,
    image: '/box1.jpg',
    total: 5000,
  },
];

// Payment method logos (can be updated with real images)
const paymentMethods = [
  { name: 'Visa', logo: '💳' },
  { name: 'Mastercard', logo: '💳' },
  { name: 'Verve', logo: '💳' },
  { name: 'Paystack', logo: '💳' },
];

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal > 50000 ? 0 : 2000; // Free shipping over ₦50,000
  const tax = Math.round(subtotal * 0.075); // 7.5% VAT
  const orderTotal = subtotal + shipping + tax;

  // Update quantity handler (Firebase-ready)
  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    );

    // TODO: Firebase integration
    // await updateCartItemQuantity(id, newQuantity);
  };

  // Remove item handler (Firebase-ready)
  const removeItem = async (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));

    // TODO: Firebase integration
    // await removeFromCart(id);
  };

  // Apply promo code handler
  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      // TODO: Validate promo code with backend
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8" aria-label="Breadcrumb" data-aos="fade-down">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-yellow-600 transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Cart</span>
        </nav>

        {/* Page Title */}
        <h1 
          className="text-4xl sm:text-5xl text-white font-light mb-12 text-center"
          data-aos="fade-up"
        >
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16" data-aos="fade-up">
            <ShoppingBag className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some items to get started!</p>
            <Link
              to="/shop"
              className="inline-block bg-yellow-600 text-black px-8 py-3 text-sm tracking-wider font-bold hover:bg-white transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6" data-aos="fade-right">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-6 bg-white/5 p-6 rounded-lg"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link 
                      to={`/product/${item.id}`}
                      className="text-white text-lg hover:text-yellow-600 transition-colors mb-2 block"
                      style={{ fontFamily: 'Dancing Script, cursive' }}
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-400 text-sm mb-4">₦{item.price.toLocaleString()}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 bg-white/5 border border-gray-700 rounded hover:border-yellow-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="text-white font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 bg-white/5 border border-gray-700 rounded hover:border-yellow-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-yellow-600 text-xl font-bold">
                      ₦{item.total.toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1" data-aos="fade-left">
              <div className="bg-white/5 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl text-white font-semibold mb-6">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex justify-between text-gray-300 mb-3">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-300 mb-3">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : ''}>
                    {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-gray-300 mb-6">
                  <span>Tax (7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-white text-2xl font-bold mb-6 pt-6 border-t border-gray-700">
                  <span>Order Total</span>
                  <span className="text-yellow-600">₦{orderTotal.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-600 text-black py-4 text-sm tracking-wider font-bold hover:bg-white transition-colors mb-4"
                >
                  PROCEED TO CHECKOUT
                </button>

                {/* Promo Code */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="w-full bg-white/5 border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 mb-2"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="w-full bg-transparent text-yellow-600 border border-yellow-600 py-2 text-sm tracking-wider hover:bg-yellow-600 hover:text-black transition-colors"
                  >
                    APPLY
                  </button>
                  {promoApplied && (
                    <p className="text-green-400 text-xs mt-2">Promo code applied!</p>
                  )}
                </div>

                {/* Continue Shopping */}
                <Link
                  to="/shop"
                  className="block text-center text-gray-400 hover:text-yellow-600 transition-colors text-sm"
                >
                  Continue Shopping
                </Link>

                {/* Payment Methods */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <p className="text-gray-400 text-xs text-center mb-3">We accept</p>
                  <div className="flex justify-center gap-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.name}
                        className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xl"
                        title={method.name}
                      >
                        {method.logo}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}