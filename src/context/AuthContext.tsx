import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  role: 'admin' | 'customer' | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  googleSignIn: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'customer' | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  function signup(email: string, password: string, displayName: string) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Update display name
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
        
        // Create user document in Firestore with customer role
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          displayName: displayName,
          role: 'customer', // Default role for new signups
          createdAt: new Date(),
        });
        
        return userCredential;
      });
  }

  // Login function
  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google Sign In
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user document with customer role by default
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'customer', // Change to 'admin' if you want Google users to be admin
          createdAt: new Date(),
        });
      }
      
      return user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  // Logout function
  function logout() {
    return firebaseSignOut(auth);
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user);
      setCurrentUser(user);
      
      if (user) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          console.log('User data from Firestore:', userData);
          setRole(userData?.role || 'customer');
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRole('customer'); // Default to customer if error
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
      console.log('Loading set to false');
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    role,
    loading,
    signup,
    login,
    logout,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}