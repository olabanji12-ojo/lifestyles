import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Minus, Plus, ShoppingCart, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  materials: string[];
  features: string[];
  dimensions?: string;
  careInstructions?: string;
  relatedProducts?: string[];
}

const mockProduct: Product = {
  id: '1',
  name: 'The Voyager Handbag',
  price: 79800,
  description: 'Discover the epitome of minimalist elegance with The Voyager Handbag...',
  images: [
    '/white_jewelry1.jpg',
    '/silk2.jpg',
    '/bowl1.webp',
    '/box1.jpg',
  ],
  category: 'Accessories',
  materials: ['Leather', 'Handmade', 'Minimalist', 'Luxury', 'Everyday'],
  features: [
    'Crafted from ethically sourced, full-grain Italian leather, this handbag boasts a touchably soft and exceptional durability.',
    'Each stitch is meticulously applied by skilled artisans, ensuring a product that is not only beautiful but also built to last generations.'
  ],
  dimensions: 'Height: 12", Width: 15", Depth: 6"',
  careInstructions: 'Wipe clean with a soft, dry cloth. Avoid exposure to water and direct sunlight. Store in dust bag when not in use.',
};

const relatedProducts = [
  { id: '2', name: 'Classic Leather Wallet', price: 18500, image: '/box1.jpg' },
  { id: '3', name: 'Elegant Silk Scarf', price: 8500, image: '/silk3.jpg' },
  { id: '4', name: 'Timeless Minimalist Watch', price: 35000, image: '/white_jewelry1.jpg' },
];

export default function ProductDetail() {
  const { id } = useParams();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQuantity = () => setQuantity(quantity + 1);

  const handleAddToCart = async () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleFavoriteToggle = () => setIsFavorite(!isFavorite);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockProduct.name,
          text: mockProduct.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  const toggleSection = (section: string) =>
    setExpandedSection(expandedSection === section ? null : section);

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-yellow-600 transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-yellow-600 transition-colors">{mockProduct.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{mockProduct.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
              <img
                src={mockProduct.images[selectedImage]}
                alt={mockProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {mockProduct.images.map((image, index) => (
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
                    alt={`${mockProduct.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl sm:text-5xl text-gray-900 font-light mb-4">
              {mockProduct.name}
            </h1>

            <p className="text-3xl text-yellow-600 font-bold mb-6">
              ₦{mockProduct.price.toLocaleString()}
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              {mockProduct.description}
            </p>

            {/* Materials/Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {mockProduct.materials.map((material) => (
                <span
                  key={material}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 text-xs tracking-wider rounded"
                  style={{ fontFamily: 'Dancing Script, cursive' }}
                >
                  {material}
                </span>
              ))}
            </div>

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
                >
                  <Plus className="w-4 h-4 text-gray-800" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isAddedToCart}
              className={`w-full py-4 text-sm tracking-[0.2em] font-bold rounded transition-all mb-4 flex items-center justify-center gap-3 ${
                isAddedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-yellow-600 text-gray-900 hover:bg-yellow-500'
              }`}
            >
              {isAddedToCart ? (
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
                onClick={handleFavoriteToggle}
                className={`flex-1 py-3 border transition-all flex items-center justify-center gap-2 ${
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
                className="flex-1 py-3 bg-white text-gray-800 border border-gray-300 hover:border-yellow-600 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                SHARE
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="max-w-4xl mx-auto mb-16">
          {['materials', 'dimensions', 'care'].map((section) => {
            const title =
              section === 'materials'
                ? 'Material & Craftsmanship'
                : section === 'dimensions'
                ? 'Dimensions & Capacity'
                : 'Care Instructions';
            const content =
              section === 'materials'
                ? mockProduct.features.map((f, i) => <p key={i}>{f}</p>)
                : section === 'dimensions'
                ? mockProduct.dimensions
                : mockProduct.careInstructions;
            return (
              <div key={section} className="border-b border-gray-300">
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full py-6 flex items-center justify-between text-left hover:text-yellow-600 transition-colors"
                >
                  <span className="text-gray-900 text-lg font-semibold">{title}</span>
                  <Plus className={`w-5 h-5 text-yellow-600 transition-transform ${expandedSection === section ? 'rotate-45' : ''}`} />
                </button>
                {expandedSection === section && (
                  <div className="pb-6 space-y-4 text-gray-700">{content}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Description */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl text-gray-900 font-semibold mb-6">
            A Deeper Dive into The Voyager
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Every curve and contour of The Voyager Handbag has been thoughtfully considered...
            </p>
            <p>
              Inside, the intelligent compartment design ensures everything has its place...
            </p>
          </div>
        </section>

        {/* Related Products */}
        <section>
          <h2 className="text-3xl text-gray-900 font-semibold mb-8 text-center">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="text-gray-900 text-lg mb-2 group-hover:text-yellow-600 transition-colors"
                    style={{ fontFamily: 'Dancing Script, cursive' }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-yellow-600 font-bold">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
