import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config'; // ← your Firestore instance

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  heroImage: string;
  category: string;
  createdAt?: any;
};

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
    { id: 'all', label: 'All Categories' },
    ...[...new Set(posts.map((p) => p.category))].map((c) => ({ id: c, label: c })),
  ];

  const filtered = activeCat === 'all' ? posts : posts.filter((p) => p.category === activeCat);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading inspiration…</div>
      </div>
    );

  return (
    <div className="bg-white pt-20">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{ backgroundImage: 'url(/bed1.jpg)' }}
        />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-20">
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-600 mb-8">
            <Link to="/" className="hover:text-yellow-600 transition flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <span>/</span>
            <span className="text-yellow-600 font-medium">Be Inspired</span>
          </nav>
          <h1 className="font-serif text-6xl sm:text-7xl md:text-9xl tracking-[0.2em] text-gray-900 mb-8 leading-tight">
            BE INSPIRED
          </h1>
          <p className="text-2xl text-gray-700 mb-6 font-light">Discover the art of elevated living</p>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
            Explore curated stories, mood boards, and aesthetic collections that help you visualize our products in your world.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-yellow-600 text-white px-10 py-4 text-sm tracking-[0.3em] font-bold hover:bg-gray-900 transition-all duration-300 uppercase shadow-lg hover:shadow-xl"
          >
            Explore Collections <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-screen-xl mx-auto px-6 py-20 bg-gray-50">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-8 py-3 text-xs tracking-widest font-medium border-2 transition-all ${
                activeCat === cat.id
                  ? 'bg-yellow-600 text-white border-yellow-600 shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-yellow-600 hover:text-yellow-600 shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Inspiration Grid */}
      <section className="max-w-screen-xl mx-auto px-6 py-24 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((post) => (
            <article
              key={post.id}
              className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-yellow-600 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <span className="absolute top-6 left-6 bg-yellow-600 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider shadow-lg">
                  {post.category}
                </span>
              </div>
              <div className="p-8 bg-white">
                <h3 className="text-2xl text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors" style={{ fontFamily: 'Dancing Script, cursive' }}>
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{post.description}</p>
                <Link
                  to={`/inspired/${post.slug}`}
                  className="inline-flex items-center gap-2 text-yellow-600 text-sm font-semibold hover:text-gray-900 transition-colors"
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.15em] text-gray-900 mb-10">
            Get Inspired? Start Shopping
          </h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-4 bg-yellow-600 text-white px-16 py-5 text-sm tracking-[0.3em] font-bold hover:bg-gray-900 transition-all duration-300 uppercase shadow-xl hover:shadow-2xl"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}