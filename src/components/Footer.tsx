// src/components/Footer.tsx (Using Deep Grey: bg-gray-900)

import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'SHOP', href: '/shop' },
  { label: 'PERSONALISE', href: '/personalize' },
  { label: 'BE INSPIRED', href: '/beinspired' },
  { label: 'ABOUT US', href: '/about' },
];

const GOLD_COLOR_TOKEN = 'gold-600';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-gray-900 text-white pt-32 pb-16 px-6 mt-0" role="contentinfo">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">

          {/* Brand Manifesto */}
          <div className="space-y-8" data-aos="fade-up">
            <h2 className="text-4xl font-serif tracking-tight text-white mb-4">INSPIRE</h2>
            <p className="text-[10px] text-gray-500 font-sans-serif leading-relaxed uppercase tracking-[0.2em]">
              The Archive <br />
              <span className="text-gray-700">Artisanal Curation since 2012.</span>
            </p>
            <p className="text-xs text-gray-400 font-sans-serif italic leading-relaxed max-w-xs">
              "We believe in the quiet power of objects and the narratives they carry. Our collections are a tribute to the artisanal spirit."
            </p>
          </div>

          {/* Navigation: The Archive */}
          <div className="space-y-8" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-[10px] tracking-[0.4em] font-bold uppercase text-gold-600">The Archive</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-5">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-[10px] tracking-[0.3em] font-bold uppercase text-white hover:text-gold-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Inquiries & Legal */}
          <div className="space-y-8" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-[10px] tracking-[0.4em] font-bold uppercase text-gold-600">Inquiries</h3>
            <ul className="space-y-5">
              <li><Link to="/contact" className="text-[10px] tracking-[0.3em] font-bold uppercase text-white hover:text-gold-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-[10px] tracking-[0.3em] font-bold uppercase text-white hover:text-gold-600 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="text-[10px] tracking-[0.3em] font-bold uppercase text-white hover:text-gold-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[10px] tracking-[0.3em] font-bold uppercase text-white hover:text-gold-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Subscription */}
          <div className="space-y-8" data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-[10px] tracking-[0.4em] font-bold uppercase text-gold-600">Journal</h3>
            <p className="text-xs text-gray-400 font-sans-serif italic leading-relaxed">
              Subscribe to the Archive Journal for exclusive acquisition opportunities.
            </p>
            <form onSubmit={handleSubmit} className="relative mt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR PROTOCOL"
                required
                className="w-full bg-transparent border-b border-gray-700 py-4 text-[10px] tracking-[0.2em] font-bold text-white placeholder-gray-500 focus:outline-none focus:border-gold-600 transition-colors"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-0 bottom-4 text-gold-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? '...' : 'Enroll'}
              </button>
            </form>
            <div className="flex gap-6 pt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Global Footer Bottom */}
        <div className="border-t border-gray-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <p className="text-[8px] tracking-[0.5em] font-bold text-gray-700 uppercase">
              © 2024 INSPIRE ARCHIVE.
            </p>
            <p className="text-[8px] tracking-[0.5em] font-bold text-gray-700 uppercase">
              LAGOS / WORLDWIDE
            </p>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-[8px] tracking-[0.5em] font-bold text-gray-700 uppercase">All Rights Reserved</span>
            <div className="w-8 h-px bg-gray-800" />
            <span className="text-[8px] tracking-[0.5em] font-bold text-gold-900/40 uppercase tracking-tighter">ESTD 2012</span>
          </div>
        </div>
      </div>
    </footer>
  );
}