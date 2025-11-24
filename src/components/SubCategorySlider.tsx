// src/components/SubCategorySlider.tsx (FULL AND CORRECTED)

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import { Product } from '../firebase/helpers'; 

interface SliderProps {
 title: string;
 subId: string;
 products: Product[];
}

const GOLD_COLOR_TEXT = 'text-yellow-600'; 
const GOLD_COLOR_BORDER = 'border-yellow-600'; 
const GOLD_COLOR_HOVER_TEXT = 'hover:text-yellow-600';
const GOLD_COLOR_HOVER_BORDER = 'hover:border-yellow-600';

export default function SubCategorySlider({ title, subId, products }: SliderProps) { 
  let filterPath = `/shop`; 
  if (typeof subId === 'string' && subId.includes('-')) {
    const mainCatId = subId.split('-')[0];
    const subCatId = subId.split('-').pop();
    filterPath = `/shop?category=${mainCatId}&sub=${subCatId}`;
  }

  return (
    <div className="w-full py-16 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <h2 className="font-handwritten text-5xl sm:text-6xl text-gray-900 mb-8 text-center">
          {title}
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1.5} 
          loop={true}
          centeredSlides={false}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
          }}
          className="mySwiper"
        >
          {products.map((product: Product) => ( 
            <SwiperSlide key={product.id}>
              <Link to={`/product/${product.id}`} className="block group"> 
                <div className="relative overflow-hidden">
                <img
                  // 💡 FIX APPLIED HERE: Using product.images[0]
                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle Gold Border on hover */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:${GOLD_COLOR_BORDER} transition-colors duration-300`}></div>
                </div>

                {/* Product Info (Clean Sans-Serif) */}
                <div className="text-center mt-4">
                <p className="font-sans-serif text-sm text-gray-900 tracking-wider uppercase">{product.name}</p>
                <p className={`font-sans-serif text-xs ${GOLD_COLOR_TEXT}`}>₦{product.price}</p> 
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
                        text-gray-900 ${GOLD_COLOR_HOVER_TEXT} transition-colors duration-300`}
          >
            View All {title}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}