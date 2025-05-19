// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors"; // Make sure colors is imported
import formsPlugin from "@tailwindcss/forms";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        slate: {
          ...colors.slate,
          850: "#1c273acc",
        },
        stone: {
          ...colors.stone,
          50: "#fafaf9",
          100: "#f5f5f4",
        },
        amber: {
          // Amber colors are used for the glow
          ...colors.amber,
        },
        sky: {
          ...colors.sky,
        },
      },
      boxShadow: {
        "top-soft":
          "0 -4px 12px -1px rgb(0 0 0 / 0.07), 0 -2px 4px -2px rgb(0 0 0 / 0.07)",
        subtle: "0 2px 8px 0 rgb(0 0 0 / 0.05)",
        "card-hover":
          "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",

        // MODIFIED: Significantly softer candle light effect
        "candle-light": `
          0 0 10px 2px ${colors.amber[300]}33, /* amber-300 @ ~20% opacity, smaller spread, moderate blur */
          0 0 20px 5px ${colors.amber[200]}26    /* amber-200 @ ~15% opacity, larger blur, slightly larger but still small spread */
        `,

        // MODIFIED: Proportionally softer hover effect for the candle light
        "candle-light-hover": `
          0 0 12px 3px ${colors.amber[300]}40, /* amber-300 @ 25% opacity */
          0 0 22px 6px ${colors.amber[200]}33  /* amber-200 @ ~20% opacity */
        `,
      },
      borderRadius: {
        card: "1rem",
      },
      transitionTimingFunction: {
        "soft-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // Optional: for flicker animation (refer to previous responses for keyframes in globals.css)
      // animation: {
      //   'candle-flicker': 'candleFlickerEffect 3s infinite alternate ease-in-out',
      // },
    },
  },
  plugins: [formsPlugin],
};

export default config;
