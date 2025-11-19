import CategorySection from './CategorySection';

const categories = [
  {
    id: 'fashion',
    title: 'FASHION',
    items: ['Pants', 'Skirts', 'Kimonos', 'Kaftans', 'Shirts'],
    image: '/silk2.jpg',
    bgPosition: 'center right',
  },
  {
    id: 'accessories',
    title: 'ACCESSORIES',
    items: ['Bags', 'Scarfs', 'Jewelry'],
    image: '/white_jewelry1.jpg',
    bgPosition: 'center',
  },
  {
    id: 'gifts',
    title: 'GIFTS',
    items: ['Birthdays', 'Congratulations', 'Bridal Party', 'Wedding guests', 'Corporates'],
    image: '/bowl1.webp',
    bgPosition: 'center',
  },
  {
    id: 'packaging',
    title: 'PACKAGING',
    items: ['Bundles', 'Boxes', 'Bags', 'Labels', 'Cards'],
    image: '/box1.jpg',
    bgPosition: 'center',
  },

  {
    id: 'home',
    title: 'HOME',
    items: ['Sleep', 'Living', 'Eating'],
    image: '/bed1.jpg',
    bgPosition: 'center',
  },
  {
    id: 'events',
    title: 'EVENTS',
    items: ['Invites', 'Menu Cards', 'Banners'],
    image: '/silk3.jpg',
    bgPosition: 'center left',
  },
  
  {
    id: 'colour',
    title: 'SHOP BY COLOUR',
    items: ['DARKS', 'BRIGHTS', 'NEUTRALS', 'LIGHTS'],
    image: '/flower5.jpeg',
    bgPosition: 'center',
  },
  {
    id: 'function',
    title: 'SHOP BY FUNCTION',
    items: ['WORK', 'PLAY', 'FANCY', 'SLEEP', 'EAT'],
    image: '/baloon.jpg',
    bgPosition: 'center',
  },
  {
    id: 'inspiration',
    title: 'SHOP BY INSPIRATION',
    items: ['Colour', 'Function', 'Inspiration'],
    image: '/flower1.jpg',
  },
];

export default function Categories() {
  return (
    <section className="bg-black" aria-labelledby="categories-title">
      <h2
        id="categories-title"
        className="font-serif text-4xl sm:text-5xl md:text-6xl text-center tracking-[0.15em] text-white pt-32 pb-24 px-6 font-light"
      >
        SHOP BY CATEGORY
      </h2>

      {categories.map((category) => {
        const { bgPosition, ...props } = category;
        return (
          <CategorySection
            key={category.id}
            {...props}
            bgPosition={bgPosition}
          />
        );
      })}
    </section>
  );
}
