import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'home', label: 'Home Decor' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'travel', label: 'Travel' },
  { id: 'art', label: 'Art & Design' },
] as const;

const inspirationPosts = [
  {
    id: 1,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Minimalist Kitchen Design',
    description: 'Discover how to create a sleek and sophisticated kitchen with clean lines and timeless materials.',
    image: '/bed1.jpg',
    link: '/inspired/minimalist-kitchen'
  },
  {
    id: 2,
    category: 'Fashion',
    badge: 'Fashion',
    title: 'Urban Chic: Styling for the City',
    description: 'Elevate your everyday look with elevated basics and smart layering for a modern, polished aesthetic.',
    image: '/silk2.jpg',
    link: '/inspired/urban-chic'
  },
  {
    id: 3,
    category: 'Lifestyle',
    badge: 'Lifestyle',
    title: 'Finding Inner Peace: Mindfulness Practices',
    description: 'Explore simple yet effective mindfulness techniques that bring clarity and calm to your daily routine.',
    image: '/flower1.jpg',
    link: '/inspired/mindfulness'
  },
  {
    id: 4,
    category: 'Travel',
    badge: 'Travel',
    title: 'The Art of Journaling Your Next Journey',
    description: 'Learn to document your adventures in a way that captures the essence of each destination.',
    image: '/white_jewelry1.jpg',
    link: '/inspired/travel-journal'
  },
  {
    id: 5,
    category: 'Art & Design',
    badge: 'Art & Design',
    title: 'A Modern Art Collecting Artisan Expression',
    description: 'Unlock the joy of art collection by learning how to curate pieces that reflect your personal tastes.',
    image: '/baloon.jpg',
    link: '/inspired/art-collecting'
  },
  {
    id: 6,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Revamp Your Cozy Reading Nook',
    description: 'Transform a corner of your home into a cozy sanctuary perfect for unwinding with a good book.',
    image: '/bowl1.webp',
    link: '/inspired/reading-nook'
  },
  {
    id: 7,
    category: 'Lifestyle',
    badge: 'Lifestyle',
    title: 'Nourish Your Body: Healthy Recipe Ideas',
    description: 'Explore nutritious meals that are as delicious as they are nourishing.',
    image: '/flower5.jpeg',
    link: '/inspired/healthy-recipes'
  },
  {
    id: 8,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Elevate Your Home Office Setup',
    description: 'Design a workspace that promotes productivity and creativity.',
    image: '/box1.jpg',
    link: '/inspired/home-office'
  },
  {
    id: 9,
    category: 'Fashion',
    badge: 'Fashion',
    title: 'Timeless Accessories: The Power of Gold',
    description: 'Discover how the right accessories can elevate any outfit.',
    image: '/silk3.jpg',
    link: '/inspired/gold-accessories'
  },
  {
    id: 10,
    category: 'Lifestyle',
    badge: 'Lifestyle',
    title: 'Outdoor Meditation: Connecting with Nature',
    description: 'Learn the benefits of taking your meditation practice outdoors.',
    image: '/hero_section2.jpg',
    link: '/inspired/outdoor-meditation'
  },
  {
    id: 11,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Mastering the Art of Table Setting',
    description: 'Impress your guests with elegant table settings that create memorable dining experiences.',
    image: '/bed1.jpg',
    link: '/inspired/table-setting'
  },
  {
    id: 12,
    category: 'Lifestyle',
    badge: 'Lifestyle',
    title: 'The Ritual of Coffee: A Moment of Calm',
    description: 'Transform your morning coffee into a mindful ritual.',
    image: '/bowl1.webp',
    link: '/inspired/coffee-ritual'
  },
];

export default function BeInspired() {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all');

  const filteredPosts = activeCategory === 'all'
    ? inspirationPosts
    : inspirationPosts.filter(post =>
        post.category.toLowerCase().replace(/[^a-z]/g, '') === activeCategory
      );

  return (
    <div className="bg-white pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
            backgroundImage: 'url(/bed1.jpg)',
        }}
        />


        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-20">
          {/* Breadcrumb */}
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-600 mb-8" data-aos="fade-down">
            <Link to="/" className="hover:text-yellow-600 transition flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <span>/</span>
            <span className="text-yellow-600 font-medium">Be Inspired</span>
          </nav>

          <h1 
            className="font-serif text-6xl sm:text-7xl md:text-9xl tracking-[0.2em] text-gray-900 mb-8 leading-tight"
            data-aos="fade-up"
          >
            BE INSPIRED
          </h1>

          <p className="text-2xl text-gray-700 mb-6 font-light" data-aos="fade-up" data-aos-delay="100">
            Discover the art of elevated living
          </p>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            Explore curated stories, mood boards, and aesthetic collections that help you visualize 
            our products in your world. From minimalist interiors to intentional fashion — 
            find inspiration that speaks to your soul.
          </p>

          <div className="space-y-6" data-aos="fade-up" data-aos-delay="300">
            <p className="text-4xl font-light text-gray-900" style={{ fontFamily: 'Dancing Script, cursive' }}>
              Elevate Your Everyday
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Beauty lives in the details. Let us show you how small touches create transformative spaces and styles.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-yellow-600 text-white px-10 py-4 text-sm tracking-[0.3em] font-bold hover:bg-gray-900 transition-all duration-300 uppercase shadow-lg hover:shadow-xl"
            >
              Explore Collections <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-screen-xl mx-auto px-6 py-20 bg-gray-50">
        <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-8 py-3 text-xs tracking-widest font-medium transition-all duration-300 border-2 ${
                activeCategory === category.id
                  ? 'bg-yellow-600 text-white border-yellow-600 shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-yellow-600 hover:text-yellow-600 shadow-sm'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Inspiration Grid */}
      <section className="max-w-screen-xl mx-auto px-6 py-24 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-yellow-600 hover:shadow-2xl transition-all duration-500"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="absolute top-6 left-6 z-10 bg-yellow-600 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider shadow-lg">
                  {post.badge}
                </span>
              </div>

              <div className="p-8 bg-white">
                <h3 
                  className="text-2xl text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors"
                  style={{ fontFamily: 'Dancing Script, cursive' }}
                >
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.description}
                </p>
                <Link
                  to={post.link}
                  className="inline-flex items-center gap-2 text-yellow-600 text-sm font-semibold hover:text-gray-900 transition-colors"
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 
            className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.15em] text-gray-900 mb-10"
            data-aos="fade-up"
          >
            Get Inspired? Start Shopping
          </h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-4 bg-yellow-600 text-white px-16 py-5 text-sm tracking-[0.3em] font-bold hover:bg-gray-900 transition-all duration-300 uppercase shadow-xl hover:shadow-2xl"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}