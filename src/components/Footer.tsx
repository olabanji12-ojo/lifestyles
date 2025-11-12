import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useState, FormEvent } from 'react';

const navLinks = [
  { label: 'SHOP', href: '#shop' },
  { label: 'PERSONALISE', href: '#personalise' },
  { label: 'BE INSPIRED', href: '#inspired' },
  { label: 'ABOUT US', href: '#about' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    setMessage('Thank you for subscribing!');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-black text-white pt-24 pb-16 px-6 mt-0" role="contentinfo">
      <div className="max-w-screen-lg mx-auto">
        <h2 
          className="font-serif text-4xl sm:text-5xl tracking-[0.15em] text-center mb-10"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          INSPIRE
        </h2>

        <nav aria-label="Footer navigation">
          <ul 
            className="flex flex-wrap justify-center gap-8 sm:gap-12 my-12"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {navLinks.map((link, index) => (
              <li 
                key={link.label}
                data-aos="fade-up"
                data-aos-delay={300 + (index * 100)}
              >
                <a
                  href={link.href}
                  className="text-xs tracking-[0.15em] text-gray-400 hover:text-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded px-2 py-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center gap-0 my-14 max-w-md mx-auto"
          aria-label="Newsletter subscription"
          data-aos="zoom-in"
          data-aos-delay="400"
          data-aos-duration="800"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL"
            required
            className="w-full sm:w-auto bg-transparent border border-yellow-600 sm:border-r-0 px-6 py-4 text-sm tracking-[0.1em] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-yellow-600 text-black px-8 py-4 text-xs tracking-[0.15em] font-bold hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50"
          >
            {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>

        {message && (
          <p className="text-center text-green-400 text-sm mb-6" role="status">
            {message}
          </p>
        )}

        <div 
          className="flex justify-center gap-8 my-12" 
          role="navigation" 
          aria-label="Social media"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded"
            aria-label="Follow us on Instagram"
            data-aos="zoom-in"
            data-aos-delay="700"
          >
            <Instagram className="w-6 h-6 text-yellow-600 hover:text-white transition-colors" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded"
            aria-label="Follow us on Facebook"
            data-aos="zoom-in"
            data-aos-delay="800"
          >
            <Facebook className="w-6 h-6 text-yellow-600 hover:text-white transition-colors" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded"
            aria-label="Follow us on Twitter"
            data-aos="zoom-in"
            data-aos-delay="900"
          >
            <Twitter className="w-6 h-6 text-yellow-600 hover:text-white transition-colors" />
          </a>
        </div>

        <p 
          className="text-center text-xs tracking-[0.1em] text-gray-600 mt-16"
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          © 2025 INSPIRE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}