// components/Hero.tsx (FINAL FULL-BLEED Refactor)
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Pencil } from 'lucide-react'; 

const GOLD_COLOR = 'gold-500'; 

export default function Hero() {
  return (
    // Set to full viewport height (h-screen) and starts at the very top (no pt-[90px] needed)
    <section className="relative w-full h-screen bg-white overflow-hidden"> 
      
      {/* ------------------------------------------- */}
      {/* COLUMN 1: FULL-BLEED IMAGE (Starts at the top edge) */}
      {/* ------------------------------------------- */}
      
      {/* Image Container: Fills the entire section. z-0 ensures it's in the background. */}
      <div className="absolute inset-0 z-0">
        <img 
          // Note: You should update this src path if you use the generated image.
          src="/Hero_background2.png" 
          alt="Minimalist lifestyle hero shot" 
          className="w-full h-full object-cover"
        />
        
        {/* Subtle Darkening Overlay for Text Legibility (Opacity 10 is very subtle) */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      
      
      {/* ---------------------------------------------- */}
      {/* COLUMN 2: OVERLAY TEXT & CTA (SEAMLESS INTEGRATION) */}
      {/* ---------------------------------------------- */}
      
      {/* Content Container: Pushes text to the bottom/center, above the image (z-10). */}
      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 p-8 lg:p-16">
        
        {/* Inner Content Block: ***REMOVED WHITE BOX CLASSES*** */}
        <div className="max-w-4xl w-full text-center">
          
          {/* Tagline - GOLD & HANDWRITTEN */}
          <p className={`text-3xl lg:text-4xl mb-6 font-handwritten italic 
                        text-${GOLD_COLOR} text-shadow-lg`}>
            Live inspired every day
          </p>

          {/* Main Category Links - Now larger and BOLD for contrast against the image */}
          <div className="space-y-4 mb-10 pt-6">
            
            <Link to="/shop">
              <h2 className="text-4xl md:text-5xl font-sans-serif font-bold text-white tracking-widest transition-colors duration-300 hover:text-${GOLD_COLOR} uppercase text-shadow-lg">
                SHOP
              </h2>
            </Link>
            
            <Link to="/personalize">
              <h2 className="text-4xl md:text-5xl font-sans-serif font-bold text-white tracking-widest transition-colors duration-300 hover:text-${GOLD_COLOR} uppercase text-shadow-lg">
                PERSONALISE
              </h2>
            </Link>
            
            <Link to="/inspired">
              <h2 className="text-4xl md:text-5xl font-sans-serif font-bold text-white tracking-widest transition-colors duration-300 hover:text-${GOLD_COLOR} uppercase text-shadow-lg">
                BE INSPIRED
              </h2>
            </Link>
          </div>

          {/* CTA Button - Kept a black background to anchor the bottom */}
          <Link
            to="/shop"
            className={`inline-block border-2 border-gray-900 bg-gray-900 text-white px-10 py-3 text-sm tracking-widest font-sans-serif transition-all duration-300
                       hover:bg-white hover:text-${GOLD_COLOR} hover:border-${GOLD_COLOR} uppercase mt-4`}
          >
            EXPLORE NOW
          </Link>
        </div>
      </div>
    </section>
  );
}