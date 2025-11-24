// src/pages/CategoryDetail.tsx (FINAL FIX)

import { useParams, Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SubCategorySlider from '../components/SubCategorySlider';
// 🛑 CHANGE: Import the correct helper
import { getProductsByMainCategory, Product } from '../firebase/helpers'; 

// 🛑 STEP 1: DEFINE CATEGORY METADATA LOCALLY
// src/pages/CategoryDetail.tsx (Complete CATEGORY_METADATA based on MOCK DATA)

// 🛑 IMPORTANT: This replaces the CATEGORY_METADATA object from previous steps.

const CATEGORY_METADATA = {
    // --- 1. FASHION ---
    fashion: { 
        title: "THE FASHION COLLECTION", 
        heroSubtitle: "Timeless silhouettes designed for movement and modern elegance.",
        subCategories: [
            { subId: 'pants', title: 'Pants' }, 
            { subId: 'skirts', title: 'Skirts' }, 
            { subId: 'kaftans', title: 'Kaftans' }, // <-- NEW
            { subId: 'kimonos', title: 'Kimonos' }, // <-- NEW
            { subId: 'shirts', title: 'Shirts' }, // <-- NEW
        ]
    },
    
    // --- 2. ACCESSORIES ---
    accessories: { 
        title: "THE ACCESSORIES EDIT", 
        heroSubtitle: "The perfect finishing pieces to refine and personalize your look.",
        subCategories: [
            { subId: 'bags', title: 'Bags' }, 
            { subId: 'jewelry', title: 'Jewelry' }, 
            { subId: 'scarfs', title: 'Scarfs' }, // <-- NEW
        ]
    },
    
    // --- 3. GIFTS ---
    gifts: { 
        title: "THE ART OF GIVING", 
        heroSubtitle: "Thoughtful, personalized gifts that convey timeless luxury.",
        subCategories: [
            { subId: 'her', title: 'For Her' }, 
            { subId: 'him', title: 'For Him' },  
            { subId: 'home', title: 'New Home' }, // Corresponds to 'gifts-home' in filtering
        ]
    },

    // --- 4. PACKAGING ---
    packaging: { 
        title: "PRESENTATION PERFECTION", 
        heroSubtitle: "Elevate your gifts and products with custom, luxurious packaging solutions.",
        subCategories: [
            { subId: 'boxes', title: 'Gift Boxes' }, 
            { subId: 'ribbons', title: 'Ribbons & Tags' }, // Corresponds to 'packaging-ribbons'
        ]
    },
    
    // --- 5. HOME ---
    home: { 
        title: "CURATED LIVING", 
        heroSubtitle: "Textiles and decor designed to bring serenity and elegance to your space.",
        subCategories: [
            { subId: 'sleep', title: 'Sleep' }, // Corresponds to 'home-sleep'
            { subId: 'living', title: 'Living' }, // Corresponds to 'home-living'
            { subId: 'dining', title: 'Dining' }, // <-- NEW
        ]
    },
    
    // --- 6. EVENTS ---
    events: { 
        title: "THE ART OF CELEBRATION", 
        heroSubtitle: "Refined stationery and decor for your most important milestones.",
        subCategories: [
            { subId: 'invites', title: 'Invitations' }, // Corresponds to 'event-invites'
            { subId: 'table', title: 'Table Decor' }, // Corresponds to 'event-table'
        ]
    },
} as const; // 'as const' helps TypeScript infer the exact shape

// Define the type for the local metadata
type CategoryMetadata = typeof CATEGORY_METADATA['fashion'];

// ... (other constants like GOLD_COLOR_TEXT) ...

export default function CategoryDetail() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [allProducts, setAllProducts] = useState<Product[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // 🛑 STEP 2: LOOK UP CATEGORY METADATA LOCALLY
    const category: CategoryMetadata | undefined = categoryId ? CATEGORY_METADATA[categoryId as keyof typeof CATEGORY_METADATA] : undefined;

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId || !category) {
                setError(true); 
                setLoading(false);
                return;
            }

            setLoading(true);
            
            // 🛑 STEP 3: FETCH PRODUCTS USING THE NEW HELPER
            const productsResult = await getProductsByMainCategory(categoryId); 
            
            if (productsResult.success && productsResult.products) {
                setAllProducts(productsResult.products);
                setError(false);
            } else {
                // We set error true if products fail to load, which causes the redirect.
                // If you want to show the page with zero products, set error=false here.
                setError(true); 
            }
            
            setLoading(false);
        };
        fetchData();
    }, [categoryId]); // Depend on categoryId
    
    // Loading State
    if (loading) { /* ... */ }

    // 🛑 STEP 4: REDIRECT IS NOW TRIGGERED BY MISSING METADATA OR FAILED PRODUCT FETCH
    if (error || !category) { 
        return <Navigate to="/shop" replace />;
    }
    
    // The rest of the JSX:
    return (
        <main className="pt-[90px] bg-white">
            {/* A. Hero Header for the Category Page (uses local 'category') */}
            {/* ... */}
            

           {/* // ... inside return ( ... ) */}

            {/* B. Sub-Category Loop: */}
            <div className="w-full">
                {category.subCategories.map((subCat) => {
                    if (!subCat.subId || !subCat.title) return null; 

                    // Define the two possible IDs the product might have:
                    const fullSubId = `${categoryId}-${subCat.subId}`; // e.g., 'fashion-pants'
                    const shortSubId = subCat.subId; // e.g., 'pants'

                    // 🛑 FIX: Filter products based on EITHER the full ID OR the short ID
                    const sliderProducts = allProducts.filter(p => 
                        p.subCategory === fullSubId || p.subCategory === shortSubId
                    );

                    // If no products match the sub-category, hide the slider
                    if (sliderProducts.length === 0) return null; 

                    return (
                        <SubCategorySlider
                            key={subCat.subId}
                            title={subCat.title}
                            // Pass the full subId for routing consistency
                            subId={fullSubId} 
                            products={sliderProducts}
                        />
                    );
                })}
            </div>

            {/* C. Final CTA */}
            {/* ... */}
        </main>
    );
}