// src/pages/Cart.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

const mockCartItems: CartItem[] = [
  { id: '1', name: 'Artisanal Ceramic Mug', price: 2800, quantity: 1, image: '/bowl1.webp', total: 2800 },
  { id: '2', name: 'Linen Blend Overshirt', price: 7500, quantity: 2, image: '/silk2.jpg', total: 15000 },
  { id: '3', name: 'Scented Soy Candle', price: 3200, quantity: 1, image: '/flower1.jpg', total: 3200 },
  { id: '4', name: 'Handcrafted Leather Wallet', price: 5000, quantity: 1, image: '/box1.jpg', total: 5000 },
];

const paymentMethods = [
  { name: 'Visa', logo: 'Visa' },
  { name: 'Mastercard', logo: 'MC' },
  { name: 'Verve', logo: 'Verve' },
  { name: 'Paystack', logo: 'Paystack' },
];

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal > 50000 ? 0 : 2000;
  const tax = Math.round(subtotal * 0.075);
  const orderTotal = subtotal + shipping + tax;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  return (
    <>
      <div className="min-h-screen bg-cream-50 pt-20">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-12 max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8 font-light">
            <Link to="/" className="hover:text-yellow-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-yellow-600">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Cart</span>
          </nav>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl text-gray-800 mb-4">Your cart is empty</h2>
              <Link
                to="/shop"
                className="inline-block bg-yellow-600 text-white px-8 py-3 text-sm tracking-wider font-bold hover:bg-yellow-500 transition-colors"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-4 sm:gap-6 bg-white shadow-md p-4 sm:p-6 rounded-lg"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.id}`}
                        className="text-gray-800 text-base sm:text-lg hover:text-yellow-600 line-clamp-2"
                        style={{ fontFamily: 'Dancing Script, cursive' }}
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-500 text-sm mt-1">₦{item.price.toLocaleString()}</p>

                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="text-gray-800 font-bold w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-yellow-600 text-lg sm:text-xl font-bold">
                        ₦{item.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
                  <h2 className="text-2xl text-gray-800 font-semibold mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-500 font-semibold' : ''}>
                        {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (7.5%)</span>
                      <span>₦{tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-gray-800 text-2xl font-bold my-6 pt-6 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-yellow-600">₦{orderTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-yellow-600 text-white py-4 font-bold hover:bg-yellow-500 transition-colors mb-4"
                  >
                    PROCEED TO CHECKOUT
                  </button>

                  <div className="mb-6">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-yellow-600 mb-2"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="w-full border border-yellow-600 text-yellow-600 py-2 hover:bg-yellow-600 hover:text-white transition-colors"
                    >
                      APPLY
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-500 text-xs mb-3">We accept</p>
                    <div className="flex justify-center gap-3">
                      {paymentMethods.map((m) => (
                        <div key={m.name} className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-700">
                          {m.logo}
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
    </>
  );
}
