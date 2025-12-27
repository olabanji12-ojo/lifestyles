// src/pages/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, Minus, Plus, Check, Loader2, ShoppingBag } from 'lucide-react';
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
    <div className="min-h-screen bg-cream-100 text-gray-900 pt-24 font-sans-serif">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {/* Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-12 flex items-center gap-2" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-gold-600 transition-colors">Archive</Link>
          <span className="text-gray-200">/</span>
          <Link to="/shop" className="hover:text-gold-600 transition-colors">Shop</Link>
          <span className="text-gray-200">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-gold-600 transition-colors">
            {product.category}
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          {/* Images */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-white border border-gray-100 shadow-soft overflow-hidden group">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <ShoppingBag className="w-24 h-24 text-gray-200" />
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-6">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square border transition-all ${selectedImage === index
                      ? 'border-gold-600 p-1'
                      : 'border-transparent hover:border-gray-200'
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
          <div className="flex flex-col">
            <div className="mb-12">
              <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-4 block">Archival Piece</span>
              <h1 className="text-6xl font-serif text-gray-900 tracking-tight leading-tight mb-6">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl font-serif italic text-gray-900">
                  ₦{getCurrentPrice().toLocaleString()}
                </p>
                {isOutOfStock() ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1">Exhausted</span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1">In Stock</span>
                )}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed font-sans-serif mb-12 text-lg italic">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div className="mb-12">
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-6 font-bold">
                  Select Dimension:
                </label>
                <div className="flex flex-wrap gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => {
                        setSelectedVariant(variant.size);
                        setQuantity(1);
                      }}
                      disabled={variant.stock === 0}
                      className={`px-8 py-4 border text-[10px] font-bold tracking-widest uppercase transition-all ${selectedVariant === variant.size
                        ? 'bg-gray-900 text-white border-gray-900 shadow-premium'
                        : variant.stock === 0
                          ? 'border-gray-100 text-gray-300 cursor-not-allowed italic'
                          : 'border-gray-200 hover:border-gold-600 text-gray-600'
                        }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-8 mt-auto">
              <div className="flex items-center gap-8 py-8 border-y border-gray-100">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Quantity</span>
                <div className="flex items-center gap-6">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-xl font-serif text-gray-900 w-8 text-center border-b border-gray-100">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isOutOfStock()}
                  className={`flex-1 py-6 text-[10px] font-bold tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 ${isOutOfStock()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isAddingToCart
                      ? 'bg-gold-600 text-white shadow-premium'
                      : 'bg-gray-900 text-white hover:bg-gold-600 shadow-premium'
                    }`}
                >
                  {isOutOfStock() ? 'Exhausted' : isAddingToCart ? (
                    <><Check className="w-5 h-5" /> Secured in Cart</>
                  ) : (
                    <><ShoppingBag className="w-5 h-5" /> Acquire Selection</>
                  )}
                </button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`px-8 py-6 border transition-all flex items-center justify-center ${isFavorite
                    ? 'bg-rose-50 border-rose-100 text-rose-500'
                    : 'border-gray-100 text-gray-400 hover:border-gold-600'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="px-8 py-6 border border-gray-100 text-gray-400 hover:border-gold-600 transition-all flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Narrative */}
        <section className="max-w-4xl mx-auto mb-32 border-t border-gray-100 pt-20">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-3 block">Archival Protocol</span>
            <h2 className="text-4xl font-serif text-gray-900 tracking-tight mb-10">Care & Provenance</h2>
            <div className="space-y-8 text-gray-600 leading-relaxed text-lg font-sans-serif italic">
              <p>{product.description}</p>
              <p>Crafted with the utmost attention to detail, each piece in the INSPIRE collective is a testament to timeless design and quality. We recommend gentle handling to preserve the archival integrity of your acquisition.</p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-gray-100 pt-20">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-3 block">Catalogue</span>
              <h2 className="text-4xl font-serif text-gray-900 tracking-tight">Complementary Masterpieces</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-white border border-gray-50 mb-6">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <ShoppingBag className="w-12 h-12 text-gray-100" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest mb-1 block">{p.category}</span>
                    <h3 className="text-2xl font-serif text-gray-900 mb-2 group-hover:text-gold-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      ₦{p.hasVariants && p.variants
                        ? Math.min(...p.variants.map(v => v.price)).toLocaleString()
                        : (p.price || 0).toLocaleString()
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