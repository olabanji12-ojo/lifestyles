/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gold': {
          50: '#FDFCF0',
          100: '#FBF8E1',
          200: '#F7F1C3',
          300: '#F3EAA5',
          400: '#EFE387',
          500: '#D4AF37', // Brand Color
          600: '#B8972E',
          700: '#9C7F25',
          800: '#80671C',
          900: '#644F13',
        },
        'cream': {
          50: '#fdfdfc',
          100: '#f9f9f7', // Editorial Background from Solitude
          200: '#f2f2ed',
          300: '#ecece6',
        }
      },
      fontFamily: {
        'handwritten': ['Caveat', 'cursive'],
        'sans-serif': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['Playfair Display', 'serif'], // Added editorial serif
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -4px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};