// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // other paths where Tailwind should look for classes
  ],
  plugins: [
    require('tailwind-scrollbar-hide'),
    // other plugins if you have them
  ],
};
