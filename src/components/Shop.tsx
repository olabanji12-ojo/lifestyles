// src/pages/Shop.tsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Grid, List, X, Loader2, ShoppingBag, SlidersHorizontal } from 'lucide-react'; // Added SlidersHorizontal for the filter button
import { getProducts, Product } from '../firebase/helpers';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

import FilterAccordionItem from '../components/FilterAccordionItem';
import CheckboxFilterGroup from '../components/CheckboxFilterGroup';

const categories = [
  { id: 'Fashion', label: 'Fashion' },
  { id: 'Accessories', label: 'Accessories' },
  { id: 'Gifts', label: 'Gifts' },
  { id: 'Home', label: 'Home' },
  { id: 'Productivity', label: 'Productivity' },
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

// Helper component for the filter content, extracted for reuse in desktop and mobile drawer
interface FilterContentProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categories: typeof categories;
    selectedCategories: string[];
    toggleFilter: (type: 'category' | 'function' | 'color', id: string) => void;
    functions: typeof functions;
    selectedFunctions: string[];
    colors: typeof colors;
    selectedColors: string[];
    priceRange: [number, number];
    maxPriceLimit: number;
    setPriceRange: (range: [number, number]) => void;
}

const FilterContent: React.FC<FilterContentProps> = ({
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategories,
    toggleFilter,
    functions,
    selectedFunctions,
    colors,
    selectedColors,
    priceRange,
    maxPriceLimit,
    setPriceRange,
}) => (
    <>
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

            {/* Price Range Filter */}
            <FilterAccordionItem title="Price Range">
                <div className="py-2 px-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>₦0</span>
                        <span>₦{priceRange[1].toLocaleString()}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={maxPriceLimit}
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                    <div className="mt-2 text-center text-sm font-medium text-gray-700">
                        Up to ₦{priceRange[1].toLocaleString()}
                    </div>
                </div>
            </FilterAccordionItem>
        </div>
    </>
);


