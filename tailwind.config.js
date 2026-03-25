/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        kaily: {
          blue: '#4A90D9',
          'blue-light': '#E8F0F9',
          'blue-bubble': '#BAD0EB',
          yellow: '#F5C518',
        },
      },
    },
  },
  plugins: [],
}
