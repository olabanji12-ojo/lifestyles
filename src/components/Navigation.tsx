// src/components/Navigation.tsx
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { handleLogout } from "../utils/authHelpers";
import { useState, useRef, useEffect } from "react"; // ADDED useRef and useEffect

interface NavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const menuItems = [
  // ... (menuItems definition is unchanged)
  { label: "SHOP", href: "/shop" },
  {
    label: "FASHION",
    subs: [
      { name: "Pants", href: "/shop?category=fashion&sub=pants" },
      { name: "Skirts", href: "/shop?category=fashion&sub=skirts" },
      { name: "Kaftans", href: "/shop?category=fashion&sub=kaftans" },
      { name: "Kimonos", href: "/shop?category=fashion&sub=kimonos" },
      { name: "Shirts", href: "/shop?category=fashion&sub=shirts" },
    ],
  },
  {
    label: "ACCESSORIES",
    subs: [
      { name: "Bags", href: "/shop?category=accessories&sub=bags" },
      { name: "Scarves", href: "/shop?category=accessories&sub=scarves" },
      { name: "Jewelry", href: "/shop?category=accessories&sub=jewelry" },
    ],
  },
  {
    label: "GIFTS",
    subs: [
      { name: "Birthday", href: "/shop?category=gifts&sub=birthday" },
      { name: "Congratulations", href: "/shop?category=gifts&sub=congrats" },
      { name: "Bridal Party", href: "/shop?category=gifts&sub=bridal" },
      { name: "Wedding Guests", href: "/shop?category=gifts&sub=wedding-guests" },
      { name: "Corporate", href: "/shop?category=gifts&sub=corporate" },
    ],
  },
  {
    label: "PACKAGING",
    subs: [
      { name: "Ribbons & Tags", href: "/shop?category=packaging&sub=ribbons" },
      { name: "Gift Boxes", href: "/shop?category=packaging&sub=boxes" },
      { name: "Custom Wraps", href: "/shop?category=packaging&sub=wraps" },
    ],
  },
  { label: "PERSONALISE", href: "/personalize" },
  { label: "BE INSPIRED", href: "/inspired" },
  { label: "ABOUT US", href: "/about" },
];


export default function Navigation({
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavigationProps) {
  const { cartCount } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State for Desktop Dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // State for Mobile Accordion
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);

  // *** NEW: Ref to hold the timeout ID for delayed closing ***
  const timeoutRef = useRef<number | null>(null);


  // *** NEW: Handlers for DELAYED DESKTOP HOVER ***
  const handleMouseEnter = (label: string) => {
    // Clear any pending closure timer
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    // Open the dropdown immediately
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    // Clear any pending timers (to avoid race conditions)
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    // Set a new timer to close the menu after a short delay (150ms)
    timeoutRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };
  // *** END NEW HANDLERS ***


  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const toggleMobileCategory = (label: string) => {
    setMobileOpenCategory(mobileOpenCategory === label ? null : label);
  };
  
  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* MAIN NAV — Fixed, pure white */}
      <header
        className={`fixed top-0 left-0 right-0 bg-white z-40 py-4 px-6 lg:px-12 flex justify-between items-center shadow-sm`}
      >
        {/* Logo */}
        <Link to="/" className="text-3xl font-handwritten text-gray-900 z-10">
          Inspire
        </Link>

        {/* Desktop Nav - Shows only on large screens (1024px+) */}
        <nav className="hidden lg:flex gap-8 items-center">
          {menuItems.map((item) => (
            <div 
              key={item.label} 
              className="relative group"
              // *** FIX: Use the new delayed handlers here ***
              onMouseEnter={() => "subs" in item && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              {"subs" in item ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="text-sm tracking-widest text-gray-900 flex items-center gap-1 hover:text-gray-600 transition"
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Dropdown — stays open when hovering over it */}
                  {openDropdown === item.label && (
                    <div 
                      className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-sm py-2 w-48 z-50"
                      // NOTE: We don't need onMouseEnter/onMouseLeave here anymore, the parent div handles the state
                    >
                      {item.subs!.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  className="text-sm tracking-widest text-gray-900 hover:text-gray-600 transition"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
        
        {/* ... (Rest of the Navigation component, including right-side icons and mobile menu, is unchanged from the previous fixed version) ... */}
        
        {/* Right side - Shows only on large screens */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-6 h-6 text-gray-900" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {currentUser ? (
            <button
              onClick={() => handleLogout(navigate)}
              className="text-sm tracking-widest text-gray-900 hover:text-gray-600 transition"
            >
              LOGOUT
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm tracking-widest text-gray-900 hover:text-gray-600 transition"
            >
              LOGIN
            </Link>
          )}
        </div>

        {/* Mobile/Tablet Cart Icon - Shows when menu is hidden */}
        <div className="lg:hidden flex items-center gap-4">
          <Link to="/cart" className="relative z-10">
            <ShoppingBag className="w-6 h-6 text-gray-900" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button - Shows on screens below 1024px */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="z-10"
          >
            <Menu className="w-7 h-7 text-gray-900" />
          </button>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-start p-8 overflow-y-auto">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8"
          >
            <X className="w-8 h-8 text-gray-900" />
          </button>

          <nav className="flex flex-col gap-6 items-center w-full max-w-md mt-12">
            {menuItems.map((item) =>
              "subs" in item ? (
                <div key={item.label} className="flex flex-col items-center gap-3 w-full">
                  <button
                    onClick={() => toggleMobileCategory(item.label)}
                    className="text-4xl font-handwritten text-gray-900 hover:text-gray-600 transition flex items-center gap-2"
                  >
                    {item.label}
                    <ChevronDown 
                      className={`w-6 h-6 transition-transform ${
                        mobileOpenCategory === item.label ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {/* Subcategories - Only show when clicked */}
                  {mobileOpenCategory === item.label && (
                    <div className="flex flex-col items-center gap-2 mt-2">
                      {item.subs!.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileOpenCategory(null);
                          }}
                          className="block text-lg text-gray-600 hover:text-gray-900 transition"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-handwritten text-gray-900 hover:text-gray-600 transition"
                >
                  {item.label}
                </Link>
              )
            )}

            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout(navigate);
                  setMobileMenuOpen(false);
                }}
                className="text-4xl font-handwritten text-gray-900 hover:text-gray-600 transition mt-4"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-handwritten text-gray-900 hover:text-gray-600 transition mt-4"
              >
                LOGIN
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}