export default function Shop() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(1000000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialSubCategory = searchParams.get('sub');
  const { addToCart } = useCart();

  // Fetch products from Firestore on mount and handle URL parameters
  useEffect(() => {
    // Handle category parameter (capitalize first letter for matching)
    if (initialCategory) {
      const capitalizedCategory = initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1);
      if (!selectedCategories.includes(capitalizedCategory)) {
        setSelectedCategories([capitalizedCategory]);
      }
    }

    // Handle subcategory parameter
    if (initialSubCategory && !selectedSubCategories.includes(initialSubCategory)) {
      setSelectedSubCategories([initialSubCategory]);
    }

    fetchProducts();
  }, [initialCategory, initialSubCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    if (result.success) {
      setProducts(result.products);

      // Calculate max price for the filter
      if (result.products.length > 0) {
        const prices = result.products.flatMap(p => {
          if (p.hasVariants && p.variants) {
            return p.variants.map(v => v.price);
          }
          return [p.price || 0];
        });
        const max = Math.max(...prices);
        setMaxPriceLimit(max);
        setPriceRange([0, max]);
      }
    } else {
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

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
    setSelectedSubCategories([]);
    setPriceRange([0, maxPriceLimit]);
    setSearchQuery('');
    setMobileFiltersOpen(false); // Close drawer on clear
  };

  // Helper to get product price
  const getProductPrice = (product: Product) => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      const minPrice = Math.min(...product.variants.map(v => v.price));
      return `From ₦${minPrice.toLocaleString()}`;
    }
    return `₦${(product.price || 0).toLocaleString()}`;
  };

  // Helper to check stock
  const isOutOfStock = (product: Product) => {
    if (product.hasVariants && product.variants) {
      return product.variants.every(v => v.stock === 0);
    }
    return (product.stock || 0) === 0;
  };

  // Add to cart handler
  const handleAddToCart = async (product: Product) => {
    if (isOutOfStock(product)) {
      toast.error('This product is out of stock');
      return;
    }

    try {
      await addToCart({
        productId: product.id || '',
        name: product.name,
        price: product.price || 0,
        quantity: 1,
        image: product.images?.[0] || '',
        stock: product.stock || 0,
        variant: null
      });
    } catch (error) {
      console.error('Failed to add to cart', error);
      toast.error('Could not add to cart');
    }
  };

  // Client-side filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      (product.name ?? '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesFunction = selectedFunctions.length === 0 ||
      selectedFunctions.some(fn => product.functions?.includes(fn));

    const matchesColor = selectedColors.length === 0 ||
      selectedColors.some(color => product.colors?.includes(color));

    // Subcategory filtering - handle both full IDs (e.g., 'fashion-pants') and short IDs (e.g., 'pants')
    const matchesSubCategory = selectedSubCategories.length === 0 ||
      selectedSubCategories.some(subCat => {
        if (!product.subCategory) return false;
        // Check if product.subCategory matches the selected subcategory directly
        if (product.subCategory === subCat) return true;
        // Check if product.subCategory ends with the selected subcategory (e.g., 'fashion-pants' ends with 'pants')
        if (product.subCategory.endsWith(`-${subCat}`)) return true;
        // Check if the last part of product.subCategory matches (e.g., 'pants' from 'fashion-pants')
        const productSubCatPart = product.subCategory.split('-').pop();
        if (productSubCatPart === subCat) return true;
        return false;
      });

    let productPrice = product.price || 0;
    if (product.hasVariants && product.variants) {
      productPrice = Math.min(...product.variants.map(v => v.price));
    }
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesFunction && matchesColor && matchesSubCategory && matchesPrice;
  });

  // Sorting
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
        return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
      default:
        return 0;
    }
  });

  // Active filters for display
  const activeFilters = [
    ...selectedCategories.map(id => ({ type: 'category' as const, id, label: categories.find(c => c.id === id)?.label || '' })),
    ...selectedFunctions.map(id => ({ type: 'function' as const, id, label: functions.find(f => f.id === id)?.label || '' })),
    ...selectedColors.map(id => ({ type: 'color' as const, id, label: colors.find(c => c.id === id)?.label || '' })),
  ];

  const activeFilterCount = activeFilters.length + (searchQuery ? 1 : 0) + (priceRange[1] < maxPriceLimit ? 1 : 0) + selectedSubCategories.length;


  // Pagination calculations
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedFunctions, selectedColors, selectedSubCategories, priceRange, sortBy]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* Mobile Filter Toggle Button (Visible on small screens, hidden on lg screens and up) */}
        <div className="lg:hidden mb-6">
            <button
                onClick={() => setMobileFiltersOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-black px-4 py-3 rounded-lg font-bold text-sm tracking-wider hover:bg-yellow-500 transition-colors shadow-md"
                aria-expanded={mobileFiltersOpen}
                aria-controls="mobile-filter-drawer"
            >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                    <span className="ml-2 bg-black text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-semibold">
                        {activeFilterCount}
                    </span>
                )}
            </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Mobile Filter Drawer (Conditional) */}
          {mobileFiltersOpen && (
            <>
                {/* Backdrop Overlay */}
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-hidden="true"
                />
                
                {/* Drawer Panel */}
                <aside
                    id="mobile-filter-drawer"
                    className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-[#FAF9F6] z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto p-6 ${
                        mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="filter-heading"
                >
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h2 id="filter-heading" className="text-xl font-bold text-gray-900">Filters</h2>
                        <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            aria-label="Close filters"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="pt-4">
                        <FilterContent 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            categories={categories}
                            selectedCategories={selectedCategories}
                            toggleFilter={toggleFilter}
                            functions={functions}
                            selectedFunctions={selectedFunctions}
                            colors={colors}
                            selectedColors={selectedColors}
                            priceRange={priceRange}
                            maxPriceLimit={maxPriceLimit}
                            setPriceRange={setPriceRange}
                        />

                        {/* Apply/Close Button (Optional, but good UX) */}
                        <div className="mt-8">
                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="w-full bg-yellow-600 text-black px-4 py-3 rounded-lg font-bold text-sm tracking-wider hover:bg-yellow-500 transition-colors shadow-md"
                            >
                                Show Products
                            </button>
                        </div>
                    </div>
                </aside>
            </>
          )}

          {/* Desktop Sidebar Filters (Hidden on small screens) */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0" data-aos="fade-right">
              <FilterContent 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleFilter={toggleFilter}
                  functions={functions}
                  selectedFunctions={selectedFunctions}
                  colors={colors}
                  selectedColors={selectedColors}
                  priceRange={priceRange}
                  maxPriceLimit={maxPriceLimit}
                  setPriceRange={setPriceRange}
              />
          </aside>

          {/* Main Content */}
          <main className="flex-1" data-aos="fade-left">
            {/* Active Filters & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.length > 0 && (
                  <>
                    <span className="text-gray-600 text-xs tracking-wider">Active Filters:</span>
                    {activeFilters.map((filter) => (
                      <button
                        key={`${filter.type}-${filter.id}`}
                        onClick={() => removeFilter(filter.type, filter.id)}
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

            {/* Product Grid/List Rendering */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
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
                <p className="text-gray-600 text-sm mb-6">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} product{totalProducts !== 1 ? 's' : ''}
                </p>

                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'flex flex-col gap-6'
                  }
                >
                  {currentProducts.map((product, index) => (
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
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock(product) ? 'opacity-50' : ''
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
                          className={`w-full py-2 text-sm tracking-wider font-bold rounded transition-colors ${isOutOfStock(product)
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const showPage =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                        const showEllipsis =
                          (pageNum === currentPage - 2 && currentPage > 3) ||
                          (pageNum === currentPage + 2 && currentPage < totalPages - 2);

                        if (showEllipsis) {
                          return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded transition-colors ${currentPage === pageNum
                              ? 'bg-yellow-600 text-black font-bold'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}