/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crews: {
          asphalt: '#111827',
          charcoal: '#1F2937',
          slate: '#374151',
          orange: '#F97316',
          yellow: '#EAB308',
          green: '#22C55E',
          red: '#EF4444',
        }
      }
    },
  },
  plugins: [],
};