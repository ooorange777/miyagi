/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "garden",
      {
        dim: {
          ...require("daisyui/src/theming/themes")["dim"],
          "secondary-content": "oklch(85.5163% .012821 261.069149)",
          accent: "oklch(42.6213% .074405 224.389184)",
        },
      },
    ],
  },
};
