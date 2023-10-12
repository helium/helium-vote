export const COLORS = [
  { background: "green", text: "black" },
  { background: "blue", text: "white" },
  { background: "purple", text: "white" },
  { background: "orange", text: "white" },
];

export const getBackgroundColor = (i) => {
  return COLORS[i % COLORS.length].background;
};

export const getTextColor = (i) => {
  return COLORS[i % COLORS.length].text;
};
