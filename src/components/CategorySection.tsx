// src/components/CategorySection.jsx (FINALIZED)

import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD_COLOR = 'gold-500'; 

interface CategorySectionProps {
  id: string;
  title: string;
  image: string;
  bgPosition?: string;
  // PROP CHANGE: Added linkHref to the interface
  linkHref: string;
}

export default function CategorySection({
  id,
  title,
  image,
  bgPosition = 'center',
  // PROP CHANGE: Destructured linkHref
  linkHref,
}: CategorySectionProps) {
  return (
    <Link 
      // IMPLEMENTATION CHANGE: Using linkHref for the destination
      to={linkHref} 
      className="relative h-[60vh] flex items-center justify-center overflow-hidden group transition-shadow duration-300 hover:shadow-2xl"
      aria-label={`Go to ${title} collection`}
    >
      
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})`, backgroundPosition: bgPosition }}
          role="img"
          aria-label={`${title} category background`}
        />
        {/* Subtle Darkening Overlay for contrast */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-opacity" />
      </div>

      {/* Content Overlay - Centered Text */}
      <div className="relative z-10 w-full text-center p-4">
        
        {/* Main Title - Uses handwritten font, large size, and text-shadow-lg for contrast */}
        <h3 
          id={`category-${id}`}
          className={`font-handwritten text-6xl sm:text-7xl md:text-8xl text-white tracking-normal uppercase text-shadow-lg transition-colors duration-300 group-hover:text-${GOLD_COLOR}`}
        >
          {title}
        </h3>
        
        {/* Subtle CTA Indicator - Sans-serif, gold accent */}
        <p className={`mt-4 text-xl font-sans-serif text-${GOLD_COLOR} tracking-wider uppercase text-shadow-lg transition-colors duration-300 group-hover:text-white`}>
            Discover Collection
            <ChevronRight 
                className={`w-6 h-6 text-${GOLD_COLOR} inline-block ml-2 transition-transform duration-500 group-hover:translate-x-1`} 
            />
        </p>
      </div>
    </Link>
  );
}