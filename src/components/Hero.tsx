// components/Hero.tsx (Refactored Tagline)
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Pencil } from 'lucide-react'; 

// NOTE: GOLD_COLOR is defined in your tailwind.config.js as 'gold-500'
const GOLD_COLOR = 'gold-500'; 

export default function Hero() {
  return (
    // Grid container remains the same, set to full viewport height
    <section className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white pt-[90px] lg:pt-0">
      
      {/* COLUMN 1 (LEFT): MINIMALIST IMAGE DISPLAY (No Change) */}
      <div className="relative hidden lg:block h-full overflow-hidden">
        {/* The image is contained within a border for the minimalist aesthetic */}
        <div className="absolute inset-4 border-2 border-gray-200">
          <img 
            src="/Hero_background2.png" 
            alt="Minimalist flat lay of curated items" 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        </div>
        
        {/* Subtle Gold Accent Box (Optional, using the defined gold color) */}
        <div 
          className={`absolute top-0 left-0 w-24 h-24 border-t border-l border-${GOLD_COLOR} opacity-70`} 
        />
        <div 
          className={`absolute bottom-0 right-0 w-24 h-24 border-b border-r border-${GOLD_COLOR} opacity-70`} 
        />
      </div>


      {/* COLUMN 2 (RIGHT): MINIMALIST TEXT & CTA */}
      <div className="flex flex-col justify-center items-center lg:items-start p-8 lg:p-16">
        <div className="max-w-xl w-full text-center lg:text-left">
          
          {/* Main Category Links - No Change */}
          <div className="space-y-4 mb-10">
            
            <Link to="/shop">
              <h2 className="text-6xl md:text-8xl font-handwritten text-gray-900 tracking-tighter transition-colors duration-300 hover:text-gray-600 flex justify-center lg:justify-start items-center gap-4">
                SHOP
                <ShoppingBag className="w-8 h-8 opacity-50 hidden md:block" />
              </h2>
            </Link>
            
            <Link to="/personalize">
              <h2 className="text-6xl md:text-8xl font-handwritten text-gray-900 tracking-tighter transition-colors duration-300 hover:text-gray-600 flex justify-center lg:justify-start items-center gap-4">
                PERSONALISE
                <Pencil className="w-8 h-8 opacity-50 hidden md:block" />
              </h2>
            </Link>
            
            <Link to="/inspired">
              <h2 className="text-6xl md:text-8xl font-handwritten text-gray-900 tracking-tighter transition-colors duration-300 hover:text-gray-600 flex justify-center lg:justify-start items-center gap-4">
                BE INSPIRED
                <Sparkles className="w-8 h-8 opacity-50 hidden md:block" />
              </h2>
            </Link>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            {/* Tagline - NOW GOLD & HANDWRITTEN */}
            <p className={`text-3xl lg:text-4xl text-${GOLD_COLOR} mb-6 font-handwritten italic`}>
              Live inspired every day
            </p>

            {/* CTA Button - No Change */}
            <Link
              to="/shop"
              className={`inline-block border-2 border-gray-900 bg-gray-900 text-white px-10 py-3 text-sm tracking-widest font-sans-serif transition-all duration-300
                         hover:bg-white hover:text-${GOLD_COLOR} hover:border-${GOLD_COLOR} uppercase`}
            >
              EXPLORE NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}