const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/design-components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      inter: "Inter"
    },
    lineHeight: {
      "130": "130%",
    },
    screens: {
      "xs": {"min": "320px", "max": "639px"},
      ...defaultTheme.screens,
    },
    extend: {
      aspectRatio: {
        "4/3": "4 / 3",
      },
      colors: {
        "custom-black": "#333333",
        default: "#FFFFFF",
        primary: "#EE3244",
      },
    },
  },
  plugins: [
    // gradient
  ],
};
