// components/Hero.tsx
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Pencil, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen pt-20 flex items-center overflow-hidden bg-white">
      {/* Decorative Background Element */}
      <div className="absolute top-20 right-0 w-1/3 h-full bg-gold-50/50 -z-10" />

      <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">

        {/* LEFT CONTENT: TEXT & CTA (Columns 1-5) */}
        <div className="lg:col-span-5 z-10 space-y-8 text-center lg:text-left order-2 lg:order-1">
          <div className="space-y-2">
            <span className="artistic-note text-xl tracking-wider block animate-fade-in">Curated Collection</span>
            <h1 className="text-7xl md:text-8xl xl:text-9xl font-handwritten text-gray-900 leading-tight">
              Inspired <br />
              <span className="text-gold-500">Living.</span>
            </h1>
          </div>

          <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0 font-sans-serif leading-relaxed">
            Discover a world where every item tells a story. From bespoke fashion to personalized treasures, we bring elegance to your everyday life.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
            <Link
              to="/shop"
              className="group relative px-10 py-4 bg-gray-900 text-white rounded-full overflow-hidden transition-all hover:bg-gold-600 shadow-lg shadow-gray-200"
            >
              <span className="relative z-10 font-sans-serif tracking-widest text-sm uppercase flex items-center gap-2">
                Explore Shop <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link to="/personalize" className="artistic-note text-2xl hover:text-gray-900 transition-colors">
              Personalize Yours →
            </Link>
          </div>

          {/* Micro-links with icons */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100 max-w-sm mx-auto lg:mx-0">
            <Link to="/shop" className="flex items-center gap-3 text-sm text-gray-400 hover:text-gold-600 transition truncate">
              <ShoppingBag className="w-4 h-4" /> New Arrivals
            </Link>
            <Link to="/inspired" className="flex items-center gap-3 text-sm text-gray-400 hover:text-gold-600 transition truncate">
              <Sparkles className="w-4 h-4" /> Lookbook
            </Link>
          </div>
        </div>

        {/* RIGHT CONTENT: ARTISTIC IMAGERY (Columns 6-12) */}
        <div className="lg:col-span-7 relative order-1 lg:order-2">
          <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full max-w-2xl ml-auto">
            {/* Main Image Frame */}
            <div className="absolute inset-0 border-[20px] border-white shadow-premium z-10 rotate-2 translate-x-4 translate-y-4 hidden md:block" />

            <div className="absolute inset-0 overflow-hidden shadow-premium">
              <img
                src="/Hero_background2.png"
                alt="Inspired Lifestyle"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
            </div>

            {/* Floating Artistic Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white p-8 shadow-premium rounded-none hidden md:block z-20 -rotate-3 border border-gray-50">
              <p className="font-handwritten text-4xl text-gray-900 leading-none">
                Handpicked <br />
                <span className="text-gold-500">with love.</span>
              </p>
              <div className="absolute top-0 right-0 p-2">
                <Pencil className="w-4 h-4 text-gold-300" />
              </div>
            </div>

            {/* Background Texture Element */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-gold-100 rounded-full blur-3xl opacity-50 -z-10" />
          </div>
        </div>
      </div>

      {/* Vertical Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-4">
        <span className="text-[10px] tracking-[0.5em] uppercase text-gray-300 vertical-text font-sans-serif">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gray-200 to-transparent" />
      </div>
    </section>
  );
}
