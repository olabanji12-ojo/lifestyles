// src/context/CartContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { cleanForFirestore } from '../utils/cleanObject';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: {
    size: string;
    price: number;
  } | null;  // ← Allow null
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [currentUser]);

  // Load cart from localStorage or Firestore
  const loadCart = async () => {
    setLoading(true);
    
    if (currentUser) {
      // Logged in: Load from Firestore
      await loadCartFromFirestore();
    } else {
      // Guest: Load from localStorage
      loadCartFromLocalStorage();
    }
    
    setLoading(false);
  };

  // Load from Firestore (logged-in users)
  const loadCartFromFirestore = async () => {
    try {
      const cartDoc = await getDoc(doc(db, 'carts', currentUser!.uid));
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        setCart(cartData.items || []);
      } else {
        // Check if there's a localStorage cart to migrate
        const localCart = localStorage.getItem('inspire_cart');
        if (localCart) {
          const parsedCart = JSON.parse(localCart);
          await migrateLocalCartToFirestore(parsedCart);
          localStorage.removeItem('inspire_cart'); // Clear after migration
        }
      }
    } catch (error) {
      console.error('Error loading cart from Firestore:', error);
      toast.error('Failed to load cart');
    }
  };

  // Migrate localStorage cart to Firestore
  const migrateLocalCartToFirestore = async (localCart: CartItem[]) => {
    try {
      await setDoc(doc(db, 'carts', currentUser.uid), {
        items: cleanForFirestore(updatedCart),
        updatedAt: new Date(),
        });
      setCart(localCart);
      toast.success('Cart synced!');
    } catch (error) {
      console.error('Error migrating cart:', error);
    }
  };

  // Load from localStorage (guests)
  const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('inspire_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  };

  // Save cart (to localStorage or Firestore)
const saveCart = async (updatedCart: CartItem[]) => {
  setCart(updatedCart);
  console.log('about to write cart', JSON.stringify({ items: updatedCart }, null, 2));

  if (currentUser) {
    // Save to Firestore
    try {
      // Clean undefined → null
      const safeItems = JSON.parse(
        JSON.stringify(updatedCart, (k, v) => (v === undefined ? null : v))
      );

      await setDoc(doc(db, 'carts', currentUser.uid), {
        items: safeItems,  // ← Use safeItems, NOT updatedCart
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
      toast.error('Failed to save cart');
    }
  } else {
    // Save to localStorage
    localStorage.setItem('inspire_cart', JSON.stringify(updatedCart));
  }
};

  // Add to cart
  const addToCart = async (newItem: Omit<CartItem, 'id'>) => {
    // Generate unique ID for cart item (productId + variant if exists)
    const itemId = newItem.variant 
      ? `${newItem.productId}-${newItem.variant.size}`
      : newItem.productId;

    // Check if item already exists
    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    let updatedCart: CartItem[];

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      const newQuantity = cart[existingItemIndex].quantity + newItem.quantity;
      
      // Validate stock
      if (newQuantity > newItem.stock) {
        toast.error(`Only ${newItem.stock} items available in stock`);
        return;
      }

      updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: newQuantity }
          : item
      );
      toast.success('Cart updated!');
    } else {
      // New item
      updatedCart = [...cart, { ...newItem, id: itemId }];
      toast.success('Added to cart!');
    }

    await saveCart(updatedCart);
  };

  // Update quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    // Find item and check stock
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available`);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    await saveCart(updatedCart);
  };

  // Remove from cart
  const removeFromCart = async (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    await saveCart(updatedCart);
    toast.success('Item removed from cart');
  };

  // Clear cart
  const clearCart = async () => {
    await saveCart([]);
    
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'carts', currentUser.uid));
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  // Calculate cart stats
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.variant ? item.variant.price : item.price;
    return sum + (price * item.quantity);
  }, 0);

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};