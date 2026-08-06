module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crews: {
          asphalt: '#111827',     // Deep dark background
          charcoal: '#1F2937',    // Card background
          slate: '#374151',       // Borders and dividers
          orange: '#F97316',      // Safety Orange (Primary Action)
          yellow: '#EAB308',      // High-vis yellow (Flags/Alerts)
          green: '#22C55E',       // Go/Approved status
          red: '#EF4444',         // Stop/Denied status
        }
      }
    },
  },
  plugins: [],
}