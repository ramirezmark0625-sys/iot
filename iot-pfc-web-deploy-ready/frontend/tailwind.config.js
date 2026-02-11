/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Arial']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.10)'
      }
    },
  },
  plugins: [],
}
