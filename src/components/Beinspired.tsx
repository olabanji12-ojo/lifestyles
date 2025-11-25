// src/pages/BeInspired.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, LayoutList, ChevronRight } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product } from '../firebase/helpers'; // Assuming Product type is available

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  heroImage: string;
  category: string;
  createdAt?: any;
  // Assuming relatedProducts is a list of product IDs/data
  relatedProducts?: Product[]; 
};

// Placeholder for a detailed Article Card component
const InspirationCard = ({ post }: { post: Post }) => (
    <article
        key={post.id}
        className="group relative bg-white border-b-2 border-gray-100 hover:border-yellow-600 transition-all duration-300"
    >
        <Link to={`/inspired/${post.slug}`} className="block">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={post.heroImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                <span className="absolute bottom-4 right-4 bg-gray-900 text-white px-4 py-1.5 text-xs font-bold tracking-wider uppercase shadow-xl">
                    {post.category}
                </span>
            </div>
            {/* Content Section */}
            <div className="p-6 bg-[#FAF9F6]">
                <h3 className="font-serif text-3xl text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.description}
                </p>
                <span
                    className="inline-flex items-center gap-2 text-yellow-600 text-sm font-semibold tracking-wide hover:text-gray-900 transition-colors uppercase"
                >
                    Read Story <ChevronRight className="w-4 h-4" />
                </span>
            </div>
        </Link>
    </article>
);


export default function BeInspired() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCat, setActiveCat] = useState<'all' | string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, 'gallery_posts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
        setPosts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects' },
    ...[...new Set(posts.map((p) => p.category))].map((c) => ({ id: c, label: c })),
  ];

  const filtered = activeCat === 'all' ? posts : posts.filter((p) => p.category === activeCat);

  if (loading)
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="text-gray-500 flex items-center gap-2">
            <LayoutList className="w-5 h-5 animate-pulse" /> Loading inspiration…
        </div>
      </div>
    );

  return (
    <div className="bg-white pt-20">
      
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{ 
            backgroundImage: 'url(/bed1.jpg)', // Use your image path
            transform: 'scale(1.05)', // Gentle zoom effect
          }}
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-20 text-white">
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-200 mb-8">
            <Link to="/" className="hover:text-yellow-400 transition flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <span>/</span>
            <span className="text-yellow-400 font-medium">Be Inspired</span>
          </nav>
          <h1 className="font-serif text-7xl sm:text-8xl md:text-9xl tracking-[0.2em] mb-6 leading-none">
            GALLERY
          </h1>
          <p className="font-handwritten text-3xl sm:text-4xl text-yellow-400 mb-10">
            A Curated Visual Experience
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-yellow-600 text-white px-10 py-4 text-sm tracking-[0.3em] font-bold hover:bg-gray-900 transition-all duration-300 uppercase shadow-lg"
          >
            Explore Collections <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-2 text-xs tracking-widest font-semibold border-2 rounded-full transition-all uppercase ${
                activeCat === cat.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-yellow-600 hover:text-yellow-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Inspiration Grid */}
      <section className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <InspirationCard key={post.id} post={post} />
          ))}
        </div>
        {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500 font-serif text-2xl">
                No articles found in this category.
            </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#FAF9F6] py-32 text-center border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-4xl sm:text-5xl tracking-[0.15em] text-gray-900 mb-8">
            Start Your Own Project
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-10">
            Feeling inspired? Whether you saw something you love or have a brand new idea, let's bring it to life.
          </p>
          <Link
            to="/personalize"
            className="inline-flex items-center gap-4 bg-yellow-600 text-white px-12 py-4 text-sm tracking-[0.3em] font-bold hover:bg-gray-900 transition-all duration-300 uppercase shadow-xl"
          >
            Submit Custom Request <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}