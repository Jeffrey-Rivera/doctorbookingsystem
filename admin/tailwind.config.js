/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary': "#ffcbd0", // Primary color
        'primary-light': "#FFA2AD", // Light color for hover
      }
    },
  },
  plugins: [],
}