/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'brand-emerald': '#10b981', // Tailwind Emerald 500
        'brand-dark': '#0f172a',    // Tailwind Slate 900
        'brand-surface': '#1e293b'  // Tailwind Slate 800
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
