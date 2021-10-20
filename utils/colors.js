export const COLORS = [
  { background: "bg-hv-green-500", text: "text-black" },
  { background: "bg-hv-blue-700", text: "text-white" },
  { background: "bg-hv-purple-500", text: "text-white" },
];

export const getColorClass = (i) => {
  return COLORS[i % COLORS.length].background;
};

export const getTextColorClass = (i) => {
  return COLORS[i % COLORS.length].text;
};
