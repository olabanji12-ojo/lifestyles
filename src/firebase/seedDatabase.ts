// src/firebase/seedDatabase.ts

// Adjust the path to your CATEGORY_DATA
import { CATEGORY_DATA, Category, SubCategory, ProductMock } from '../data/categoryData'; 
// Adjust the path to your Firebase config/instance
import { db } from '../firebase/config'; 
import { collection, doc, writeBatch } from 'firebase/firestore';

// Helper function to create a clean slug
const createSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '-');
};

// -----------------------------------------------------------------------------
// MAIN SEEDING FUNCTION
// -----------------------------------------------------------------------------

export const seedProductsToFirestore = async () => {
  console.log('Starting Firestore product seeding process...');
  const batch = writeBatch(db);
  const productsCollection = collection(db, 'products');
  let productCount = 0;

  try {
    // Iterate through the structured mock data
    CATEGORY_DATA.forEach((category: Category) => {
      // Map main categories (e.g., 'fashion') to admin panel categories (e.g., 'Fashion')
      const adminCategory = category.id.charAt(0).toUpperCase() + category.id.slice(1);
        
      category.subCategories.forEach((subCategory: SubCategory) => {
        subCategory.products.forEach((mockProduct: ProductMock) => {
          productCount++;
          
          const slug = createSlug(mockProduct.name);
          
          // Construct the detailed product object for Firestore
          const firestoreProduct = {
            name: mockProduct.name,
            // 💡 Generating a placeholder description for the seed
            description: `A sophisticated item from our **${category.title}** collection, specifically under **${subCategory.title}**. This product offers timeless elegance and high quality materials.`,
            slug: slug,
            images: [mockProduct.image], 
            
            // Map the category and subcategory
            category: adminCategory, 
            subCategory: subCategory.subId, 
            
            // Default attributes
            functions: ['Fancy'], 
            colors: ['Neutral'], 
            featured: false, 
            
            // Single price/stock model for the simple mock data
            hasVariants: false,
            price: mockProduct.price,
            stock: 50, // Default stock level for all seeded products
            variants: [],
            
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Create a new document reference with a new, auto-generated ID
          const newDocRef = doc(productsCollection);
          batch.set(newDocRef, firestoreProduct);
        });
      });
    });

    // Commit the batch write operation (sends all ~24 products in one go)
    await batch.commit();
    console.log(`✅ Successfully seeded ${productCount} products into Firestore.`);
    return { success: true, count: productCount };
  } catch (error) {
    console.error('❌ Error during Firestore product seeding:', error);
    return { success: false, error };
  }
};