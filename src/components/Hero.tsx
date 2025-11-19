// components/Hero.tsx (Refactored for Mobile Image)
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Pencil } from 'lucide-react'; 

const GOLD_COLOR = 'gold-500'; 

export default function Hero() {
  return (
    // FIX 1: Removed h-screen on the section to allow content to flow naturally on mobile
    <section className="w-full grid grid-cols-1 lg:grid-cols-2 bg-white pt-[90px] lg:h-screen"> 
      
      {/* COLUMN 1 (LEFT): MINIMALIST IMAGE DISPLAY */}
      {/* FIX 2: Changed 'hidden lg:block' to 'block' and restricted height on mobile (h-96) */}
      <div className="relative block h-96 lg:h-full overflow-hidden p-4 lg:p-0"> 
        {/* The image container needs the padding back for the border to show on mobile */}
        <div className="absolute inset-4 lg:inset-0 border-2 border-gray-200">
          <img 
            src="/Hero_background2.png" 
            alt="Minimalist flat lay of curated items" 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        </div>
        
        {/* Subtle Gold Accent Box (These will be visually less important on mobile, but keep them for consistency) */}
        <div 
          className={`absolute top-0 left-0 w-16 h-16 border-t border-l border-${GOLD_COLOR} opacity-70`} 
        />
        <div 
          className={`absolute bottom-0 right-0 w-16 h-16 border-b border-r border-${GOLD_COLOR} opacity-70`} 
        />
      </div>


      {/* COLUMN 2 (RIGHT): MINIMALIST TEXT & CTA */}
      {/* This column needs padding adjustments to account for the image now taking up space */}
      <div className="flex flex-col justify-center items-center lg:items-start p-8 lg:p-16">
        {/* Text container remains centered on mobile and left on desktop */}
        <div className="max-w-xl w-full text-center lg:text-left">
          
          <div className="space-y-4 mb-10">
            {/* The rest of the text structure remains the same, leveraging the mobile centering fixes from before */}
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
            {/* Tagline - GOLD & HANDWRITTEN */}
            <p className={`text-3xl lg:text-4xl text-${GOLD_COLOR} mb-6 font-handwritten italic`}>
              Live inspired every day
            </p>

            {/* CTA Button */}
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