// src/components/Navigation.tsx
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  cartCount?: number;
}

const navLinks = [
  { label: 'SHOP', href: '/shop' },
  { label: 'PERSONALISE', href: '/personalize' },
  { label: 'BE INSPIRED', href: '/inspired' },
  { label: 'ABOUT US', href: '/about' },
];

export default function Navigation({ 
  mobileMenuOpen, 
  setMobileMenuOpen,
  cartCount = 0 
}: NavigationProps) {
  return (
    <>
      {/* MAIN NAV - FULLY MOBILE FIXED */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-black/5">
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="font-serif text-2xl tracking-[0.2em] text-gray-900 hover:text-yellow-700 transition-colors flex-shrink-0"
          >
            INSPIRE
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-xs tracking-[0.15em] text-gray-900 hover:text-yellow-700 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ICONS + HAMBURGER */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-4">
              <button aria-label="Search" className="p-2 hover:text-yellow-700">
                <Search className="w-5 h-5" />
              </button>
              <button aria-label="Account" className="p-2 hover:text-yellow-700">
                <User className="w-5 h-5" />
              </button>
            </div>

            <Link
              to="/cart"
              aria-label={`Cart (${cartCount})`}
              className="p-2 hover:text-yellow-700 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-600 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 lg:hidden hover:text-yellow-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

  {/* MOBILE MENU BACKDROP + MENU */}
<div
  className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-500 lg:hidden ${
    mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
  }`}
>
  {/* BACKDROP */}
  <div
    onClick={() => setMobileMenuOpen(false)}
    className="absolute inset-0 bg-[#F5F1E7]/90 backdrop-blur-md"
  />

  {/* MENU CONTENT */}
  <div className="relative flex flex-col items-center gap-8 px-8">
    {navLinks.map((link) => (
      <Link
        key={link.label}
        to={link.href}
        onClick={() => setMobileMenuOpen(false)}
        className="font-serif text-4xl sm:text-5xl tracking-[0.15em] text-gray-900 hover:text-yellow-500 transition-colors text-center"
      >
        {link.label}
      </Link>
    ))}
  </div>
</div>

    </>
  );
}