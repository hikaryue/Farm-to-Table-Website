/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        'website-green': '#538457',
        'website-brown': '#847053',
        'website-lighter-green': '#74B67A',
        'website-red': '#A35050',
        'website-yellow': '#D4B654',
      },
      fontFamily: {
        amaranth: ['Amaranth', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

