const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["src/components/**/*.js", "pages/**/*.js"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    minHeight: {
      0: "0",

      "1/4": "25%",

      "1/2": "50%",

      "3/4": "75%",

      full: "100%",
    },
    extend: {
      gridTemplateRows: {
        moveHeight: "repeat(3, 2.25rem)",
      },
      fontFamily: {
        display: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        // fyi
        //
        // amber: colors.amber,
        // cyan: colors.cyan,
        // emerald: colors.emerald,
        // fuchsia: colors.fuchsia,
        // lightBlue: colors.lightBlue,
        // lime: colors.lime,
        // orange: colors.orange,
        rose: colors.rose,
        // teal: colors.teal,
        // violet: colors.violet,
        // trueGray: colors.trueGray,
        // warmGray: colors.warmGray,
        // blueGray: colors.blueGray,
        // coolGray: colors.coolGray,

        // use when possible for sanity
        primary: colors.coolGray,
        secondary: colors.blue,
        primaryAction: colors.amber,
        secondaryAction: colors.violet,
      },
      backgroundImage: (theme) => ({
        heart: "url('/noun_Heart_170033.svg')",
        heartFilled: "url('/noun_Heart_396283.svg')",
      }),
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
      backgroundColor: ["disabled"],
    },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/forms")],
};
