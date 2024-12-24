import colors from "./colors.json";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "max-sm": { max: "640px" },
        "max-md": { max: "768px" },
        "max-lg": { max: "1024px" },
        "max-xl": { max: "1280px" },
        "max-2xl": { max: "1536px" },
        petizo: { raw: "(max-height: 780px)" },
      },
      keyframes: {
        appear: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
