/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#FF0000',
          yellow: '#FFD700',
          blue: '#0075BE',
          black: '#000000',
        }
      },
      fontFamily: {
        comic: ['Bangers', 'cursive'],
        'comic-text': ['Comic Neue', 'cursive'],
      },
      animation: {
        'lightning': 'lightning 2s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'float': 'float 3s ease-in-out infinite',
        'comic-zoom': 'comic-zoom 0.3s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
};