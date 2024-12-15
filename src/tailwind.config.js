/** @type {import('tailwindcss').Config} */
export default {
  content: ["./legacy/dev-application/**/*.{php,phtml,js}", "./public/cache/*"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["nord", "retro", 'cyberpunk', 'valentine', 'aqua'],
  },
}

