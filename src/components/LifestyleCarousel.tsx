// src/components/LifestyleCarousel.tsx

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; // Import necessary modules
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// Add any custom Swiper styling to your index.css if needed, e.g., for custom pagination bullets

// Define the type for each slide item
interface CarouselItem {
  id: string;
  image: string;
  alt: string;
  link: string; // URL to an Instagram post, a "Shop the Look" page, or specific product
}

// Data for your carousel slides
const carouselItems: CarouselItem[] = [
  {
    id: 'lifestyle1',
    image: '/lifestyle-carousel-1.png', // ACTION: Replace with your generated image paths
    alt: 'Woman wearing a stylish scarf from Inspire',
    link: '/inspired',
  },
  {
    id: 'lifestyle2',
    image: '/lifestyle-carousel-2.png',
    alt: 'Elegant personalized journal on a desk',
    link: '/inspired',
  },
  {
    id: 'lifestyle3',
    image: '/lifestyle-carousel-3.png',
    alt: 'Luxury gift box arrangement for a special occasion',
    link: '/inspired',
  },
  {
    id: 'lifestyle4',
    image: '/lifestyle-carousel-4.png',
    alt: 'Minimalist bedroom featuring Inspire home decor',
    link: '/inspired',
  },
  {
    id: 'lifestyle5',
    image: '/lifestyle-carousel-5.png',
    alt: 'Flat lay of a beautifully set table with Inspire items',
    link: '/inspired',
  },
];

export default function LifestyleCarousel() {
  return (
    <section className="bg-cream-100 py-24 lg:py-40 overflow-hidden" aria-labelledby="lifestyle-carousel-title">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">

        {/* Section Header: Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
          <div className="lg:col-span-8" data-aos="fade-right">
            <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-4 block">Shared Perspectives</span>
            <h2 id="lifestyle-carousel-title"
              className="font-serif text-6xl sm:text-7xl md:text-8xl text-gray-900 tracking-tighter leading-none">
              Social <span className="italic">Narrative.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right" data-aos="fade-left">
            <p className="font-sans-serif text-sm text-gray-500 max-w-sm ml-auto mb-8 leading-relaxed italic border-r-2 border-gold-100 pr-6 hidden lg:block">
              A curated collection of shared moments from our collective archive. Tag your acquisition with #InspireYourLife.
            </p>
            <Link to="/inspired" className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase text-gray-900 hover:text-gold-600 transition-colors group">
              View The Full Archive <div className="w-8 h-px bg-gray-900 group-hover:bg-gold-600 group-hover:w-16 transition-all duration-500" />
            </Link>
          </div>
        </div>

        {/* Swiper Carousel */}
        <div data-aos="fade-up" data-aos-delay="200">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1.2}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 50 },
              1280: { slidesPerView: 3, spaceBetween: 60 },
            }}
            className="mySwiper w-full !overflow-visible"
          >
            {carouselItems.map((item) => (
              <SwiperSlide key={item.id}>
                <Link to={item.link} className="block group relative overflow-hidden bg-white p-4 shadow-premium transition-transform duration-700 hover:-translate-y-4">
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-all duration-[2000ms] ease-out group-hover:scale-110 group-hover:grayscale-[50%]"
                    />
                    {/* Editorial Overlay */}
                    <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/20 transition-all duration-700" />
                  </div>

                  <div className="mt-6 flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-gold-600 font-bold mb-1">Archive Entry</p>
                      <p className="text-sm font-serif italic text-gray-900 line-clamp-1">{item.alt}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
