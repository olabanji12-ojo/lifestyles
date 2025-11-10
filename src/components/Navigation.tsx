import { Search, User, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const navLinks = [
  { label: 'SHOP', href: '/shop' },
  { label: 'PERSONALISE', href: '/personalize' },
  { label: 'BE INSPIRED', href: '/inspired' },
  { label: 'ABOUT US', href: '/about' },
];

export default function Navigation({ mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-black/5"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="font-serif text-2xl tracking-[0.2em] text-gray-900 hover:text-yellow-700 transition-colors"
            aria-label="Inspire home"
          >
            INSPIRE
          </Link>

          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-xs tracking-[0.15em] text-gray-900 hover:text-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 rounded px-2 py-1"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            <button
              className="p-2 hover:text-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-700 rounded"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:text-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-700 rounded"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:text-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-700 rounded"
              aria-label="View orders"
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-700 rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-900 transition-transform duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-gray-900 transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-gray-900 transition-transform duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-white/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-12 transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="font-serif text-4xl tracking-[0.2em] text-gray-900 hover:text-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-700 rounded px-4 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}