import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'home', label: 'Home Decor' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'travel', label: 'Travel' },
  { id: 'art', label: 'Art & Design' },
];

const inspirationPosts = [
  {
    id: 1,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Minimalist Kitchen Design',
    description: 'Discover how to create a sleek and sophisticated kitchen with clean lines and timeless materials.',
    image: '/bed1.jpg',
    link: '#'
  },
  {
    id: 2,
    category: 'Fashion',
    badge: 'Fashion',
    title: 'Urban Chic: Styling for the City',
    description: 'Elevate your everyday look with elevated basics and smart layering for a modern, polished aesthetic.',
    image: '/silk2.jpg',
    link: '#'
  },
  {
    id: 3,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Finding Inner Peace: Mindfulness Practices',
    description: 'Explore simple yet effective mindfulness techniques that bring clarity and calm to your daily routine.',
    image: '/flower1.jpg',
    link: '#'
  },
  {
    id: 4,
    category: 'Travel',
    badge: 'Travel',
    title: 'The Art of Journaling Your Next Journey',
    description: 'Learn to document your adventures in a way that captures the essence of each destination and transition.',
    image: '/white_jewelry1.jpg',
    link: '#'
  },
  {
    id: 5,
    category: 'Art & Design',
    badge: 'Art & Design',
    title: 'A Modern Art Collecting Artisan Expression',
    description: 'Unlock the joy of art collection by learning how to curate pieces that reflect your personal tastes and artistic intention.',
    image: '/baloon.jpg',
    link: '#'
  },
  {
    id: 6,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Revamp Your Cozy Reading Nook',
    description: 'Transform a corner of your home into a cozy sanctuary perfect for unwinding with a good book.',
    image: '/bowl1.webp',
    link: '#'
  },
  {
    id: 7,
    category: 'Lifestyle',
    badge: 'Lifestyle',
    title: 'Nourish Your Body: Healthy Recipe Ideas',
    description: 'Explore nutritious meals that are as delicious as they are nourishing, supporting your wellness and well-being with healthier choices.',
    image: '/flower5.jpeg',
    link: '#'
  },
  {
    id: 8,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Elevate Your Home Office Setup',
    description: 'Design a workspace that promotes productivity and creativity with thoughtfully designed and organized home office.',
    image: '/box1.jpg',
    link: '#'
  },
  {
    id: 9,
    category: 'Fashion',
    badge: 'Fashion',
    title: 'Timeless Accessories: The Power of Gold',
    description: 'Discover how the right accessories can elevate any outfit, from elegant gold statement pieces.',
    image: '/silk3.jpg',
    link: '#'
  },
  {
    id: 10,
    category: 'Lifestyle',
    badge: 'Lifestyle',
    title: 'Outdoor Meditation: Connecting with Nature',
    description: 'Learn the benefits of taking your meditation practice outdoors and how nature can enhance mindfulness.',
    image: '/hero_section2.jpg',
    link: '#'
  },
  {
    id: 11,
    category: 'Home Decor',
    badge: 'Home Decor',
    title: 'Mastering the Art of Table Setting',
    description: 'Impress your guests with elegant table settings that create memorable dining experiences.',
    image: '/bed1.jpg',
    link: '#'
  },
  {
    id: 12,
    category: 'Lifestyle',
    badge: 'Lifestyle',
    title: 'The Ritual of Coffee: A Moment of Calm',
    description: 'Transform your morning coffee into a mindful ritual for a purposeful start to your day.',
    image: '/bowl1.webp',
    link: '#'
  },
];

export default function BeInspired() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = activeCategory === 'all' 
    ? inspirationPosts 
    : inspirationPosts.filter(post => 
        post.category.toLowerCase().replace(' ', '') === activeCategory.toLowerCase().replace(' ', '')
      );

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/bed1.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6" data-aos="fade-up">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Be Inspired</span>
          </nav>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.15em] text-white mb-6">
            BE INSPIRED
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Discover the art of elevated living
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Explore our curated collection, expert styling, and stunning visuals to transform your space and style. Find creative stories and innovative ideas that resonate with your personal aesthetic.
          </p>

          <div className="inline-block" data-aos="zoom-in" data-aos-delay="200">
            <h2 className="text-3xl sm:text-4xl text-white mb-4 font-light">
              Elevate Your Everyday
            </h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              Find beauty in simplicity and design is in the fine details you. From reimagined interiors to curated fashion, discover ideas that reflect your unique tastes.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-yellow-600 text-black px-8 py-3 text-xs tracking-[0.2em] font-bold hover:bg-white transition-colors"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 text-xs tracking-wider border transition-all ${
                activeCategory === category.id
                  ? 'bg-yellow-600 text-black border-yellow-600'
                  : 'bg-transparent text-white border-gray-700 hover:border-yellow-600 hover:text-yellow-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Inspiration Grid */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="group relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              {/* Badge */}
              <span className="absolute top-4 left-4 z-10 bg-yellow-600 text-black px-3 py-1 rounded text-xs font-bold tracking-wider">
                {post.badge}
              </span>

              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-yellow-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {post.description}
                </p>
                <a
                  href={post.link}
                  className="inline-block text-yellow-600 text-sm font-semibold hover:text-white transition-colors"
                >
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-10 py-24 text-center" data-aos="fade-up">
        <h2 className="font-serif text-4xl sm:text-5xl tracking-[0.15em] text-white mb-8">
          Get Inspired? Start Shopping
        </h2>
        <Link
          to="/shop"
          className="inline-block bg-yellow-600 text-black px-12 py-4 text-xs tracking-[0.2em] font-bold hover:bg-white transition-colors"
        >
          SHOP NOW
        </Link>
      </section>
    </div>
  );
}