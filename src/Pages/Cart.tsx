// src/pages/Cart.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const paymentMethods = [
  { name: 'Visa', logo: 'Visa' },
  { name: 'Mastercard', logo: 'MC' },
  { name: 'Verve', logo: 'Verve' },
  { name: 'Paystack', logo: 'Paystack' },
];

export default function Cart() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, cartTotal, updateQuantity, removeFromCart, loading } = useCart();

  // Calculate costs
  const subtotal = cartTotal;
  const shipping = subtotal > 50000 ? 0 : 2000;
  const tax = Math.round(subtotal * 0.075); // 7.5% VAT
  const orderTotal = subtotal + shipping + tax;

  // Get item price (handle variants)
  const getItemPrice = (item: any) => {
    return item.variant ? item.variant.price : item.price;
  };

  // Get item total
  const getItemTotal = (item: any) => {
    return getItemPrice(item) * item.quantity;
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!currentUser) {
      // Not logged in → redirect to login with return URL
      navigate('/login?redirect=/checkout');
    } else {
      // Logged in → proceed to checkout
      navigate('/checkout');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-12 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 font-light">
          <Link to="/" className="hover:text-yellow-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-yellow-600">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Cart</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl text-gray-900 font-light mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything yet.</p>
            <Link
              to="/shop"
              className="inline-block bg-yellow-600 text-black px-8 py-3 text-sm tracking-wider font-bold rounded hover:bg-yellow-500 transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-4 sm:gap-6 bg-white shadow-md p-4 sm:p-6 rounded-lg"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-gray-800 text-base sm:text-lg hover:text-yellow-600 line-clamp-2 font-medium"
                    >
                      {item.name}
                    </Link>
                    
                    {/* Variant info */}
                    {item.variant && (
                      <p className="text-gray-500 text-sm mt-1">
                        Size: {item.variant.size}
                      </p>
                    )}
                    
                    <p className="text-gray-500 text-sm mt-1">
                      ₦{getItemPrice(item).toLocaleString()} each
                    </p>

                    {/* Stock warning */}
                    {item.stock < 5 && item.stock > 0 && (
                      <p className="text-orange-500 text-xs mt-2">
                        Only {item.stock} left in stock
                      </p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="text-gray-800 font-bold w-10 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        aria-label="Increase quantity"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-yellow-600 text-lg sm:text-xl font-bold">
                      ₦{getItemTotal(item).toLocaleString()}
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
                    <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-500 font-semibold' : ''}>
                      {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">
                      🎉 You qualify for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (7.5% VAT)</span>
                    <span>₦{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-gray-800 text-2xl font-bold my-6 pt-6 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-yellow-600">₦{orderTotal.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-600 text-black py-4 font-bold rounded hover:bg-yellow-500 transition-colors mb-4"
                >
                  {currentUser ? 'PROCEED TO CHECKOUT' : 'SIGN IN TO CHECKOUT'}
                </button>

                {!currentUser && (
                  <p className="text-xs text-gray-500 text-center mb-4">
                    You'll be asked to sign in with Google before checkout
                  </p>
                )}

                <Link
                  to="/shop"
                  className="block text-center text-yellow-600 hover:text-yellow-700 transition-colors font-medium"
                >
                  ← Continue Shopping
                </Link>

                {/* Payment Methods */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-500 text-xs mb-3">We accept</p>
                  <div className="flex justify-center gap-3">
                    {paymentMethods.map((m) => (
                      <div
                        key={m.name}
                        className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-700 border border-gray-200"
                      >
                        {m.logo}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Secure checkout powered by Paystack
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}