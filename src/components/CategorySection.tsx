import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  id: string;
  title: string;
  items: string[];
  image: string;
  bgPosition?: string;
}

export default function CategorySection({
  id,
  title,
  items,
  image,
  bgPosition = 'center',
}: CategorySectionProps) {
  return (
    <article
      className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden group"
      aria-labelledby={`category-${id}`}
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Background & gradient overlays */}
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/60 before:via-transparent before:to-transparent before:pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-60"
          style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)' }}
        />

        <div
          className="w-full h-full bg-cover transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: bgPosition,
          }}
          role="img"
          aria-label={`${title} category background`}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 sm:px-10 flex justify-end">
        <div
          className="text-center max-w-md bg-black/20 backdrop-blur-sm p-8 rounded-lg"
          data-aos="fade-left"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          <h3
            id={`category-${id}`}
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-yellow-600 tracking-[0.15em] mb-8"
          >
            {title}
          </h3>

          {/* List – always visible */}
          <ul className="flex flex-col gap-6 mb-10">
            {items.map((item, index) => (
              <li
                key={item}
                className="text-2xl sm:text-3xl text-white font-light"
                style={{
                  fontFamily: 'Dancing Script, cursive',
                  animation: `fadeIn 0.5s ease ${index * 50}ms both`,
                }}
              >
                {item}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            className="inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded-full p-2 mt-4"
            aria-label={`View all ${title} products`}
            data-aos="zoom-in"
            data-aos-delay="500"
          >
            <ChevronRight className="w-9 h-9 text-yellow-600 transition-transform duration-500 group-hover:translate-x-[30px]" />
          </button>
        </div>
      </div>

      {/* Quick keyframe for the staggered fade-in */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </article>
  );
}