// src/pages/Cart.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../context/CartContext'; // Import CartItem type if available in CartContext


export default function Cart() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, cartTotal, updateQuantity, removeFromCart, loading } = useCart();

  // Calculate costs - NO SHIPPING OR TAX
  const subtotal = cartTotal;
  const orderTotal = subtotal; // Total is just the subtotal

  // Get item price (handle variants)
  const getItemPrice = (item: CartItem) => {
    return item.variant ? item.variant.price : item.price;
  };

  // Get item total
  const getItemTotal = (item: CartItem) => {
    return getItemPrice(item) * item.quantity;
  };

  /**
   * Enhanced handler for removing an item with confirmation.
   * @param itemId The unique ID of the item in the cart.
   * @param itemName The name of the product for the confirmation message.
   */
  const handleRemoveItem = (itemId: string, itemName: string) => {
    // Show a native browser confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to remove "${itemName}" from your cart?`
    );

    if (confirmed) {
      removeFromCart(itemId);
    }
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
    <div className="min-h-screen bg-cream-100 text-gray-900 pt-24 font-sans-serif">
      <div className="px-6 lg:px-12 py-12 max-w-[1600px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-12 flex items-center gap-2" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-gold-600 transition-colors">Archive</Link>
          <span className="text-gray-200">/</span>
          <Link to="/shop" className="hover:text-gold-600 transition-colors">Shop</Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">Cart</span>
        </nav>

        {/* Page Title */}
        <div className="mb-16">
          <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-4 block">Acquisitions</span>
          <h1 className="text-6xl font-serif text-gray-900 tracking-tight">Shopping Bag</h1>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-32 bg-white border border-gray-50 shadow-premium">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-8" />
            <h2 className="text-3xl font-serif text-gray-900 mb-6">Your bag is empty</h2>
            <p className="text-gray-500 mb-10 italic font-sans-serif">Curate your collection from our archives</p>
            <Link
              to="/shop"
              className="inline-block bg-gray-900 text-white px-10 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all shadow-premium"
            >
              Continue Archiving
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-8">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-8 bg-white border border-gray-50 p-8 shadow-soft group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0 w-32 h-32 overflow-hidden border border-gray-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-200" />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-gray-900 text-xl font-serif hover:text-gold-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-lg font-serif italic text-gray-900 ml-4">
                        ₦{getItemTotal(item).toLocaleString()}
                      </p>
                    </div>

                    {/* Variant info */}
                    {item.variant && (
                      <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest mb-1">
                        Dimension: {item.variant.size}
                      </span>
                    )}

                    <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-4">
                      ₦{getItemPrice(item).toLocaleString()} / Unit
                    </p>

                    {/* Stock warnings */}
                    <div className="mt-auto flex flex-wrap gap-2">
                      {item.stock === 0 ? (
                        <span className="text-[8px] font-bold tracking-widest uppercase text-rose-500 bg-rose-50 px-2 py-1">Exhausted</span>
                      ) : item.stock < 5 ? (
                        <span className="text-[8px] font-bold tracking-widest uppercase text-orange-500 bg-orange-50 px-2 py-1 italic">Rare: {item.stock} Available</span>
                      ) : null}

                      {item.quantity > item.stock && (
                        <span className="text-[8px] font-bold tracking-widest uppercase text-rose-600 bg-rose-50 px-2 py-1 border border-rose-100">Exceeds Allowance</span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-4 bg-gray-50 px-3 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-serif text-gray-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="text-[10px] font-bold tracking-widest uppercase text-gray-300 hover:text-rose-500 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-50 shadow-premium p-10 sticky top-32">
                <h2 className="text-3xl font-serif text-gray-900 mb-10 border-b border-gray-100 pb-6">Bag Summary</h2>

                <div className="space-y-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Subtotal Protocol</span>
                    <span className="font-serif normal-case tracking-normal text-lg text-gray-900">₦{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-gray-900 my-10 py-6 border-y border-gray-100">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Total Acquisition</span>
                  <span className="text-3xl font-serif italic text-gold-600">₦{orderTotal.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={cart.some(item => item.quantity > item.stock || item.stock === 0)}
                  className="w-full bg-gray-900 text-white py-6 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all shadow-premium mb-6 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {currentUser ? 'Commit Selection' : 'Log Identification'}
                </button>

                {cart.some(item => item.quantity > item.stock || item.stock === 0) && (
                  <div className="bg-rose-50 p-4 mb-6">
                    <p className="text-rose-600 text-[8px] font-bold uppercase tracking-widest text-center leading-relaxed">
                      Please adjust quantities or remove exhausted pieces to proceed with checkout.
                    </p>
                  </div>
                )}

                <Link
                  to="/shop"
                  className="block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gold-600 transition-colors"
                >
                  Continue Archiving
                </Link>

                {/* Security Badge */}
                <div className="mt-12 text-center">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Secure Acquisition Channel
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