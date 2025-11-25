import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Footer from './components/Footer';
import Shop from './components/Shop'
// import Shop from './pages/Shop';
import Personalize from './pages/Personalize'
import Beinspired from './pages/Beinspired'
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminRequests from './pages/AdminRequests'
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Signup from './pages/Signup'
import { CartProvider } from './context/CartContext';
import OrderConfirmation from './pages/OrderConfirmation';
import PaymentFailed from './pages/PaymentFailed';
import LifestyleCarousel from './components/LifestyleCarousel'
import CategoryDetail from './pages/CategoryDetail';
import About from './pages/About'

// Home Page Component
function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
    </>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
      offset: 0,
      easing: 'ease-in-out',
    });
    AOS.refresh();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Remove flex and min-h-screen from parent, use simple structure */}
          <div className="relative">
        // After:
            <Navigation
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Main content area - this should control the scrolling */}
            <main className="min-h-screen">
              <Routes>
                {/* PUBLIC — ANYONE CAN SEE */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/personalize" element={<Personalize />} />
                <Route path="/inspired" element={<Beinspired />} />
                <Route path="/beinspired" element={<Beinspired />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />
                <Route path="/category/:categoryId" element={<CategoryDetail />} />


                {/* ADMIN ONLY — GUARDED */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/adminproducts"
                  element={
                    <ProtectedRoute>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/adminorders"
                  element={
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/adminrequests"
                  element={
                    <ProtectedRoute>
                      <AdminRequests />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            {/* Footer will naturally follow the content */}
            <LifestyleCarousel />
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;