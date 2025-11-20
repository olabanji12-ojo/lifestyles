// src/components/LifestyleCarousel.tsx

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; // Import necessary modules
import { Link } from 'react-router-dom';

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
    link: '/shop/accessories?product=silk-scarf-collection',
  },
  {
    id: 'lifestyle2',
    image: '/lifestyle-carousel-2.png',
    alt: 'Elegant personalized journal on a desk',
    link: '/personalize?product=elegant-journal',
  },
  {
    id: 'lifestyle3',
    image: '/lifestyle-carousel-3.png',
    alt: 'Luxury gift box arrangement for a special occasion',
    link: '/shop/gifts?product=luxury-gift-set',
  },
  {
    id: 'lifestyle4',
    image: '/lifestyle-carousel-4.png',
    alt: 'Minimalist bedroom featuring Inspire home decor',
    link: '/shop/home?product=linen-bedding-set',
  },
  {
    id: 'lifestyle5',
    image: '/lifestyle-carousel-5.png',
    alt: 'Flat lay of a beautifully set table with Inspire items',
    link: '/shop/events?product=tableware-collection',
  },
];

export default function LifestyleCarousel() {
  return (
    <section className="bg-white py-20 lg:py-32" aria-labelledby="lifestyle-carousel-title">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 id="lifestyle-carousel-title" 
              className="font-handwritten text-5xl sm:text-6xl text-gray-900 mb-4">
            #InspireYourLife
          </h2>
          <p className="font-sans-serif text-lg text-gray-700 max-w-2xl mx-auto">
            Discover how our community styles and celebrates with Inspire. 
            Tag us to be featured!
          </p>
          <Link to="/gallery" className="inline-block mt-6 px-8 py-3 border-2 border-gray-900 bg-gray-900 text-white text-sm tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-gold-500 hover:border-gold-500">
            View Our Gallery
          </Link>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination, Autoplay]} // Enable Pagination and Autoplay
          spaceBetween={30} // Space between slides
          slidesPerView={1} // Show 1 slide on mobile
          centeredSlides={true} // Center the active slide
          loop={true} // Infinite loop
          autoplay={{
            delay: 4000, // 4 seconds delay
            disableOnInteraction: false, // Keep autoplaying even after user interaction
          }}
          pagination={{ 
            clickable: true, 
            dynamicBullets: true // A nice visual effect for pagination
          }} 
          breakpoints={{
            // When window width is >= 768px (md)
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            // When window width is >= 1024px (lg)
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          className="mySwiper w-full" // Apply width to Swiper container
        >
          {carouselItems.map((item) => (
            <SwiperSlide key={item.id} className="p-2"> {/* Add some padding around each slide */}
              <Link to={item.link} className="block group relative overflow-hidden rounded-lg shadow-xl">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-sans-serif tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.alt}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}