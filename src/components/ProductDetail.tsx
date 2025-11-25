// src/pages/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, Minus, Plus, ShoppingCart, Check, Loader2, ShoppingBag } from 'lucide-react';
import { getProductById, getProducts, Product } from '../firebase/helpers';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    
    // Fetch product by ID
    const result = await getProductById(id!);
    
    if (result.success && result.product) {
      setProduct(result.product);
      
      // If product has variants, select first by default
      if (result.product.hasVariants && result.product.variants && result.product.variants.length > 0) {
        setSelectedVariant(result.product.variants[0].size);
      }
      
      // Fetch related products (same category)
      await fetchRelatedProducts(result.product.category);
    } else {
      toast.error('Product not found');
      navigate('/shop');
    }
    
    setLoading(false);
  };

  const fetchRelatedProducts = async (category: string) => {
    const result = await getProducts();
    if (result.success) {
      // Filter by same category, exclude current product
      const related = result.products
        .filter(p => p.category === category && p.id !== id)
        .slice(0, 3); // Show max 3 related products
      setRelatedProducts(related);
    }
  };

  // Get currently selected variant object
  const getCurrentVariant = () => {
    if (!product?.hasVariants || !product.variants || !selectedVariant) return null;
    return product.variants.find(v => v.size === selectedVariant);
  };

  // Get current price (variant or base)
  const getCurrentPrice = () => {
    const variant = getCurrentVariant();
    return variant ? variant.price : (product?.price || 0);
  };

  // Get current stock
  const getCurrentStock = () => {
    const variant = getCurrentVariant();
    return variant ? variant.stock : (product?.stock || 0);
  };

  // Check if out of stock
  const isOutOfStock = () => getCurrentStock() === 0;

  // Quantity handlers
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    const stock = getCurrentStock();
    if (quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${stock} items available`);
    }
  };

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product) return;
    
    if (isOutOfStock()) {
      toast.error('This product is out of stock');
      return;
    }

    // Validate variant selection
    if (product.hasVariants && !selectedVariant) {
      toast.error('Please select a size');
      return;
    }

    setIsAddingToCart(true);

    try {
      const variant = getCurrentVariant();
      
     await addToCart({
  productId: product.id!,
  name: product.name,
  price: product.price || 0,
  quantity,
  image: product.images[0] || '',
  variant: variant ? {
    size: variant.size,
    price: variant.price,
  } : null,  // ← Use null instead of undefined
  stock: getCurrentStock(),
});

      // Reset quantity after adding
      setQuantity(1);
      
      // Show success state briefly
      setTimeout(() => setIsAddingToCart(false), 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      setIsAddingToCart(false);
    }
  };

  // Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
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

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">Product not found</p>
          <Link to="/shop" className="bg-yellow-600 text-black px-6 py-3 rounded hover:bg-yellow-500">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-800 pt-20">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-yellow-600 transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-yellow-600 transition-colors">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
              {product.images && product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <ShoppingBag className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-yellow-600'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl sm:text-5xl text-gray-900 font-light mb-4">
              {product.name}
            </h1>

            <p className="text-3xl text-yellow-600 font-bold mb-6">
              ₦{getCurrentPrice().toLocaleString()}
            </p>

            {/* Stock Status */}
            {isOutOfStock() ? (
              <p className="text-red-500 font-semibold mb-4">Out of Stock</p>
            ) : getCurrentStock() < 5 ? (
              <p className="text-orange-500 font-semibold mb-4">
                Only {getCurrentStock()} left in stock!
              </p>
            ) : (
              <p className="text-green-600 font-semibold mb-4">In Stock</p>
            )}

            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 text-xs tracking-wider rounded">
                {product.category}
              </span>
              {product.functions?.map((fn) => (
                <span
                  key={fn}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 text-xs tracking-wider rounded"
                >
                  {fn}
                </span>
              ))}
              {product.colors?.map((color) => (
                <span
                  key={color}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 text-xs tracking-wider rounded"
                >
                  {color}
                </span>
              ))}
            </div>

            {/* Variant Selector (if applicable) */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-800 text-sm tracking-wider mb-3">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => {
                        setSelectedVariant(variant.size);
                        setQuantity(1); // Reset quantity when changing variant
                      }}
                      disabled={variant.stock === 0}
                      className={`px-6 py-3 border-2 rounded transition-all ${
                        selectedVariant === variant.size
                          ? 'border-yellow-600 bg-yellow-600 text-black font-bold'
                          : variant.stock === 0
                          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-yellow-600'
                      }`}
                    >
                      {variant.size}
                      {variant.stock === 0 && (
                        <span className="block text-xs mt-1">Out of stock</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-800 text-sm tracking-wider">Quantity:</span>
              <div className="flex items-center gap-3 bg-gray-100 border border-gray-300 rounded">
                <button
                  onClick={decreaseQuantity}
                  className="p-3 hover:bg-gray-200 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 text-gray-800" />
                </button>
                <span className="text-gray-900 font-semibold min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="p-3 hover:bg-gray-200 transition-colors"
                  aria-label="Increase quantity"
                  disabled={isOutOfStock()}
                >
                  <Plus className="w-4 h-4 text-gray-800" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || isOutOfStock()}
              className={`w-full py-4 text-sm tracking-[0.2em] font-bold rounded transition-all mb-4 flex items-center justify-center gap-3 ${
                isOutOfStock()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isAddingToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-yellow-600 text-gray-900 hover:bg-yellow-500'
              }`}
            >
              {isOutOfStock() ? (
                <>OUT OF STOCK</>
              ) : isAddingToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  ADD TO CART
                </>
              )}
            </button>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex-1 py-3 border rounded transition-all flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'bg-yellow-600 text-gray-900 border-yellow-600'
                    : 'bg-white text-gray-800 border-gray-300 hover:border-yellow-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'SAVED' : 'SAVE'}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-white text-gray-800 border border-gray-300 rounded hover:border-yellow-600 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                SHARE
              </button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl text-gray-900 font-semibold mb-6">
            About This Product
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{product.description}</p>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl text-gray-900 font-semibold mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    {relatedProduct.images && relatedProduct.images[0] ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-gray-900 text-lg mb-2 group-hover:text-yellow-600 transition-colors"
                      style={{ fontFamily: 'Dancing Script, cursive' }}
                    >
                      {relatedProduct.name}
                    </h3>
                    <p className="text-yellow-600 font-bold">
                      {relatedProduct.hasVariants && relatedProduct.variants
                        ? `From ₦${Math.min(...relatedProduct.variants.map(v => v.price)).toLocaleString()}`
                        : `₦${(relatedProduct.price || 0).toLocaleString()}`
                      }
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}