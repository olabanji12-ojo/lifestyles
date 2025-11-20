// src/pages/CategoryDetail.tsx

import { useParams, Navigate, Link } from 'react-router-dom';
import SubCategorySlider from '../components/SubCategorySlider';
import { CATEGORY_DATA } from '../data/categoryData';


const GOLD_COLOR = 'gold-500';

export default function CategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Find the relevant category data
  const category = CATEGORY_DATA.find(cat => cat.id === categoryId);

  // Handle 404 Case
  if (!category) {
    // If the category ID is invalid, redirect to the main shop page
    return <Navigate to="/shop" replace />;
  }

  return (
    <main className="pt-[90px] bg-white">
      {/* A. Hero Header for the Category Page */}
      <div className="text-center py-20 px-6 max-w-4xl mx-auto">
        {/* Main Title (Sans-Serif for a clean, editorial look) */}
        <h1 className="font-sans-serif text-4xl sm:text-5xl text-gray-900 tracking-widest uppercase mb-4">
          {category.title}
        </h1>
        {/* Subtitle (Handwritten Font for elegance) */}
        <p className={`font-handwritten text-3xl text-${GOLD_COLOR}`}>
          {category.heroSubtitle}
        </p>
      </div>

      {/* B. Sub-Category Loop: Renders a slider for each sub-category */}
      <div className="w-full">
        {category.subCategories.map((subCat) => (
          <SubCategorySlider
            key={subCat.subId}
            title={subCat.title}
            subId={`${categoryId}-${subCat.subId}`} // Pass unique ID for link generation
            products={subCat.products}
          />
        ))}
      </div>

      {/* C. Final CTA */}
      <div className="text-center py-20">
        <Link
          to={`/shop?category=${categoryId}`}
          className={`inline-block border-2 border-gray-900 bg-gray-900 text-white px-12 py-4 text-sm tracking-widest font-sans-serif uppercase transition-all duration-300
                     hover:bg-white hover:text-${GOLD_COLOR} hover:border-${GOLD_COLOR}`}
        >
          View All {categoryId} Products
        </Link>
      </div>
    </main>
  );
}