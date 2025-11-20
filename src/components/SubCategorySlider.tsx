// src/components/SubCategorySlider.tsx

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
// Import Swiper styling if you use custom CSS for it

import { SubCategory } from '../data/categoryData';

const GOLD_COLOR = 'gold-500'; 

export default function SubCategorySlider({ title, subId, products }: SubCategory) {
  // Determine the base path for filtering (assuming this is used within the main category page)
  const filterPath = `/shop?category=${subId.split('-')[0]}&sub=${subId}`;

  return (
    <div className="w-full py-16 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Sub-Category Title (Handwritten Font) */}
        <h2 className="font-handwritten text-5xl sm:text-6xl text-gray-900 mb-8 text-center">
          {title}
        </h2>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1.5} // Show one full, one half on mobile
          loop={true}
          centeredSlides={false}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
          }}
          className="mySwiper"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <Link to={filterPath} className="block group">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle Gold Border on hover */}
                  <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${GOLD_COLOR} transition-colors duration-300`}></div>
                </div>
                
                {/* Product Info (Clean Sans-Serif) */}
                <div className="text-center mt-4">
                  <p className="font-sans-serif text-sm text-gray-900 tracking-wider uppercase">{product.name}</p>
                  <p className={`font-sans-serif text-xs text-${GOLD_COLOR}`}>${product.price}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            to={filterPath}
            className={`inline-flex items-center text-sm tracking-widest font-sans-serif uppercase 
                        text-gray-900 hover:text-${GOLD_COLOR} transition-colors duration-300`}
          >
            View All {title}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}