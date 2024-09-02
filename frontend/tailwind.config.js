/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/assets/fonts"],
  safelist: [
    "col-start-1",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
    "col-start-8",
    "col-start-9",
    "col-start-10",
    "col-start-11",
    "col-start-12",
    "col-start-13",
    "row-start-1",
    "row-start-2",
  ],
  theme: {
    extend: {
      fontFamily: {
        Effra_Lt: "Effra_Lt",
        Effra_Rg: "Effra_Rg",
        Effra_Md: "Effra_Md",
        Effra_Bd: "Effra_Bd",
        Effra_Hvy: "Effra_Hvy",
      },
      colors: {
        holiday: "#FBF800",
        started: "#768000",
        planned: "#7BB141",
        done: "#1B5D20",
        task: "#F47D01",
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
