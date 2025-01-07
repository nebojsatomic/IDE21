/** @type {import('tailwindcss').Config} */
export default {
  content: ["/var/www/html/legacy/dev-application/**/*.{php,phtml,js}", "/var/www/html/public/cacheAll/*"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["nord", "retro", 'cyberpunk', 'valentine', 'aqua'],
  },
}

