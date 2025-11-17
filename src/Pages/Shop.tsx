import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProducts, Product } from '../firebase/helpers';
import ProductCard from '../components/shop/ProductCard';
import FilterBar from '../components/shop/FilterBar';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  // Filter state from URL
  const search = searchParams.get('search') ?? '';
  const categories = searchParams.getAll('category');
  const functions = searchParams.getAll('function');
  const colors = searchParams.getAll('color');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let data = [...products];
    if (search)
      data = data.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    if (categories.length)
      data = data.filter(p => categories.includes(p.category));
    if (functions.length)
      data = data.filter(p => p.functions.some(f => functions.includes(f)));
    if (colors.length)
      data = data.filter(p => p.colors.some(c => colors.includes(c)));
    setFiltered(data);
  }, [search, categories, functions, colors, products]);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProducts();
    if (res.success) setProducts(res.products);
    else toast.error('Could not load products');
    setLoading(false);
  };

  const handleAddCart = (product: Product, variant?: string) => {
    addItem(product, variant);
    toast.success('Added to cart');
  };

  const updateQuery = (key: string, values: string[]) => {
    const sp = new URLSearchParams(searchParams);
    sp.delete(key);
    values.forEach(v => sp.append(key, v));
    setSearchParams(sp, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif">Shop</h1>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={e => updateQuery('search', e.target.value ? [e.target.value] : [])}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-yellow-600"
            />
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-3">
            <FilterBar
              {...{ categories, functions, colors, updateQuery }}
            />
          </aside>

          <section className="col-span-12 md:col-span-9">
            {loading ? (
              <GridSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onAdd={handleAddCart} />
                ))}
              </div>
            )}
            {!loading && !filtered.length && (
              <p className="text-gray-400 mt-10">No products match your filters.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const GridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(6).fill(0).map((_, i) => (
      <div key={i} className="bg-white/5 animate-pulse rounded-lg h-96" />
    ))}
  </div>
);