/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8", // Customize your primary brand color here (Example: blue-700)
        secondary: "#64748b", // Example: slate-500
      },
    },
  },
  plugins: [],
}