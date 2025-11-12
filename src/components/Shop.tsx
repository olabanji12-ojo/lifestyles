import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, X } from 'lucide-react';

// Categories from homepage
const categories = [
  { id: 'fashion', label: 'Fashion' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'home', label: 'Home' },
  { id: 'events', label: 'Events' },
];

const functions = [
  { id: 'work', label: 'Work' },
  { id: 'play', label: 'Play' },
  { id: 'fancy', label: 'Fancy' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'eat', label: 'Eat' },
];

const colors = [
  { id: 'darks', label: 'Darks' },
  { id: 'brights', label: 'Brights' },
  { id: 'neutrals', label: 'Neutrals' },
  { id: 'lights', label: 'Lights' },
];

const sampleProducts = [
  { id: 1, name: 'Silk Kimono', price: 45000, image: '/silk2.jpg', badge: 'New', category: 'fashion' },
  { id: 2, name: 'Leather Bag', price: 32000, image: '/white_jewelry1.jpg', badge: 'Sale', category: 'accessories' },
  { id: 3, name: 'Gift Box Set', price: 15000, image: '/box1.jpg', category: 'gifts' },
  { id: 4, name: 'Cotton Kaftan', price: 38000, image: '/silk3.jpg', badge: 'New', category: 'fashion' },
  { id: 5, name: 'Silk Scarf', price: 12000, image: '/flower1.jpg', category: 'accessories' },
  { id: 6, name: 'Bedding Set', price: 55000, image: '/bed1.jpg', category: 'home' },
  { id: 7, name: 'Ceramic Bowl', price: 8500, image: '/bowl1.webp', badge: 'Sale', category: 'home' },
  { id: 8, name: 'Event Banner', price: 25000, image: '/baloon.jpg', category: 'events' },
  { id: 9, name: 'Premium Packaging', price: 18000, image: '/flower5.jpeg', category: 'packaging' },
];

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');

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
  };

  const activeFilters = [
    ...selectedCategories.map(id => ({ type: 'category' as const, id, label: categories.find(c => c.id === id)?.label || '' })),
    ...selectedFunctions.map(id => ({ type: 'function' as const, id, label: functions.find(f => f.id === id)?.label || '' })),
    ...selectedColors.map(id => ({ type: 'color' as const, id, label: colors.find(c => c.id === id)?.label || '' })),
  ];

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

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-gray-900 text-sm tracking-[0.15em] font-bold mb-4">CATEGORY</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleFilter('category', category.id)}
                      className="w-4 h-4 border-gray-400 rounded checked:bg-yellow-600 focus:ring-yellow-600 cursor-pointer"
                    />
                    <span className="text-gray-700 text-sm group-hover:text-yellow-600 transition-colors">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Function Filter */}
            <div className="mb-8">
              <h3 className="text-gray-900 text-sm tracking-[0.15em] font-bold mb-4">FUNCTION</h3>
              <div className="space-y-3">
                {functions.map(func => (
                  <label key={func.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedFunctions.includes(func.id)}
                      onChange={() => toggleFilter('function', func.id)}
                      className="w-4 h-4 border-gray-400 rounded checked:bg-yellow-600 focus:ring-yellow-600 cursor-pointer"
                    />
                    <span className="text-gray-700 text-sm group-hover:text-yellow-600 transition-colors">
                      {func.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-8">
              <h3 className="text-gray-900 text-sm tracking-[0.15em] font-bold mb-4">COLOR</h3>
              <div className="space-y-3">
                {colors.map(color => (
                  <label key={color.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.id)}
                      onChange={() => toggleFilter('color', color.id)}
                      className="w-4 h-4 border-gray-400 rounded checked:bg-yellow-600 focus:ring-yellow-600 cursor-pointer"
                    />
                    <span className="text-gray-700 text-sm group-hover:text-yellow-600 transition-colors">
                      {color.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
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
                        className="inline-flex items-center gap-2 bg-yellow-600 text-black px-3 py-1 rounded text-xs tracking-wider hover:bg-yellow-500 transition-colors"
                      >
                        {filter.label}
                        <X className="w-3 h-3" />
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

            {/* Product Count */}
            <p className="text-gray-600 text-sm mb-6">
              Showing 1-{sampleProducts.length} of {sampleProducts.length} products
            </p>

            {/* Products */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-6'
              }
            >
              {sampleProducts.map((product, index) => (
                <article
                  key={product.id}
                  className="group relative bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  {/* Badge */}
                  {product.badge && (
                    <span
                      className={`absolute top-4 left-4 z-10 px-3 py-1 rounded text-xs font-bold tracking-wider ${
                        product.badge === 'Sale'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-600 text-black'
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="block aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
                      ₦{product.price.toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Added ${product.name} to cart!`);
                      }}
                      className="w-full bg-yellow-600 text-black py-2 text-sm tracking-wider font-bold rounded hover:bg-yellow-500 transition-colors"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-gray-100 text-gray-800 px-8 py-3 text-sm tracking-wider border border-gray-300 rounded hover:bg-yellow-600 hover:text-black hover:border-yellow-600 transition-colors">
                LOAD MORE
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
