// src/components/Categories.jsx (UPDATED DATA)

import CategorySection from './CategorySection';

const categories = [
  
  { id: 'fashion', title: 'FASHION', href: '/category/fashion', image: '/Fashion_image.png', bgPosition: 'center right' },
  { id: 'accessories', title: 'ACCESSORIES', href: '/category/accessories', image: '/Accessories_image.png', bgPosition: 'center' },
  { id: 'gifts', title: 'GIFTS', href: '/category/gifts', image: '/Gifts_image.png', bgPosition: 'center' },
  { id: 'packaging', title: 'PACKAGING', href: '/category/packaging', image: '/Packaging_image.png', bgPosition: 'center' },
  { id: 'home', title: 'HOME', href: '/category/home', image: '/Home_image.png', bgPosition: 'center' },
  { id: 'events', title: 'EVENTS', href: '/category/events', image: '/Events_image.png', bgPosition: 'center left' },
  
];

export default function Categories() {
  return (
    <section className="bg-white" aria-labelledby="categories-title">
      {/* ... h2 tag ... */}
      <div className="flex flex-col md:flex-row md:flex-wrap">
        {categories.map((category) => (
          <div key={category.id} className="w-full md:w-1/2 lg:w-1/3"> 
            <CategorySection
              id={category.id}
              title={category.title}
              image={category.image}
              bgPosition={category.bgPosition}
              // IMPORTANT: The CategorySection needs the href to build the final link.
              linkHref={category.href} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}