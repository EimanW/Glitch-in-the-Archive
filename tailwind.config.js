/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0a0a0c',
        ivory: '#e8e0cc',
        blood: '#b3001b',
        silver: '#8a8a92',
      },
      fontFamily: {
        blackletter: ['"Pirata One"', 'cursive'],
        heading: ['"Cormorant Garamond"', 'serif'],
        typewriter: ['"Special Elite"', 'monospace'],
      },
    },
  },
  plugins: [],
}
