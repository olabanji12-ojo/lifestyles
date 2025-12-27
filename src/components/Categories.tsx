// src/components/Categories.tsx
import CategorySection from './CategorySection';

const categories = [
  { id: 'fashion', title: 'FASHION', href: '/category/fashion', image: '/Fashion_image.png', bgPosition: 'center right', span: 'lg:col-span-8' },
  { id: 'accessories', title: 'ACCESSORIES', href: '/category/accessories', image: '/Accessories_image.png', bgPosition: 'center', span: 'lg:col-span-4' },
  { id: 'gifts', title: 'GIFTS', href: '/category/gifts', image: '/Gifts_image.png', bgPosition: 'center', span: 'lg:col-span-4' },
  { id: 'home', title: 'HOME', href: '/category/home', image: '/Home_image.png', bgPosition: 'center', span: 'lg:col-span-8' },
  { id: 'packaging', title: 'PACKAGING', href: '/category/packaging', image: '/Packaging_image.png', bgPosition: 'center', span: 'lg:col-span-6' },
  { id: 'events', title: 'EVENTS', href: '/category/events', image: '/Events_image.png', bgPosition: 'center left', span: 'lg:col-span-6' },
];

export default function Categories() {
  return (
    <section className="bg-white py-12" aria-labelledby="categories-title">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              id={category.id}
              title={category.title}
              image={category.image}
              bgPosition={category.bgPosition}
              linkHref={category.href}
              className={category.span}
            />
          ))}
        </div>
      </div>
    </section>
  );
}