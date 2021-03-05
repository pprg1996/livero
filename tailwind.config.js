module.exports = {
  plugins: [require("@tailwindcss/aspect-ratio")],
  theme: {
    extend: {
      scale: {
        "-1": "-1",
      },
    },
  },
};
