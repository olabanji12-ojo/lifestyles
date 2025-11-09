import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Footer from './components/Footer';

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
    <div className="min-h-screen bg-black">
      <Navigation
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main>
        <Hero />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}

export default App;