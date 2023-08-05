module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      typography(theme) {
        return {
          dark: {
            css: {
              color: theme("colors.gray.300"),
              '[class~="lead"]': { color: theme("colors.gray.400") },
              a: { color: theme("colors.gray.100") },
              strong: { color: theme("colors.gray.100") },
              ul: { marginTop: "-10px", marginBottom: 0 },
              "ul > li::before": { backgroundColor: theme("colors.gray.700") },
              hr: { borderColor: theme("colors.gray.800") },
              blockquote: {
                color: theme("colors.gray.100"),
                borderLeftColor: theme("colors.gray.800"),
              },
              h1: { color: theme("colors.gray.100"), margin: 0 },
              h2: { color: theme("colors.gray.100"), margin: 0 },
              h3: { color: theme("colors.gray.100"), margin: 0 },
              h4: { color: theme("colors.gray.100"), margin: 0 },
              code: { color: theme("colors.gray.100") },
              "a code": { color: theme("colors.gray.100") },
              pre: {
                color: theme("colors.gray.200"),
                backgroundColor: theme("colors.gray.800"),
              },
              thead: {
                color: theme("colors.gray.100"),
                borderBottomColor: theme("colors.gray.700"),
              },
              "tbody tr": { borderBottomColor: theme("colors.gray.800") },
            },
          },
        };
      },
      colors: {
        "hv-red": {
          500: "#FF625A",
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
          400: "#00AFF9",
          500: "#474DFF",
          700: "#009FF9",
        },
        "hv-turquoise": {
          700: "#124b4b",
        },
        "hv-purple": {
          500: "#B14FFF",
        },
        "hv-gray": {
          200: "#737373",
          300: "#b4b4b4",
          350: "#666666",
          375: "#606060",
          400: "#535353",
          450: "#434343",
          475: "#404040",
          500: "#343434",
          550: "#3f3f3f",
          700: "#131419",
          750: "#272727",
          775: "#2d2d2d",
          800: "#2E303B",
          900: "#131419",
          1000: "#1D1D1D",
          1100: "#0D0D0D",
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
    extend: { typography: ["dark"] },
  },
  plugins: [require("@tailwindcss/typography")],
};
