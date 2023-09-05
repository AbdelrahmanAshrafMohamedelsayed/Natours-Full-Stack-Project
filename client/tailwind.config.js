/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#55c57a",
        nav: "#444",
        preW: "#f7f7f7",
        // "coral-red": "#FF6452",
        // "slate-gray": "#6D6D6D",
        // "pale-blue": "#F5F6FF",
        // "white-400": "rgba(255, 255, 255, 0.80)",
      },
    },
  },
  plugins: [],
};
