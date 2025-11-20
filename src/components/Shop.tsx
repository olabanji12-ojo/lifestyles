// src/pages/Shop.tsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // Added useSearchParams for context
import { Search, Grid, List, X, Loader2, ShoppingBag } from 'lucide-react';
import { getProducts, Product } from '../firebase/helpers';
import toast from 'react-hot-toast';

// --- NEW IMPORTS ---
import FilterAccordionItem from '../components/FilterAccordionItem'; 
import CheckboxFilterGroup from '../components/CheckboxFilterGroup';
// -------------------


// Filter options (kept local as per your current implementation)
const categories = [
  { id: 'Fashion', label: 'Fashion' },
  { id: 'Accessories', label: 'Accessories' },
  { id: 'Gifts', label: 'Gifts' },
  { id: 'Home', label: 'Home' },
  { id: 'Productivity', label: 'Productivity' }, // Assuming this should be integrated
  { id: 'Events', label: 'Events' },
  { id: 'Packaging', label: 'Packaging' },
];

const functions = [
  { id: 'Work', label: 'Work' },
  { id: 'Play', label: 'Play' },
  { id: 'Fancy', label: 'Fancy' },
  { id: 'Sleep', label: 'Sleep' },
  { id: 'Eat', label: 'Eat' },
];

const colors = [
  { id: 'Dark', label: 'Dark' },
  { id: 'Bright', label: 'Bright' },
  { id: 'Neutral', label: 'Neutral' },
];

