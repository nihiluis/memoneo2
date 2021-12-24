module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Mulish", "sans-serif"],
      body: ["Mulish", "sans-serif"],
    },
    extend: {
      colors: {
        cyan: "#9cdbff",
        primary: "#D8D4FF",
      },
      width: {
        96: "24rem",
        128: "32rem",
      },
      margin: {
        96: "24rem",
        128: "32rem",
      },
      sizing: {
        96: "24rem",
        128: "32rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
