// src/components/Categories.jsx

import CategorySection from './CategorySection';

const categories = [
  // IMPORTANT: Ensure these image files are in your /public directory or adjust the path.
  { id: 'fashion', title: 'FASHION', href: '/shop/fashion', image: '/Fashion_image.png', bgPosition: 'center right' },
  { id: 'accessories', title: 'ACCESSORIES', href: '/shop/accessories', image: '/Accessories_image.png', bgPosition: 'center' },
  { id: 'gifts', title: 'GIFTS', href: '/shop/gifts', image: '/Gifts_image.png', bgPosition: 'center' },
  { id: 'packaging', title: 'PACKAGING', href: '/shop/packaging', image: '/Packaging_image.png', bgPosition: 'center' },
  { id: 'home', title: 'HOME', href: '/shop/home', image: '/Home_image.png', bgPosition: 'center' },
  { id: 'events', title: 'EVENTS', href: '/shop/events', image: '/Events_image.png', bgPosition: 'center left' },
];

export default function Categories() {
  return (
    <section className="bg-white" aria-labelledby="categories-title">
      <h2
        id="categories-title"
        // Uses the custom handwritten font for a personalized header
        className="font-handwritten text-5xl sm:text-6xl md:text-7xl text-gray-900 text-center tracking-normal pt-20 pb-16 px-6 font-light"
      >
        Shop Our Curated Collections
      </h2>
      
      {/* Container for the category tiles: uses flex-wrap to stack items on small screens (w-full) 
          and arranges them side-by-side on larger screens (md:w-1/2, lg:w-1/3) */}
      <div className="flex flex-col md:flex-row md:flex-wrap">
        {categories.map((category) => (
          // This div dictates the width of the tile (100% on mobile, 50% on medium, 33.3% on large)
          <div key={category.id} className="w-full md:w-1/2 lg:w-1/3"> 
            <CategorySection
              id={category.id}
              title={category.title}
              image={category.image}
              bgPosition={category.bgPosition}
            />
          </div>
        ))}
      </div>
    </section>
  );
}