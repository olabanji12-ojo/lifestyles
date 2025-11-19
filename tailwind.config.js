/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 1. Define the custom 'gold' color for elegant accents
      colors: {
        'gold': {
          500: '#D4AF37', // A sophisticated, classic gold hex code
        },
      },
      // 2. Define the font families for use in the theme
      fontFamily: {
        // Your existing handwritten font
        'handwritten': ['Caveat', 'cursive'],
        // A clean, modern sans-serif for body text, lists, and CTAs
        'sans-serif': ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
};