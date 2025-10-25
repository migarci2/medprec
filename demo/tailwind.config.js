/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#157E1F",
          secondary: "#4CBA63",
          bg: "#FEFFFE",
        },
      },
    },
  },
  plugins: [],
}
