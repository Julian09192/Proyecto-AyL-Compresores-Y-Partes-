/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#f59e0b",
        "brand-dark": "#d97706",
        "brand-soft": "#fff7e6",
        ink: "#172033",
        line: "#e5e7eb",
      },
    },
  },
  plugins: [],
};
