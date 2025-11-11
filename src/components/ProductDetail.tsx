import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Minus, Plus, ShoppingCart, Check } from 'lucide-react';

// Product type definition (ready for Firebase)
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

// Mock product data (will be replaced with Firebase data)
const mockProduct: Product = {
  id: '1',
  name: 'The Voyager Handbag',
  price: 79800,
  description: 'Discover the epitome of minimalist elegance with The Voyager Handbag. Crafted for the discerning individual, this piece seamlessly blends timeless design with modern functionality. Whether you\'re navigating the urban landscape or embarking on a sophisticated evening soiree, making it an incredibly versatile addition to your wardrobe.',
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

// Related products mock data
const relatedProducts = [
  { id: '2', name: 'Classic Leather Wallet', price: 18500, image: '/box1.jpg' },
  { id: '3', name: 'Elegant Silk Scarf', price: 8500, image: '/silk3.jpg' },
  { id: '4', name: 'Timeless Minimalist Watch', price: 35000, image: '/white_jewelry1.jpg' },
];

export default function ProductDetail() {
  const { id } = useParams();
  
  // State management
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Quantity handlers
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Add to cart handler (ready for Firebase integration)
  const handleAddToCart = async () => {
    setIsAddedToCart(true);
    
    // TODO: Firebase integration
    // await addToCart({
    //   productId: mockProduct.id,
    //   quantity: quantity,
    //   price: mockProduct.price,
    //   name: mockProduct.name,
    //   image: mockProduct.images[0]
    // });

    // Show success state
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  // Favorite toggle (ready for Firebase integration)
  const handleFavoriteToggle = async () => {
    setIsFavorite(!isFavorite);
    
    // TODO: Firebase integration
    // await toggleFavorite(mockProduct.id);
  };

  // Share handler
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
          <Link to="/shop" className="hover:text-yellow-600 transition-colors">{mockProduct.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{mockProduct.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Images */}
          <div data-aos="fade-right">
            {/* Main Image */}
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden mb-4">
              <img
                src={mockProduct.images[selectedImage]}
                alt={mockProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-yellow-600' 
                      : 'border-transparent hover:border-gray-600'
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

          {/* Right: Product Info */}
          <div data-aos="fade-left">
            <h1 className="text-4xl sm:text-5xl text-white font-light mb-4">
              {mockProduct.name}
            </h1>

            <p className="text-3xl text-yellow-600 font-bold mb-6">
              ₦{mockProduct.price.toLocaleString()}
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              {mockProduct.description}
            </p>

            {/* Materials/Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {mockProduct.materials.map((material) => (
                <span
                  key={material}
                  className="px-4 py-2 bg-white/5 border border-gray-700 text-white text-xs tracking-wider rounded"
                  style={{ fontFamily: 'Dancing Script, cursive' }}
                >
                  {material}
                </span>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white text-sm tracking-wider">Quantity:</span>
              <div className="flex items-center gap-3 bg-white/5 border border-gray-700 rounded">
                <button
                  onClick={decreaseQuantity}
                  className="p-3 hover:bg-white/5 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-white font-semibold min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="p-3 hover:bg-white/5 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddedToCart}
              className={`w-full py-4 text-sm tracking-[0.2em] font-bold rounded transition-all mb-4 flex items-center justify-center gap-3 ${
                isAddedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-yellow-600 text-black hover:bg-white'
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
                    ? 'bg-yellow-600 text-black border-yellow-600'
                    : 'bg-transparent text-white border-gray-700 hover:border-yellow-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'SAVED' : 'SAVE'}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-transparent text-white border border-gray-700 hover:border-yellow-600 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                SHARE
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="max-w-4xl mx-auto mb-16" data-aos="fade-up">
          {/* Material & Craftsmanship */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => toggleSection('materials')}
              className="w-full py-6 flex items-center justify-between text-left hover:text-yellow-600 transition-colors"
            >
              <span className="text-white text-lg font-semibold">Material & Craftsmanship</span>
              <Plus className={`w-5 h-5 text-yellow-600 transition-transform ${expandedSection === 'materials' ? 'rotate-45' : ''}`} />
            </button>
            {expandedSection === 'materials' && (
              <div className="pb-6 space-y-4">
                {mockProduct.features.map((feature, index) => (
                  <p key={index} className="text-gray-400 leading-relaxed">
                    {feature}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Dimensions & Capacity */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => toggleSection('dimensions')}
              className="w-full py-6 flex items-center justify-between text-left hover:text-yellow-600 transition-colors"
            >
              <span className="text-white text-lg font-semibold">Dimensions & Capacity</span>
              <Plus className={`w-5 h-5 text-yellow-600 transition-transform ${expandedSection === 'dimensions' ? 'rotate-45' : ''}`} />
            </button>
            {expandedSection === 'dimensions' && (
              <div className="pb-6">
                <p className="text-gray-400 leading-relaxed">{mockProduct.dimensions}</p>
              </div>
            )}
          </div>

          {/* Care Instructions */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => toggleSection('care')}
              className="w-full py-6 flex items-center justify-between text-left hover:text-yellow-600 transition-colors"
            >
              <span className="text-white text-lg font-semibold">Care Instructions</span>
              <Plus className={`w-5 h-5 text-yellow-600 transition-transform ${expandedSection === 'care' ? 'rotate-45' : ''}`} />
            </button>
            {expandedSection === 'care' && (
              <div className="pb-6">
                <p className="text-gray-400 leading-relaxed">{mockProduct.careInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <section className="max-w-4xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl text-white font-semibold mb-6">
            A Deeper Dive into The Voyager
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Every curve and contour of The Voyager Handbag has been thoughtfully considered, reflecting our dedication to functional artistry. Crafted with a keen eye, it's a harmony of refined taste and intelligent design. The subtle texture of premium Italian leather invites touch, while its robust construction promises resilience against the rigors of daily use. Its understated luxury makes it a complement to any ensemble, from a casual transit outfit to sophisticated evening wear, making it an incredibly versatile addition to your wardrobe.
            </p>
            <p>
              Inside, the intelligent compartment design ensures everything has its place. No more fumbling for your keys or phone; each section is thoughtfully sized to fit the essentials of a modern, on-the-go lifestyle. Discreet inner pockets keep valuables secure and organized, while a sleek silhouette. We believe true luxury lies in thoughtful details and unparalleled craftsmanship, and The Voyager embodies this philosophy in every thread and panel. Invest in a piece that elevates your style and simplifies your life.
            </p>
          </div>
        </section>

        {/* You Might Also Like */}
        <section data-aos="fade-up">
          <h2 className="text-3xl text-white font-semibold mb-8 text-center">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 
                    className="text-white text-lg mb-2 group-hover:text-yellow-600 transition-colors"
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