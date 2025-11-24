// src/firebase/helpers.ts

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config'; // Assuming your Firebase configuration is imported here

// ==================== CLOUDINARY UPLOAD HELPERS ====================

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.error('⚠️ Cloudinary credentials missing! Check your .env file.');
}

/**
 * Upload single image to Cloudinary
 */
const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'inspire-products');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple product images to Cloudinary
 */
export const uploadProductImages = async (files: File[]) => {
  try {
    const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    return { success: true, urls };
  } catch (error) {
    console.error('Error uploading images:', error);
    return { success: false, urls: [] };
  }
};

/**
 * Upload request image to Cloudinary
 */
export const uploadRequestImage = async (file: File) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    return { success: false, url: '' };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'inspire-requests');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return { success: true, url: data.secure_url };
  } catch (error) {
    console.error('Request image upload error:', error);
    return { success: false, url: '' };
  }
};

// ==================== CATEGORY HELPERS (DEPRECATED/COMMENTED OUT) ====================
// These are commented out because they rely on a non-existent 'categories' collection.
// The frontend will now use local metadata for category structure.

// export interface ProductMock { ... }
// export interface SubCategory { ... }
// export interface Category { ... }

// export const getAllCategories = async () => { ... };
// export const getCategoryById = async (categoryId: string) => { ... };
// export const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt'>) => { ... };
// export const migrateCategoriesData = async (mockCategories: any[]) => { ... };

// ==================== PRODUCT HELPERS ====================

// Re-defining the Product interface, ensuring the 'category' field is correctly typed
export interface ProductVariant {
  size: string;
  price: number;
  stock: number;
}

export interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  hasVariants: boolean;
  price?: number;
  stock?: number;
  variants?: ProductVariant[];
  images: string[];
  category: string; // The main category title, e.g., 'Gifts', 'Fashion'
  subCategory: string; // The combined category/sub-category ID, e.g., 'gifts-her'
  functions: string[];
  colors: string[];
  featured: boolean;
  createdAt: any;
}

// Add Product
export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error };
  }
};

// Get All Products (used for generic shop pages or admin)
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error getting products:', error);
    return { success: false, products: [] };
  }
};

/**
 * NEW HELPER: Fetch products that belong to a specific main category (e.g., 'fashion').
 * It queries the 'category' field on the product document, which is stored as a title (e.g., 'Fashion').
 */
export const getProductsByMainCategory = async (categoryId: string) => {
  try {
    const productsRef = collection(db, 'products');
    
    // Convert 'fashion' -> 'Fashion' to match the database's title case.
    const categoryTitle = categoryId.charAt(0).toUpperCase() + categoryId.slice(1); 
    
    // Query the 'category' field (e.g., where category == 'Gifts')
    const q = query(productsRef, where('category', '==', categoryTitle)); 
    const querySnapshot = await getDocs(q);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return { success: true, products };
  } catch (error) {
    console.error(`Error getting products for category ${categoryId}:`, error);
    return { success: false, products: [] };
  }
};


// Get Single Product
export const getProductById = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, product: { id: docSnap.id, ...docSnap.data() } as Product };
    }
    return { success: false, error: 'Product not found' };
  } catch (error) {
    console.error('Error getting product:', error);
    return { success: false, error };
  }
};

// Get Single Product by Slug
export const getProductBySlug = async (slug: string) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'Product not found' };
    }

    const doc = querySnapshot.docs[0];
    return { 
      success: true, 
      product: { id: doc.id, ...doc.data() } as Product 
    };
  } catch (error) {
    console.error('Error getting product by slug:', error);
    return { success: false, error };
  }
};

// Update Product
export const updateProduct = async (id: string, data: Partial<Product>) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error };
  }
};

// Delete Product
export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error };
  }
};

// ==================== ORDER HELPERS ====================
// ... (Your Order Helpers remain unchanged) ...

export interface Order {
  id?: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  paymentRef: string;
  createdAt: any;
}

// Get All Orders
export const getOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Error getting orders:', error);
    return { success: false, orders: [] };
  }
};

// Update Order Status
export const updateOrderStatus = async (id: string, status: Order['status']) => {
  try {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status, updatedAt: Timestamp.now() });
    return { success: true };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error };
  }
};

// ==================== PERSONALIZATION REQUEST HELPERS ====================
// ... (Your Personalization Request Helpers remain unchanged) ...

export interface PersonalizationRequest {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productType: string;
  description: string;
  imageUrl?: string;
  status: 'New' | 'Quoted' | 'Approved' | 'In Progress' | 'Completed';
  quotedPrice?: number;
  estimatedDays?: number;
  adminNotes?: string;
  createdAt: any;
}

// Get All Requests
export const getPersonalizationRequests = async () => {
  try {
    const q = query(collection(db, 'personalization_requests'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const requests: PersonalizationRequest[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as PersonalizationRequest);
    });
    return { success: true, requests };
  } catch (error) {
    console.error('Error getting requests:', error);
    return { success: false, requests: [] };
  }
};

// Update Request Status
export const updateRequestStatus = async (
  id: string, 
  updates: Partial<PersonalizationRequest>
) => {
  try {
    const docRef = doc(db, 'personalization_requests', id);
    await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
    return { success: true };
  } catch (error) {
    console.error('Error updating request:', error);
    return { success: false, error };
  }
};

// ==================== DASHBOARD STATS ====================
// ... (Your Dashboard Stats Helper remains unchanged) ...

export const getDashboardStats = async () => {
  try {
    const [productsRes, ordersRes, requestsRes] = await Promise.all([
      getProducts(),
      getOrders(),
      getPersonalizationRequests()
    ]);

    const pendingOrders = ordersRes.orders?.filter(o => o.status === 'Pending').length || 0;
    const newRequests = requestsRes.requests?.filter(r => r.status === 'New').length || 0;
    const lowStockItems = productsRes.products?.filter(p => {
      if (p.hasVariants && p.variants) {
        return p.variants.some(v => v.stock < 5);
      }
      return (p.stock || 0) < 5;
    }).length || 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = ordersRes.orders
      ?.filter(o => {
        const orderDate = o.createdAt?.toDate();
        return orderDate && orderDate >= today;
      })
      .reduce((sum, o) => sum + o.total, 0) || 0;

    return {
      success: true,
      stats: {
        todayRevenue,
        pendingOrders,
        newRequests,
        lowStockItems
      }
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { success: false, stats: null };
  }
};