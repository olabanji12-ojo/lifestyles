// src/pages/CategoryDetail.tsx

import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SubCategorySlider from '../components/SubCategorySlider';
import { getProductsByMainCategory, Product } from '../firebase/helpers';

const CATEGORY_METADATA = {
    fashion: {
        title: "THE FASHION COLLECTION",
        heroSubtitle: "Timeless silhouettes designed for movement and modern elegance.",
        subCategories: [
            { subId: 'pants', title: 'Pants' },
            { subId: 'skirts', title: 'Skirts' },
            { subId: 'kaftans', title: 'Kaftans' },
            { subId: 'kimonos', title: 'Kimonos' },
            { subId: 'shirts', title: 'Shirts' },
        ]
    },

    accessories: {
        title: "THE ACCESSORIES EDIT",
        heroSubtitle: "The perfect finishing pieces to refine and personalize your look.",
        subCategories: [
            { subId: 'bags', title: 'Bags' },
            { subId: 'jewelry', title: 'Jewelry' },
            { subId: 'scarfs', title: 'Scarfs' },
        ]
    },

    gifts: {
        title: "THE ART OF GIVING",
        heroSubtitle: "Thoughtful, personalized gifts that convey timeless luxury.",
        subCategories: [
            { subId: 'her', title: 'For Her' },
            { subId: 'him', title: 'For Him' },
            { subId: 'home', title: 'New Home' },
        ]
    },

    packaging: {
        title: "PRESENTATION PERFECTION",
        heroSubtitle: "Elevate your gifts and products with custom, luxurious packaging solutions.",
        subCategories: [
            { subId: 'boxes', title: 'Gift Boxes' },
            { subId: 'ribbons', title: 'Ribbons & Tags' },
        ]
    },

    home: {
        title: "CURATED LIVING",
        heroSubtitle: "Textiles and decor designed to bring serenity and elegance to your space.",
        subCategories: [
            { subId: 'sleep', title: 'Sleep' },
            { subId: 'living', title: 'Living' },
            { subId: 'dining', title: 'Dining' },
        ]
    },

    events: {
        title: "THE ART OF CELEBRATION",
        heroSubtitle: "Refined stationery and decor for your most important milestones.",
        subCategories: [
            { subId: 'invites', title: 'Invitations' },
            { subId: 'table', title: 'Table Decor' },
        ]
    },
} as const;

type CategoryMetadata = typeof CATEGORY_METADATA[keyof typeof CATEGORY_METADATA];

export default function CategoryDetail() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const category = categoryId ? CATEGORY_METADATA[categoryId as keyof typeof CATEGORY_METADATA] : undefined;

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId || !category) {
                setError(true);
                setLoading(false);
                return;
            }

            setLoading(true);

            const productsResult = await getProductsByMainCategory(categoryId);

            if (productsResult.success && productsResult.products) {
                setAllProducts(productsResult.products);
                setError(false);
            } else {
                setError(true);
            }

            setLoading(false);
        };
        fetchData();
    }, [categoryId, category]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return <Navigate to="/shop" replace />;
    }

    return (
        <main className="pt-[90px] bg-white">
            <div className="w-full">
                {category.subCategories.map((subCat) => {
                    if (!subCat.subId || !subCat.title) return null;

                    const fullSubId = `${categoryId}-${subCat.subId}`;
                    const shortSubId = subCat.subId;

                    const sliderProducts = allProducts.filter(p =>
                        p.subCategory === fullSubId || p.subCategory === shortSubId
                    );

                    if (sliderProducts.length === 0) return null;

                    return (
                        <SubCategorySlider
                            key={subCat.subId}
                            title={subCat.title}
                            subId={fullSubId}
                            products={sliderProducts}
                        />
                    );
                })}
            </div>
        </main>
    );
}