import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Footer from './components/Footer';
import Shop from './components/Shop';
import Personalize from './components/Personalize'
import BeInspired from './components/BeInspired'

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
      duration: 1000, // Animation duration in milliseconds
      once: false, // Set to true if you want animation to happen only once
      mirror: false, // Whether elements should animate out while scrolling past them
      offset: 100, // Offset from the original trigger point
      easing: 'ease-in-out', // Easing function
    });
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navigation
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/personalize" element={<Personalize />} />
            <Route path="/inspired" element={<BeInspired />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;