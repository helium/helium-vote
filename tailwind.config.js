module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "hv-red": {
          600: "#401c2b",
          700: "#752e49",
          800: "#E43B70",
          900: "#1f161d",
        },
        "hv-green": {
          800: "#13413e",
          900: "#162822",
        },
        "hv-blue": {
          500: "#009FF9",
        },
        "hv-turquoise": {
          700: "#124b4b",
        },
        "hv-gray": {
          500: "#343847",
          700: "#131419",
          800: "#2E303B",
          900: "#131419",
        },
      },
    },
    fontFamily: {
      sans: ['"DM Sans"', "sans-serif"],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