export default function Shop() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  
  // Use search params to check for a URL-defined category (e.g., from an editorial page link)
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');


  // Fetch products from Firestore on mount
  useEffect(() => {
    // Optionally set the initial category filter if it exists in the URL
    if (initialCategory && !selectedCategories.includes(initialCategory)) {
        setSelectedCategories([initialCategory]);
    }
    fetchProducts();
  }, [initialCategory]); // Depend on initialCategory to apply it if present

  const fetchProducts = async () => {
    setLoading(true);
    // Assuming getProducts now handles all products, not just the hardcoded mock data
    const result = await getProducts(); 
    if (result.success) {
      setProducts(result.products);
    } else {
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

  // Filter toggle functions (kept the same, but now passed to CheckboxFilterGroup)
  const toggleFilter = (type: 'category' | 'function' | 'color', id: string) => {
    if (type === 'category') {
      setSelectedCategories(prev =>
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      );
    } else if (type === 'function') {
      setSelectedFunctions(prev =>
        prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      );
    } else {
      setSelectedColors(prev =>
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      );
    }
  };

  const removeFilter = (type: 'category' | 'function' | 'color', id: string) => {
    toggleFilter(type, id);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedFunctions([]);
    setSelectedColors([]);
    setSearchQuery('');
  };

  // Client-side filtering (remains the same)
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch =
    (product.name ?? '').toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(product.category);

    // Function filter
    const matchesFunction = selectedFunctions.length === 0 || 
      selectedFunctions.some(fn => product.functions?.includes(fn));

    // Color filter
    const matchesColor = selectedColors.length === 0 || 
      selectedColors.some(color => product.colors?.includes(color));

    return matchesSearch && matchesCategory && matchesFunction && matchesColor;
  });

  // Sorting (remains the same)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        const priceA = a.hasVariants && a.variants ? Math.min(...a.variants.map(v => v.price)) : (a.price || 0);
        const priceB = b.hasVariants && b.variants ? Math.min(...b.variants.map(v => v.price)) : (b.price || 0);
        return priceA - priceB;
      case 'price-high':
        const priceHighA = a.hasVariants && a.variants ? Math.max(...a.variants.map(v => v.price)) : (a.price || 0);
        const priceHighB = b.hasVariants && b.variants ? Math.max(...b.variants.map(v => v.price)) : (b.price || 0);
        return priceHighB - priceHighA;
      case 'newest':
        // Assuming createdAt is a Firestore Timestamp object with toMillis() method
        return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0); 
      default:
        return 0;
    }
  });

  // Active filters for display (remains the same)
  const activeFilters = [
    ...selectedCategories.map(id => ({ type: 'category' as const, id, label: categories.find(c => c.id === id)?.label || '' })),
    ...selectedFunctions.map(id => ({ type: 'function' as const, id, label: functions.find(f => f.id === id)?.label || '' })),
    ...selectedColors.map(id => ({ type: 'color' as const, id, label: colors.find(c => c.id === id)?.label || '' })),
  ];

  // Get product price display (remains the same)
  const getProductPrice = (product: Product) => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      const minPrice = Math.min(...product.variants.map(v => v.price));
      return `From ₦${minPrice.toLocaleString()}`;
    }
    return `₦${(product.price || 0).toLocaleString()}`;
  };

  // Check if product is out of stock (remains the same)
  const isOutOfStock = (product: Product) => {
    if (product.hasVariants && product.variants) {
      return product.variants.every(v => v.stock === 0);
    }
    return (product.stock || 0) === 0;
  };

  // Add to cart handler (placeholder for now)
  const handleAddToCart = (product: Product) => {
    if (isOutOfStock(product)) {
      toast.error('This product is out of stock');
      return;
    }
    // TODO: Implement cart functionality in next phase
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-800 pt-20">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Shop</span>
        </nav>

        {/* Page Title */}
        <h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.15em] text-center mb-12 text-gray-900"
          data-aos="fade-down"
        >
          SHOP
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0" data-aos="fade-right">
            
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded pl-10 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                />
              </div>
            </div>

            {/* --- REPLACED STATIC FILTERS WITH ACCORDIONS --- */}
            <div className="border border-gray-200 bg-white rounded-lg p-4">
                
                {/* Category Filter */}
                <FilterAccordionItem title="Category" defaultOpen={true}>
                    <CheckboxFilterGroup 
                        options={categories}
                        selectedFilters={selectedCategories}
                        onToggle={(id) => toggleFilter('category', id)}
                    />
                </FilterAccordionItem>

                {/* Function Filter */}
                <FilterAccordionItem title="Function">
                    <CheckboxFilterGroup 
                        options={functions}
                        selectedFilters={selectedFunctions}
                        onToggle={(id) => toggleFilter('function', id)}
                    />
                </FilterAccordionItem>

                {/* Color Filter */}
                <FilterAccordionItem title="Color">
                    <CheckboxFilterGroup 
                        options={colors}
                        selectedFilters={selectedColors}
                        onToggle={(id) => toggleFilter('color', id)}
                    />
                </FilterAccordionItem>
                
                {/* Price Range Filter Placeholder (as discussed previously) */}
                <FilterAccordionItem title="Price Range">
                    <div className="py-2 text-sm text-gray-500">
                        {/* A dedicated price slider component will be implemented here later */}
                        Price filter component coming soon...
                    </div>
                </FilterAccordionItem>

            </div>
            {/* ---------------------------------------------------- */}
            
          </aside>

          {/* Main Content */}
          <main className="flex-1" data-aos="fade-left">
            {/* Active Filters & Controls (remains the same) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.length > 0 && (
                  <>
                    <span className="text-gray-600 text-xs tracking-wider">Active Filters:</span>
                    {activeFilters.map((filter) => (
                      <button
                        key={`${filter.type}-${filter.id}`}
                        onClick={() => removeFilter(filter.type, filter.id)}
                        // Updated style for a softer, more elegant filter chip
                        className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs tracking-wider hover:bg-red-50 transition-colors"
                      >
                        {filter.label}
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    ))}
                    <button
                      onClick={clearAllFilters}
                      className="text-gray-500 text-xs hover:text-yellow-600 transition-colors underline"
                    >
                      Clear all
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>

                {/* View Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-yellow-600 text-black' : 'bg-gray-200 text-gray-600'} hover:bg-yellow-600 hover:text-black transition-colors`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-yellow-600 text-black' : 'bg-gray-200 text-gray-600'} hover:bg-yellow-600 hover:text-black transition-colors`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid/List Rendering (remains the same) */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              /* No Products Found */
              <div className="flex flex-col items-center justify-center py-32">
                <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-yellow-600 text-black px-6 py-2 rounded hover:bg-yellow-500 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Count */}
                <p className="text-gray-600 text-sm mb-6">
                  Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
                </p>

                {/* Products */}
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'flex flex-col gap-6'
                  }
                >
                  {sortedProducts.map((product, index) => (
                    <article
                      key={product.id}
                      className="group relative bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      {/* Out of Stock Badge */}
                      {isOutOfStock(product) && (
                        <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded text-xs font-bold tracking-wider bg-gray-500 text-white">
                          OUT OF STOCK
                        </span>
                      )}

                      {/* Featured Badge */}
                      {product.featured && !isOutOfStock(product) && (
                        <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded text-xs font-bold tracking-wider bg-yellow-600 text-black">
                          FEATURED
                        </span>
                      )}

                      {/* Image */}
                      <Link to={`/product/${product.id}`} className="block aspect-square bg-gray-100 overflow-hidden">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                              isOutOfStock(product) ? 'opacity-50' : ''
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ShoppingBag className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="p-4">
                        <Link
                          to={`/product/${product.id}`}
                          className="text-gray-900 text-lg font-medium mb-2 block hover:text-yellow-600 transition-colors"
                          style={{ fontFamily: 'Dancing Script, cursive' }}
                        >
                          {product.name}
                        </Link>
                        <p className="text-yellow-600 text-xl font-semibold mb-4">
                          {getProductPrice(product)}
                        </p>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock(product)}
                          className={`w-full py-2 text-sm tracking-wider font-bold rounded transition-colors ${
                            isOutOfStock(product)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-yellow-600 text-black hover:bg-yellow-500'
                          }`}
                        >
                          {isOutOfStock(product) ? 'OUT OF STOCK' : 'ADD TO CART'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}