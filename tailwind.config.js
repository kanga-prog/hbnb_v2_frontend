/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"  // Scan tous tes fichiers React
  ],
  theme: {
    extend: {
      colors: {
        brandRed: "#E63946",
        brandGray: "#F1FAEE",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
