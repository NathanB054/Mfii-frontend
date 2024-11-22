/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        customPurple: '#380075',
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};