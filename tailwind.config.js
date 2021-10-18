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
          500: "#20DEB0",
          800: "#13413e",
          900: "#162822",
        },
        "hv-blue": {
          500: "#009FF9",
        },
        "hv-turquoise": {
          700: "#124b4b",
        },
        "hv-purple": {
          500: "#7B61FF",
        },
        "hv-gray": {
          200: "#737373",
          300: "#b4b4b4",
          400: "#535353",
          450: "#434343",
          500: "#343434",
          700: "#131419",
          750: "#272727",
          800: "#2E303B",
          900: "#131419",
          1000: "#1D1D1D",
        },
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
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
