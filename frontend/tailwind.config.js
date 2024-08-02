/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/assets/fonts"],
  theme: {
    extend: {
      fontFamily: {
        Effra_Lt: "Effra_Lt",
        Effra_Rg: "Effra_Rg",
        Effra_Md: "Effra_Md",
        Effra_Bd: "Effra_Bd",
        Effra_Hvy: "Effra_Hvy",
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        Interscience: {
          primary: "#009ad7", //Gas Light Blue
          "primary-content": "#DDDDDD", //can still be tweaked or deleted
          secondary: "28265b", //Gas Dark Blue
          "secondary-content": "#DDDDDD", //can still be tweaked or deleted
          accent: "#662483", //Gas Dark Purple
          "accent-content": "#DDDDDD", //can still be tweaked or deleted
          neutral: "#D4D4D4", //neutral light grey color to make object/componend fields
          "base-100": "#FFFFFF", //white background
        },
      },
    ],
  },
};
