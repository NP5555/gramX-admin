/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E5',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFD966',
          400: '#FFCD4D',
          500: '#FFC107',
          600: '#E6AC00',
          700: '#B38600',
          800: '#806100',
          900: '#4D3A00',
        },
      },
    },
  },
  plugins: [],
}