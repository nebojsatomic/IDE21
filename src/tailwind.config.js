/** @type {import('tailwindcss').Config} */
export default {
  content: ["/var/www/html/legacy/dev-application/**/*.{html,php,phtml,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["nord", "retro", 'cyberpunk', 'valentine', 'aqua'],
  },
}

