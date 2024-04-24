/** @type {import('tailwindcss').Config} */
export default {
  content: ["./legacy/dev-application/**/*.{php,phtml,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["nord", "retro"],
  },
}

