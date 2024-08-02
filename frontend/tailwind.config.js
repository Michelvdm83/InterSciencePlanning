/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/assets/fonts"],
  theme: {
    extend: {
      fontFamily: {
        //for now only Effra_Lt works
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
          primary: "#009ad7",
          "primary-content": "#DDDDDD", //can still be tweaked or deleted
          secondary: "28265b",
          "secondary-content": "#DDDDDD", //can still be tweaked or deleted
          accent: "#662483",
          "accent-content": "#DDDDDD", //can still be tweaked or deleted
          neutral: "#D4D4D4",
          "base-100": "#FFFFFF", //white background
        },
      },
    ],
  },
};
