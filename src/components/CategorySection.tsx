import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CategorySectionProps {
  id: string;
  title: string;
  items: string[];
  image: string;
  bgPosition?: string;
}

export default function CategorySection({ id, title, items, image, bgPosition = 'center' }: CategorySectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-labelledby={`category-${id}`}
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/60 before:via-transparent before:to-transparent before:pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-60"
          style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)' }}
        />

        <div
          className="w-full h-full bg-cover transition-transform duration-700"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: bgPosition,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          role="img"
          aria-label={`${title} category background`}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
      </div>

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

          <ul className="flex flex-col gap-6 mb-10">
            {items.map((item, index) => (
              <li
                key={item}
                className="text-2xl sm:text-3xl text-white italic font-light transition-transform duration-300"
                style={{
                  transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
                }}
                data-aos="fade-up"
                data-aos-delay={300 + (index * 100)}
                data-aos-duration="600"
              >
                {item}
              </li>
            ))}
          </ul>

          <button
            className="inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded-full p-2"
            aria-label={`View ${title} category`}
            data-aos="zoom-in"
            data-aos-delay="500"
          >
            <ChevronRight
              className="w-9 h-9 text-yellow-600 transition-transform duration-500"
              style={{
                transform: isHovered ? 'translateX(30px)' : 'translateX(0)',
              }}
            />
          </button>
        </div>
      </div>
    </article>
  );
}