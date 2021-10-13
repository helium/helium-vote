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
          900: "#27EE76",
        },
        "hv-gray": {
          500: "#34384748",
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
