// src/pages/Shop.tsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Grid, List, X, Loader2, ShoppingBag, SlidersHorizontal, ArrowRight } from 'lucide-react'; // Added ArrowRight for list item link
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

// --- Product Card Component (for Grid View) ---
interface ProductCardProps {
    product: Product;
    isOutOfStock: (product: Product) => boolean;
    getProductPrice: (product: Product) => string;
    handleAddToCart: (product: Product) => Promise<void>;
    index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isOutOfStock, getProductPrice, handleAddToCart, index }) => {
    const outOfStock = isOutOfStock(product);
    return (
        <article
            key={product.id}
            className="group relative bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
            data-aos="fade-up"
            data-aos-delay={index * 50}
        >
            {/* Out of Stock Badge */}
            {outOfStock && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded text-xs font-bold tracking-wider bg-gray-500 text-white">
                    OUT OF STOCK
                </span>
            )}

            {/* Featured Badge */}
            {product.featured && !outOfStock && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[8px] font-bold tracking-[0.2em] bg-gold-600 text-white uppercase">
                    Archive Select
                </span>
            )}

            {/* Image */}
            <Link to={`/product/${product.id}`} className="block aspect-square bg-gray-100 overflow-hidden">
                {product.images && product.images[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${outOfStock ? 'opacity-50' : ''
                            }`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="w-16 h-16 text-gray-400" />
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="p-6 text-center">
                <Link
                    to={`/product/${product.id}`}
                    className="text-gray-900 text-sm font-bold uppercase tracking-widest mb-2 block hover:text-gold-600 transition-colors"
                >
                    {product.name}
                </Link>
                <p className="text-gold-600 text-xs font-bold tracking-widest uppercase mb-4">
                    {getProductPrice(product)}
                </p>
                <button
                    onClick={() => handleAddToCart(product)}
                    disabled={outOfStock}
                    className={`w-full py-4 text-[10px] tracking-[0.3em] font-bold uppercase transition-all shadow-soft ${outOfStock
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'bg-white border border-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white'
                        }`}
                >
                    {outOfStock ? 'Exhausted' : 'Acquire'}
                </button>
            </div>
        </article>
    );
}
// --- END OF ProductCard ---


// --- Product List Item Component (for List View) ---
const ProductListItem: React.FC<ProductCardProps> = ({ product, isOutOfStock, getProductPrice, handleAddToCart, index }) => {
    const outOfStock = isOutOfStock(product);
    return (
        <article
            key={product.id}
            className="flex flex-col sm:flex-row bg-white border border-gray-50 shadow-soft overflow-hidden group"
            data-aos="fade-up"
            data-aos-delay={index * 50}
        >
            {/* Image */}
            <Link to={`/product/${product.id}`} className="block w-full sm:w-64 flex-shrink-0 aspect-[4/3] sm:aspect-square bg-gray-50 overflow-hidden relative">
                {/* Badges in List View */}
                {outOfStock ? (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[8px] font-bold tracking-[0.2em] bg-gray-100 text-gray-400 uppercase">
                        Exhausted
                    </span>
                ) : product.featured && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[8px] font-bold tracking-[0.2em] bg-gold-600 text-white uppercase">
                        Archive Select
                    </span>
                )}

                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ${outOfStock ? 'opacity-50' : ''}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <ShoppingBag className="w-12 h-12 text-gray-200" />
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="p-8 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest block mb-1">{product.category}</span>
                            <Link
                                to={`/product/${product.id}`}
                                className="text-gray-900 text-2xl font-serif tracking-tight hover:text-gold-600 transition-colors"
                            >
                                {product.name}
                            </Link>
                        </div>
                        <p className="text-xl font-serif italic text-gray-900">
                            {getProductPrice(product)}
                        </p>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 italic font-sans-serif">{product.description}</p>
                </div>

                <div className="flex items-center gap-6 mt-auto">
                    <button
                        onClick={() => handleAddToCart(product)}
                        disabled={outOfStock}
                        className={`px-8 py-4 text-[10px] tracking-[0.3em] font-bold uppercase transition-all shadow-soft ${outOfStock
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gold-600'
                            }`}
                    >
                        {outOfStock ? 'Exhausted' : 'Acquire Piece'}
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="flex items-center gap-2 text-[10px] text-gold-600 uppercase tracking-widest font-bold hover:text-gray-900 transition-colors"
                    >
                        View Narrative <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
// --- END OF ProductListItem ---


// --- Product Skeleton ---
const ProductSkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
    if (viewMode === 'list') {
        return (
            <div className="flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden shadow animate-pulse">
                {/* Image Skeleton */}
                <div className="block w-full sm:w-48 flex-shrink-0 aspect-video sm:aspect-square bg-gray-300"></div>

                {/* Info Skeleton */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        {/* Product Name Skeleton */}
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                        {/* Description Skeleton */}
                        <div className="space-y-2 mb-4">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                        {/* Price Skeleton */}
                        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="w-32 h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Grid View Skeleton
    return (
        <div className="group relative bg-white rounded-lg overflow-hidden shadow animate-pulse">
            {/* Image Skeleton */}
            <div className="block aspect-square bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-gray-300"></div>
            </div>

            {/* Info Skeleton */}
            <div className="p-4">
                {/* Product Name Skeleton */}
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>

                {/* Price Skeleton */}
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>

                {/* Button Skeleton */}
                <div className="w-full h-10 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
// --- END OF ProductSkeleton ---

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
                    className="w-full bg-white border border-gray-300 rounded pl-10 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600"
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-600"
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
                // Only reset priceRange if it was at the default maximum
                if (priceRange[1] === 1000000) {
                    setPriceRange([0, max]);
                } else {
                    // Adjust the current max price if the new max is lower
                    setPriceRange(prev => [prev[0], Math.min(prev[1], max)]);
                }
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
    const getProductPrice = (product: Product): string => {
        if (product.hasVariants && product.variants && product.variants.length > 0) {
            const minPrice = Math.min(...product.variants.map(v => v.price));
            return `From ₦${minPrice.toLocaleString()}`;
        }
        return `₦${(product.price || 0).toLocaleString()}`;
    };

    // Helper to check stock
    const isOutOfStock = (product: Product): boolean => {
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

        // For simplicity on the shop page, we only allow adding products without variants 
        // directly to the cart, or navigate to the product page if variants exist.
        if (product.hasVariants) {
            toast('Please select a variant on the product page', { icon: 'ℹ️' });
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
            toast.success(`${product.name} added to cart!`);
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
        <div className="min-h-screen bg-cream-100 text-gray-900 pt-24">
            <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
                {/* Breadcrumb */}
                <nav className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-12 flex items-center gap-2" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-gold-600 transition-colors">Archive</Link>
                    <span className="text-gray-200">/</span>
                    <span className="text-gray-900 font-medium">Archives</span>
                </nav>

                {/* Page Title */}
                <div className="text-center mb-16" data-aos="fade-down">
                    <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-4 block">The Collection</span>
                    <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl tracking-tight text-gray-900">Archive</h1>
                </div>

                {/* Mobile Filter Toggle Button (Visible on small screens, hidden on lg screens and up) */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gold-600 transition-colors shadow-premium"
                        aria-expanded={mobileFiltersOpen}
                        aria-controls="mobile-filter-drawer"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Refine Archive
                        {activeFilterCount > 0 && (
                            <span className="ml-2 bg-gold-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold">
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
                                className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-[#FAF9F6] z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto p-6 ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
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
                                {activeFilters.length > 0 || searchQuery || priceRange[1] < maxPriceLimit || selectedSubCategories.length > 0 ? (
                                    <>
                                        <span className="text-gray-600 text-xs tracking-wider">Active Filters:</span>
                                        {/* Display Category, Function, and Color filters */}
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
                                        {/* Display Price filter as a pill */}
                                        {priceRange[1] < maxPriceLimit && (
                                            <button
                                                onClick={() => setPriceRange([0, maxPriceLimit])}
                                                className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs tracking-wider hover:bg-red-50 transition-colors"
                                            >
                                                Price: Up to ₦{priceRange[1].toLocaleString()}
                                                <X className="w-3 h-3 text-gray-500" />
                                            </button>
                                        )}
                                        {/* Display Search filter as a pill */}
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs tracking-wider hover:bg-red-50 transition-colors"
                                            >
                                                Search: {searchQuery}
                                                <X className="w-3 h-3 text-gray-500" />
                                            </button>
                                        )}
                                        {/* Display Subcategory filter (placeholder logic for complex ID handling) */}
                                        {selectedSubCategories.map(subCatId => (
                                            <button
                                                key={`subCat-${subCatId}`}
                                                onClick={() => setSelectedSubCategories(prev => prev.filter(id => id !== subCatId))}
                                                className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs tracking-wider hover:bg-red-50 transition-colors"
                                            >
                                                Subcategory: {subCatId.split('-').pop()}
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
                                ) : (
                                    <span className="text-gray-500 text-sm">All products shown.</span>
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
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                                        : 'flex flex-col gap-6'
                                }
                            >
                                {Array.from({ length: productsPerPage }).map((_, index) => (
                                    <ProductSkeleton key={index} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                                <p className="text-gray-600 text-lg mb-2">No products found</p>
                                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-gray-900 text-white px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gold-600 transition shadow-premium"
                                >
                                    Reset Selection
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
                                            : 'flex flex-col gap-6' // List view uses flex-col for stacked items
                                    }
                                >
                                    {currentProducts.map((product, index) => (
                                        viewMode === 'grid' ? (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                isOutOfStock={isOutOfStock}
                                                getProductPrice={getProductPrice}
                                                handleAddToCart={handleAddToCart}
                                                index={index}
                                            />
                                        ) : (
                                            <ProductListItem
                                                key={product.id}
                                                product={product}
                                                isOutOfStock={isOutOfStock}
                                                getProductPrice={getProductPrice}
                                                handleAddToCart={handleAddToCart}
                                                index={index}
                                            />
                                        )
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

                                                const showEllipsisStart = pageNum === currentPage - 2 && currentPage > 3;
                                                const showEllipsisEnd = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                                                if (showEllipsisStart) {
                                                    // This handles the ellipsis between page 1 and the current block
                                                    if (currentPage > 3) return <span key={`ellip-start`} className="px-2 py-2 text-gray-500">...</span>;
                                                    return null;
                                                }
                                                if (showEllipsisEnd) {
                                                    // This handles the ellipsis between the current block and the last page
                                                    if (currentPage < totalPages - 2) return <span key={`ellip-end`} className="px-2 py-2 text-gray-500">...</span>;
                                                    return null;
                                                }

                                                if (!showPage) return null;

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-4 py-2 font-serif transition-colors ${currentPage === pageNum
                                                            ? 'text-gold-600 underline underline-offset-8 font-bold'
                                                            : 'text-gray-400 hover:text-gray-900'
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