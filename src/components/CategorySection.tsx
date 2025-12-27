// src/components/CategorySection.tsx
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategorySectionProps {
  id: string;
  title: string;
  image: string;
  bgPosition?: string;
  linkHref: string;
  className?: string; // Added className for flexible grid positioning
}

export default function CategorySection({
  id,
  title,
  image,
  bgPosition = 'center',
  linkHref,
  className = "",
}: CategorySectionProps) {
  return (
    <Link
      to={linkHref}
      className={`relative h-[60vh] flex items-center justify-center overflow-hidden group transition-all duration-500 shadow-soft hover:shadow-premium ${className}`}
      aria-label={`Go to ${title} collection`}
    >

      {/* Background Image Container */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})`, backgroundPosition: bgPosition }}
          role="img"
          aria-label={`${title} category background`}
        />
        {/* Artistic Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full text-center p-8">
        <span className="artistic-note text-white text-xl mb-2 block opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          Discover
        </span>

        <h3
          id={`category-${id}`}
          className="font-handwritten text-6xl sm:text-7xl md:text-8xl text-white tracking-normal uppercase text-shadow-lg transition-all duration-500 group-hover:scale-105"
        >
          {title}
        </h3>

        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="w-12 h-px bg-gold-400 group-hover:w-24 transition-all duration-500" />
          <p className="text-sm font-sans-serif text-white tracking-[0.3em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
            Shop the Look
          </p>
        </div>

        {/* Floating Detail Button (Bottom Corner) */}
        <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white group-hover:bg-gold-500 group-hover:scale-110 transition-all duration-500">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}
